"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import {
  EMPTY_FILTERS,
  filterEvents,
  getNeighborhoods,
  searchEventsByKeywords,
  type BudgetOption,
  type WizardFilters,
} from "@/lib/filterEvents";
import type { Category, EventWithRelations } from "@/lib/schemas";
import { formatEventDate, formatPrice, localize } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";

type Step = "intro" | "budget" | "category" | "zone" | "results";

const STEP_ORDER: Step[] = ["intro", "budget", "category", "zone", "results"];
const BUDGET_OPTIONS: BudgetOption[] = ["free", "low", "mid", "any"];
const CATEGORY_OPTIONS: Category[] = ["music", "theater", "food", "nightlife", "art", "social"];

const HERO_IMAGES = [
  { src: "/hero/hero-1-obelisco.jpg" },
  { src: "/hero/hero-2-noche-museos.jpg" },
  { src: "/hero/hero-3-planetario.jpg" },
];

const QUERY_EXAMPLES = [
  "jazz en San Telmo, no muy caro",
  "planes gratis este finde",
  "teatro under un viernes a la noche",
  "algo de tango en Almagro",
  "buena previa en Palermo",
];

const stepVariants = {
  enter: { opacity: 0, x: 24 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -24 },
};

type Props = {
  events: EventWithRelations[];
  locale: string;
};

export function Hero({ events, locale }: Props) {
  const t = useTranslations("Hero");
  const tCategories = useTranslations("Categories");
  const [step, setStep] = useState<Step>("intro");
  const [filters, setFilters] = useState<WizardFilters>(EMPTY_FILTERS);
  const [query, setQuery] = useState("");
  const [exampleIndex, setExampleIndex] = useState(0);
  const [activeSlide, setActiveSlide] = useState(0);

  const neighborhoods = useMemo(() => getNeighborhoods(events), [events]);

  const results = useMemo(() => {
    const base = filterEvents(events, filters);
    return query.trim() ? searchEventsByKeywords(base, query, locale) : base;
  }, [events, filters, query, locale]);

  const stepIndex = STEP_ORDER.indexOf(step);

  useEffect(() => {
    const id = window.setInterval(() => {
      setExampleIndex((i) => (i + 1) % QUERY_EXAMPLES.length);
    }, 3200);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      setActiveSlide((i) => (i + 1) % HERO_IMAGES.length);
    }, 6000);
    return () => window.clearInterval(id);
  }, []);

  function goTo(next: Step) {
    setStep(next);
  }

  function goBack() {
    const prevIndex = Math.max(0, stepIndex - 1);
    setStep(STEP_ORDER[prevIndex]);
  }

  function restart() {
    setFilters(EMPTY_FILTERS);
    setQuery("");
    setStep("intro");
  }

  function handleConversationalSearch(e: React.FormEvent) {
    e.preventDefault();
    goTo("results");
  }

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
    <section className="relative overflow-hidden bg-neutral-950 text-white">
      {HERO_IMAGES.map((image, i) => (
        <Image
          key={image.src}
          src={image.src}
          alt=""
          fill
          priority={i === 0}
          sizes="100vw"
          className={`object-cover object-center transition-opacity duration-[1500ms] ease-in-out ${
            i === activeSlide ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-neutral-950/70" />

      <div className="relative mx-auto flex min-h-[560px] w-full max-w-4xl flex-col justify-center px-4 py-16">
        {step !== "intro" && (
          <div className="mb-8 flex items-center gap-4">
            <button
              type="button"
              onClick={goBack}
              className="text-sm font-medium text-white/70 transition hover:text-white"
            >
              ← {t("back")}
            </button>
            <div className="flex-1">
              <div className="h-1 w-full overflow-hidden rounded-full bg-white/15">
                <div
                  className="h-full rounded-full bg-white transition-all duration-300"
                  style={{ width: `${(stepIndex / (STEP_ORDER.length - 1)) * 100}%` }}
                />
              </div>
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            {step === "intro" && (
              <div>
                <h1 className="font-display font-bold text-4xl leading-tight tracking-tight sm:text-6xl">
                  {t("question")}
                </h1>
                <p className="mt-5 max-w-xl text-lg text-white/70">{t("conversationalHint")}</p>

                <form onSubmit={handleConversationalSearch} className="mt-8 max-w-xl">
                  <div className="flex items-center gap-2 rounded-full border border-white/25 bg-white/10 py-1.5 pl-5 pr-1.5 backdrop-blur-sm transition focus-within:border-white/50">
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder={QUERY_EXAMPLES[exampleIndex]}
                      aria-label={t("conversationalHint")}
                      className="min-w-0 flex-1 bg-transparent py-2 text-sm text-white placeholder-white/50 outline-none sm:text-base"
                    />
                    <Button type="submit" className="shrink-0">
                      {t("results.aiSearch")}
                    </Button>
                  </div>
                </form>

                <button
                  type="button"
                  onClick={() => goTo("budget")}
                  className="mt-4 text-sm font-medium text-white/60 underline-offset-4 transition hover:text-white hover:underline"
                >
                  {t("orStepByStep")}
                </button>
              </div>
            )}

            {step === "budget" && (
              <StepGrid title={t("budget.title")} hint={t("budget.hint")}>
                {BUDGET_OPTIONS.map((option) => (
                  <OptionButton
                    key={option}
                    label={t(`budget.${option}`)}
                    selected={filters.budget === option}
                    onClick={() => {
                      setFilters((c) => ({ ...c, budget: option }));
                      goTo("category");
                    }}
                  />
                ))}
              </StepGrid>
            )}

            {step === "category" && (
              <div>
                <StepGrid title={t("category.title")} hint={t("category.hint")}>
                  {CATEGORY_OPTIONS.map((category) => (
                    <OptionButton
                      key={category}
                      label={tCategories(category)}
                      selected={filters.categories.includes(category)}
                      onClick={() => toggleCategory(category)}
                    />
                  ))}
                </StepGrid>
                <Button type="button" onClick={() => goTo("zone")} className="mt-8">
                  {t("start")} →
                </Button>
              </div>
            )}

            {step === "zone" && (
              <div>
                <div
                  aria-hidden="true"
                  className="mb-6 h-28 w-full rounded-2xl border border-white/10 bg-[linear-gradient(120deg,#1e293b,#334155)] bg-[length:20px_20px] bg-[radial-gradient(circle,rgba(255,255,255,0.15)_1px,transparent_1px)]"
                />
                <StepGrid title={t("zone.title")} hint={t("zone.hint")}>
                  <OptionButton
                    label={t("zone.any")}
                    selected={filters.neighborhood === null}
                    onClick={() => {
                      setFilters((c) => ({ ...c, neighborhood: null }));
                      goTo("results");
                    }}
                  />
                  {neighborhoods.map((neighborhood) => (
                    <OptionButton
                      key={neighborhood}
                      label={neighborhood}
                      selected={filters.neighborhood === neighborhood}
                      onClick={() => {
                        setFilters((c) => ({ ...c, neighborhood }));
                        goTo("results");
                      }}
                    />
                  ))}
                </StepGrid>
              </div>
            )}

            {step === "results" && (
              <div>
                <SectionHeading className="text-2xl sm:text-3xl">{t("results.title")}</SectionHeading>
                <p className="mt-2 text-white/70">
                  {t("results.subtitleWithCount", { count: results.length })}
                </p>

                {results.length === 0 && (
                  <p className="mt-4 text-white/60">{t("results.empty")}</p>
                )}

                <ul className="mt-6 grid gap-4 sm:grid-cols-2">
                  {results.slice(0, 6).map((event) => {
                    const [c1, c2] = event.vibe.palette;
                    return (
                      <li
                        key={event.id}
                        className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm"
                      >
                        <div
                          aria-hidden="true"
                          className="h-12 w-12 shrink-0 rounded-lg"
                          style={{ background: `linear-gradient(135deg, ${c1}, ${c2})` }}
                        />
                        <div className="min-w-0">
                          <p className="truncate font-semibold">{localize(event.title, locale)}</p>
                          <p className="truncate text-sm text-white/60">
                            {formatEventDate(event.startsAt, locale)} ·{" "}
                            {formatPrice(event.priceRange, locale, t("budget.free"))}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ul>

                <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-5">
                  <p className="font-semibold">{t("results.aiTitle")}</p>
                  <form
                    className="mt-3 flex flex-col gap-2 sm:flex-row"
                    onSubmit={(e) => e.preventDefault()}
                  >
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder={t("results.aiPlaceholder")}
                      className="flex-1 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white placeholder-white/40 outline-none focus:border-white/50"
                    />
                    <Button type="submit">{t("results.aiSearch")}</Button>
                  </form>
                  <p className="mt-2 text-xs text-white/50">{t("results.aiNote")}</p>
                </div>

                <Button type="button" variant="ghost" onClick={restart} className="mt-6 !px-0 hover:underline">
                  {t("results.restart")}
                </Button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {HERO_IMAGES.map((image, i) => (
          <button
            key={image.src}
            type="button"
            onClick={() => setActiveSlide(i)}
            aria-label={`Foto ${i + 1} de ${HERO_IMAGES.length}`}
            aria-current={i === activeSlide}
            className={`h-1.5 rounded-full transition-all ${
              i === activeSlide ? "w-6 bg-white" : "w-1.5 bg-white/40 hover:bg-white/60"
            }`}
          />
        ))}
      </div>
    </section>
  );
}

function StepGrid({
  title,
  hint,
  children,
}: {
  title: string;
  hint: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <SectionHeading className="text-2xl sm:text-3xl">{title}</SectionHeading>
      <p className="mt-2 text-white/60">{hint}</p>
      <div className="mt-6 flex flex-wrap gap-3">{children}</div>
    </div>
  );
}

function OptionButton({
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
      className={`rounded-full border px-5 py-2.5 text-sm font-medium transition ${
        selected
          ? "border-white bg-white text-neutral-950"
          : "border-white/25 bg-white/5 text-white hover:border-white/50"
      }`}
    >
      {label}
    </button>
  );
}