import { describe, expect, it } from "vitest";
import { formatPrice, localize } from "./format";

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
