"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { EventCard } from "@/components/events/EventCard";
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
};

export function EventsCatalog({ events, locale }: Props) {
  const t = useTranslations("Events");
  const tCategories = useTranslations("Categories");
  const tBudget = useTranslations("Hero.budget");

  const [filters, setFilters] = useState<WizardFilters>(EMPTY_FILTERS);
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
          {results.map((event) => (
            <li key={event.id}>
              <EventCard event={event} locale={locale} freeLabel={tBudget("free")} />
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
          ? "border-brand-gold bg-brand-gold text-neutral-950"
          : "border-white/15 text-white/80 hover:border-white/35"
      }`}
    >
      {label}
    </button>
  );
}