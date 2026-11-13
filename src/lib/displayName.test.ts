import { describe, expect, it } from "vitest";
import { displayNameFromEmail } from "./displayName";

describe("displayNameFromEmail", () => {
  it("usa solo la parte anterior a la @", () => {
    expect(displayNameFromEmail("ignacio.diaz@gmail.com")).toBe("ignacio.diaz");
  });

  it("nunca devuelve el dominio", () => {
    expect(displayNameFromEmail("ana@empresa.com")).not.toContain("empresa");
  });

  it("acorta nombres largos a 24 caracteres", () => {
    expect(displayNameFromEmail(`${"a".repeat(40)}@x.com`)).toHaveLength(24);
  });

  it("limpia caracteres raros y tiene un respaldo", () => {
    expect(displayNameFromEmail("a+b c@x.com")).toBe("abc");
    expect(displayNameFromEmail("+++@x.com")).toBe("Usuario");
  });
});
