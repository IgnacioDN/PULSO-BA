import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { isSupabaseConfigured } from "@/lib/supabase/config";

// Nunca cacheada: cada llamada tiene que llegar de verdad a Supabase.
export const dynamic = "force-dynamic";

/**
 * Chequeo de salud + "latido" para Supabase.
 *
 * El plan gratis de Supabase pausa los proyectos que pasan una semana sin
 * recibir consultas. Una tarea programada de Vercel (vercel.json) abre esta
 * ruta una vez por día, y la consulta mínima de acá cuenta como actividad.
 * Como bonus, abrirla en el navegador sirve para ver si todo está andando.
 *
 * No expone datos: solo cuenta filas y responde "ok" o un error genérico
 * (el detalle queda en los logs del servidor).
 */
export async function GET() {
  const checkedAt = new Date().toISOString();

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ status: "ok", supabase: "not_configured", checkedAt });
  }

  try {
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { error } = await supabase.from("reviews").select("id", { count: "exact", head: true });

    if (error) {
      console.error("[health] Supabase respondió con error:", error.message);
      return NextResponse.json({ status: "error", supabase: "error", checkedAt }, { status: 503 });
    }

    return NextResponse.json({ status: "ok", supabase: "ok", checkedAt });
  } catch (err) {
    console.error("[health] No se pudo consultar Supabase:", err);
    return NextResponse.json({ status: "error", supabase: "unreachable", checkedAt }, { status: 503 });
  }
}
