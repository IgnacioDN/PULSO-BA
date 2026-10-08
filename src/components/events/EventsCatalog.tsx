"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { EventCard } from "@/components/events/EventCard";
import { Reveal } from "@/components/ui/Reveal";
import {
  EMPTY_FILTERS,
  filterEvents,
  getNeighborhoods,
  type BudgetOption,
  type WizardFilters,
} from "@/lib/filterEvents";
import type { Category, EventWithRelations } from "@/lib/schemas";

const CATEGORY_OPTIONS: Category[] = ["music", "theater", "food", "nightlife", "art", "social"];
const BUDGET_OPTIONS: BudgetOption[] = ["free", "low", "mid", "any"];

type Props = {
  events: EventWithRelations[];
  locale: string;
  /** Filtro inicial resuelto en el servidor (desde ?category= en la URL). */
  initialCategory?: Category | null;
  /** Filtro inicial resuelto en el servidor (desde ?vibe= en la URL). */
  initialVibeId?: string | null;
  /** Filtro inicial resuelto en el servidor (desde ?neighborhood= en la URL). */
  initialNeighborhood?: string | null;
};

export function EventsCatalog({
  events,
  locale,
  initialCategory = null,
  initialVibeId = null,
  initialNeighborhood = null,
}: Props) {
  const t = useTranslations("Events");
  const tCategories = useTranslations("Categories");
  const tBudget = useTranslations("Hero.budget");

  // El filtro inicial ya viene resuelto por el servidor (ver page.tsx), así
  // que el primer render ya sale filtrado: sin parpadeo de "todo, después
  // se corrige a lo filtrado" cuando se llega desde un link como
  // "Ver todo en Música", una tarjeta de "Explorá por vibra" o un pin del mapa.
  const [filters, setFilters] = useState<WizardFilters>({
    ...EMPTY_FILTERS,
    categories: initialCategory ? [initialCategory] : [],
    vibeId: initialVibeId,
    neighborhood: initialNeighborhood,
  });
  const neighborhoods = useMemo(() => getNeighborhoods(events), [events]);
  const results = useMemo(() => filterEvents(events, filters), [events, filters]);

  function toggleCategory(category: Category) {
    setFilters((current) => {
      const has = current.categories.includes(category);
      return {
        ...current,
        categories: has
          ? current.categories.filter((c) => c !== category)
          : [...current.categories, category],
      };
    });
  }

  return (
    <div>
      {/* Categoría: selección múltiple, igual criterio que en el wizard de la home. */}
      <FilterGroup label={t("categoryLabel")}>
        <Chip
          label={t("allCategories")}
          selected={filters.categories.length === 0}
          onClick={() => setFilters((c) => ({ ...c, categories: [] }))}
        />
        {CATEGORY_OPTIONS.map((category) => (
          <Chip
            key={category}
            label={tCategories(category)}
            selected={filters.categories.includes(category)}
            onClick={() => toggleCategory(category)}
          />
        ))}
      </FilterGroup>

      <FilterGroup label={t("zoneLabel")}>
        <Chip
          label={t("anyZone")}
          selected={filters.neighborhood === null}
          onClick={() => setFilters((c) => ({ ...c, neighborhood: null }))}
        />
        {neighborhoods.map((neighborhood) => (
          <Chip
            key={neighborhood}
            label={neighborhood}
            selected={filters.neighborhood === neighborhood}
            onClick={() => setFilters((c) => ({ ...c, neighborhood }))}
          />
        ))}
      </FilterGroup>

      <FilterGroup label={t("budgetLabel")}>
        <Chip
          label={t("anyBudget")}
          selected={filters.budget === null}
          onClick={() => setFilters((c) => ({ ...c, budget: null }))}
        />
        {BUDGET_OPTIONS.map((option) => (
          <Chip
            key={option}
            label={tBudget(option)}
            selected={filters.budget === option}
            onClick={() => setFilters((c) => ({ ...c, budget: option }))}
          />
        ))}
      </FilterGroup>

      <p className="mb-4 mt-8 text-sm opacity-60">
        {t("resultsCount", { count: results.length })}
      </p>

      {results.length === 0 ? (
        <p className="opacity-60">{t("empty")}</p>
      ) : (
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((event, i) => (
            <li key={event.id}>
              <Reveal delay={(i % 6) * 70}>
                <EventCard event={event} locale={locale} freeLabel={tBudget("free")} />
              </Reveal>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <p className="mb-2 text-sm font-medium opacity-70">{label}</p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function Chip({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
        selected
          ? "border-white bg-white text-neutral-950"
          : "border-white/15 text-white/80 hover:border-white/35"
      }`}
    >
      {label}
    </button>
  );
}