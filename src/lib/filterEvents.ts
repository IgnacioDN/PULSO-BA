import type { Category, EventWithRelations } from "./schemas";

export type BudgetOption = "free" | "low" | "mid" | "any";

const BUDGET_CEILINGS: Record<BudgetOption, number | null> = {
  free: 0,
  low: 15000,
  mid: 30000,
  any: null,
};

export type WizardFilters = {
  budget: BudgetOption | null;
  categories: Category[];
  neighborhood: string | null;
  vibeId: string | null;
};

export const EMPTY_FILTERS: WizardFilters = {
  budget: null,
  categories: [],
  neighborhood: null,
  vibeId: null,
};

export function filterEvents(
  events: EventWithRelations[],
  filters: WizardFilters,
): EventWithRelations[] {
  const ceiling = filters.budget ? BUDGET_CEILINGS[filters.budget] : null;

  return events.filter((event) => {
    const matchesBudget = ceiling === null || event.priceRange.min <= ceiling;
    const matchesCategory =
      filters.categories.length === 0 || filters.categories.includes(event.category);
    const matchesZone =
      !filters.neighborhood || event.venue.neighborhood === filters.neighborhood;
    const matchesVibe = !filters.vibeId || event.vibeId === filters.vibeId;

    return matchesBudget && matchesCategory && matchesZone && matchesVibe;
  });
}

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