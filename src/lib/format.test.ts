import { describe, expect, it } from "vitest";
import { formatEventParts, formatPrice, localize } from "./format";

describe("localize", () => {
  const field = { es: "Hola", en: "Hello" };
  it("usa inglés solo si el locale es en", () => {
    expect(localize(field, "en")).toBe("Hello");
    expect(localize(field, "es")).toBe("Hola");
    expect(localize(field, "fr")).toBe("Hola");
  });
});

describe("formatPrice", () => {
  it("muestra la etiqueta de gratis cuando el máximo es 0", () => {
    expect(formatPrice({ min: 0, max: 0 }, "es", "Gratis")).toBe("Gratis");
  });

  it("muestra un solo precio si min y max coinciden", () => {
    expect(formatPrice({ min: 5000, max: 5000 }, "es", "Gratis")).toMatch(/5\.000/);
  });

  it("muestra un rango si difieren", () => {
    expect(formatPrice({ min: 5000, max: 10000 }, "es", "Gratis")).toContain("–");
  });
});

describe("formatEventParts", () => {
  it("parte la fecha en día, fecha y hora de Buenos Aires", () => {
    const parts = formatEventParts("2026-11-13T23:30:00-03:00", "es");
    expect(parts.weekday.toLowerCase()).toBe("vie");
    expect(parts.date).toMatch(/13/);
    expect(parts.time).toBe("23:30");
  });

  it("usa la zona horaria de Buenos Aires aunque la fecha venga en UTC", () => {
    expect(formatEventParts("2026-11-14T02:30:00Z", "es").time).toBe("23:30");
  });
});
