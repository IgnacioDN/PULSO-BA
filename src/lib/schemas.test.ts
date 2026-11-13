import { describe, expect, it } from "vitest";
import { EventSchema, ReviewSchema, VibeSchema } from "./schemas";
import { AiFiltersSchema, buildSearchPrompt } from "./aiSearch";
import { getEvents, getVenues, getVibes } from "./data";

const validEvent = {
  id: "e1",
  slug: "jazz-de-sotano",
  title: { es: "Jazz", en: "Jazz" },
  description: { es: "Noche", en: "Night" },
  category: "music",
  vibeId: "v1",
  venueId: "ve1",
  startsAt: "2026-12-01T21:00:00-03:00",
  priceRange: { min: 0, max: 5000, currency: "ARS" },
  images: [],
  tags: [],
};

describe("EventSchema", () => {
  it("acepta un evento válido", () => {
    expect(EventSchema.safeParse(validEvent).success).toBe(true);
  });

  it("rechaza slugs con mayúsculas o espacios", () => {
    expect(EventSchema.safeParse({ ...validEvent, slug: "Jazz De Sotano" }).success).toBe(false);
  });

  it("rechaza fechas sin zona horaria", () => {
    expect(EventSchema.safeParse({ ...validEvent, startsAt: "2026-12-01T21:00:00" }).success).toBe(false);
  });

  it("rechaza precio máximo menor al mínimo", () => {
    const bad = { ...validEvent, priceRange: { min: 100, max: 50, currency: "ARS" } };
    expect(EventSchema.safeParse(bad).success).toBe(false);
  });

  it("rechaza categorías desconocidas", () => {
    expect(EventSchema.safeParse({ ...validEvent, category: "deportes" }).success).toBe(false);
  });
});

describe("VibeSchema", () => {
  it("rechaza colores hex inválidos", () => {
    const vibe = { id: "v", label: { es: "a", en: "a" }, palette: ["#fff", "#000000", "#111111"], tags: [] };
    expect(VibeSchema.safeParse(vibe).success).toBe(false);
  });
});

describe("ReviewSchema", () => {
  const review = {
    id: "r1",
    eventId: "e1",
    userId: "u1",
    rating: 5,
    body: "Muy bueno",
    photos: [],
    createdAt: "2026-12-02T10:00:00Z",
  };

  it("acepta puntajes de 1 a 5", () => {
    expect(ReviewSchema.safeParse(review).success).toBe(true);
  });

  it.each([0, 6, 3.5])("rechaza el puntaje %s", (rating) => {
    expect(ReviewSchema.safeParse({ ...review, rating }).success).toBe(false);
  });
});

describe("AiFiltersSchema", () => {
  it("acepta la forma que pide el prompt", () => {
    const ok = { budget: "low", categories: ["music"], neighborhood: "Palermo", keywords: ["vivo"] };
    expect(AiFiltersSchema.safeParse(ok).success).toBe(true);
  });

  it("rechaza lo que invente el modelo (presupuesto o categoría fuera de la lista)", () => {
    expect(AiFiltersSchema.safeParse({ budget: "caro", categories: [], neighborhood: null, keywords: [] }).success).toBe(false);
    expect(AiFiltersSchema.safeParse({ budget: null, categories: ["cine"], neighborhood: null, keywords: [] }).success).toBe(false);
  });

  it("rechaza más de 4 keywords", () => {
    const many = { budget: null, categories: [], neighborhood: null, keywords: ["a", "b", "c", "d", "e"] };
    expect(AiFiltersSchema.safeParse(many).success).toBe(false);
  });

  it("el prompt incluye la consulta y los barrios", () => {
    const prompt = buildSearchPrompt("algo barato", ["Palermo", "San Telmo"]);
    expect(prompt).toContain("algo barato");
    expect(prompt).toContain("Palermo, San Telmo");
  });
});

describe("datos de demostración", () => {
  it("todos los eventos tienen venue y vibe válidos y slugs únicos", async () => {
    const [events, venues, vibes] = await Promise.all([getEvents(), getVenues(), getVibes()]);
    expect(events.length).toBeGreaterThan(0);
    expect(venues.length).toBeGreaterThan(0);
    expect(vibes.length).toBeGreaterThan(0);
    expect(new Set(events.map((e) => e.slug)).size).toBe(events.length);
  });
});
