import type { Category, EventWithRelations } from "./schemas";

/**
 * Lógica de filtrado del wizard de la home. Vive separada de los componentes
 * a propósito: es una función pura, fácil de testear con Vitest (fase 7)
 * sin tener que renderizar nada.
 */

export type BudgetOption = "free" | "low" | "mid" | "any";

/** null = "sin tope de precio" para esa opción de presupuesto. */
const BUDGET_CEILINGS: Record<BudgetOption, number | null> = {
  free: 0,
  low: 15000,
  mid: 30000,
  any: null,
};

export type WizardFilters = {
  budget: BudgetOption | null;
  categories: Category[]; // vacío = todas las categorías
  neighborhood: string | null; // null = cualquier zona
};

export const EMPTY_FILTERS: WizardFilters = {
  budget: null,
  categories: [],
  neighborhood: null,
};

export function filterEvents(
  events: EventWithRelations[],
  filters: WizardFilters,
): EventWithRelations[] {
  const ceiling = filters.budget ? BUDGET_CEILINGS[filters.budget] : null;

  return events.filter((event) => {
    // Un evento "encaja" en el presupuesto si su precio mínimo no lo supera:
    // así un evento de $0–$20.000 sigue apareciendo para el filtro "Hasta $15.000".
    const matchesBudget = ceiling === null || event.priceRange.min <= ceiling;

    const matchesCategory =
      filters.categories.length === 0 || filters.categories.includes(event.category);

    const matchesZone =
      !filters.neighborhood || event.venue.neighborhood === filters.neighborhood;

    return matchesBudget && matchesCategory && matchesZone;
  });
}

/**
 * Búsqueda por palabras clave sobre título, descripción y tags.
 * Es un reemplazo provisorio: en la fase 5 esta función se sustituye
 * por una llamada a un LLM que interpreta el pedido en lenguaje natural.
 */
export function searchEventsByKeywords(
  events: EventWithRelations[],
  query: string,
  locale: string,
): EventWithRelations[] {
  const words = query
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length > 2);

  if (words.length === 0) return events;

  return events.filter((event) => {
    const lang = locale === "en" ? "en" : "es";
    const haystack = [
      event.title[lang],
      event.description[lang],
      event.category,
      event.venue.neighborhood,
      ...event.tags,
    ]
      .join(" ")
      .toLowerCase();

    return words.some((word) => haystack.includes(word));
  });
}

export function getNeighborhoods(events: EventWithRelations[]): string[] {
  return Array.from(new Set(events.map((e) => e.venue.neighborhood))).sort();
}
