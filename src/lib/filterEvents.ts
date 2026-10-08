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

const STOPWORDS = new Set([
  "de", "la", "el", "los", "las", "un", "una", "unos", "unas", "en", "con",
  "y", "o", "a", "al", "del", "que", "para", "por", "no", "muy", "algo",
  "más", "menos", "este", "esta", "estos", "estas", "fin", "finde",
  "semana", "hoy", "mañana", "hay", "tengo", "quiero", "busco", "alguna",
  "alguno", "algún", "alguna",
]);

function stripAccents(text: string): string {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function meaningfulWords(query: string): string[] {
  return stripAccents(query.toLowerCase())
    .split(/\s+/)
    .map((w) => w.replace(/[,.!?¡¿()]/g, ""))
    .filter((w) => w.length > 2 && !STOPWORDS.has(w));
}

export function searchEventsByKeywords(
  events: EventWithRelations[],
  query: string,
  locale: string,
): EventWithRelations[] {
  const words = meaningfulWords(query);
  if (words.length === 0) return events;

  const lang = locale === "en" ? "en" : "es";

  const scored = events.map((event) => {
    const haystack = stripAccents(
      [
        event.title[lang],
        event.description[lang],
        event.category,
        event.venue.neighborhood,
        ...event.tags,
      ]
        .join(" ")
        .toLowerCase(),
    );

    const score = words.filter((word) => haystack.includes(word)).length;
    return { event, score };
  });

  return scored
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ event }) => event);
}

export function getNeighborhoods(events: EventWithRelations[]): string[] {
  return Array.from(new Set(events.map((e) => e.venue.neighborhood))).sort();
}