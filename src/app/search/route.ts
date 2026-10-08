import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { z } from "zod";
import { AiFiltersSchema, buildSearchPrompt } from "@/lib/aiSearch";
import { getEvents } from "@/lib/data";
import { getNeighborhoods } from "@/lib/filterEvents";

const RequestSchema = z.object({ query: z.string().trim().min(1).max(300) });

const RATE_LIMIT = 12;
const RATE_WINDOW_MS = 60_000;
const requestLog = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (requestLog.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  recent.push(now);
  requestLog.set(ip, recent);
  return recent.length > RATE_LIMIT;
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") ?? "local";
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Demasiados pedidos, esperá un momento." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  const parsedBody = RequestSchema.safeParse(body);
  if (!parsedBody.success) {
    return NextResponse.json({ error: "Falta la consulta." }, { status: 400 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "La búsqueda con IA no está configurada todavía." }, { status: 503 });
  }

  try {
    const events = await getEvents();
    const neighborhoods = getNeighborhoods(events);

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: buildSearchPrompt(parsedBody.data.query, neighborhoods),
      config: { responseMimeType: "application/json" },
    });

    const text = response.text;
    if (!text) throw new Error("Respuesta vacía de Gemini");

    const json: unknown = JSON.parse(text);
    const filters = AiFiltersSchema.parse(json);

    return NextResponse.json(filters);
  } catch (error) {
    console.error("Error en búsqueda con IA:", error);
    return NextResponse.json({ error: "No pudimos interpretar el pedido." }, { status: 502 });
  }
}