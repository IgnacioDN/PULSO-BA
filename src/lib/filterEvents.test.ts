import { describe, expect, it } from "vitest";
import { getEvents } from "./data";
import {
  EMPTY_FILTERS,
  filterEvents,
  getNeighborhoods,
  searchEventsByKeywords,
} from "./filterEvents";

describe("filterEvents", () => {
  it("sin filtros devuelve todos los eventos", async () => {
    const events = await getEvents();
    expect(filterEvents(events, EMPTY_FILTERS)).toHaveLength(events.length);
  });

  it("el presupuesto 'free' solo deja eventos gratis", async () => {
    const events = await getEvents();
    const result = filterEvents(events, { ...EMPTY_FILTERS, budget: "free" });
    expect(result.every((e) => e.priceRange.min === 0)).toBe(true);
  });

  it("el presupuesto 'low' respeta el tope de $15.000", async () => {
    const events = await getEvents();
    const result = filterEvents(events, { ...EMPTY_FILTERS, budget: "low" });
    expect(result.every((e) => e.priceRange.min <= 15000)).toBe(true);
  });

  it("filtra por varias categorías a la vez", async () => {
    const events = await getEvents();
    const result = filterEvents(events, { ...EMPTY_FILTERS, categories: ["music", "art"] });
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((e) => e.category === "music" || e.category === "art")).toBe(true);
  });

  it("filtra por barrio", async () => {
    const events = await getEvents();
    const [neighborhood] = getNeighborhoods(events);
    const result = filterEvents(events, { ...EMPTY_FILTERS, neighborhood });
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((e) => e.venue.neighborhood === neighborhood)).toBe(true);
  });

  it("combina filtros con AND y puede devolver vacío", async () => {
    const events = await getEvents();
    const result = filterEvents(events, {
      ...EMPTY_FILTERS,
      budget: "free",
      vibeId: "no-existe",
    });
    expect(result).toEqual([]);
  });
});

describe("searchEventsByKeywords", () => {
  it("ignora stopwords: una consulta que solo las tiene devuelve todo", async () => {
    const events = await getEvents();
    expect(searchEventsByKeywords(events, "quiero algo de la", "es")).toHaveLength(events.length);
  });

  it("encuentra por categoría sin importar tildes ni mayúsculas", async () => {
    const events = await getEvents();
    const result = searchEventsByKeywords(events, "MÚSICA music", "es");
    expect(result.length).toBeGreaterThan(0);
  });

  it("ordena por cantidad de coincidencias", async () => {
    const events = await getEvents();
    const target = events[0];
    const query = `${target.category} ${target.venue.neighborhood}`;
    const result = searchEventsByKeywords(events, query, "es");
    expect(result[0].category === target.category || result[0].venue.neighborhood === target.venue.neighborhood).toBe(true);
  });

  it("devuelve vacío si nada coincide", async () => {
    const events = await getEvents();
    expect(searchEventsByKeywords(events, "zzzqqqxxx", "es")).toEqual([]);
  });
});

describe("getNeighborhoods", () => {
  it("devuelve barrios únicos y ordenados", async () => {
    const events = await getEvents();
    const result = getNeighborhoods(events);
    expect(new Set(result).size).toBe(result.length);
    expect(result).toEqual([...result].sort());
  });
});
