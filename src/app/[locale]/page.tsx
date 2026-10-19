import { getTranslations, setRequestLocale } from "next-intl/server";
import { Header } from "@/components/layout/Header";
import { EventsCatalog } from "@/components/events/EventsCatalog";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getEvents } from "@/lib/data";
import type { Category } from "@/lib/schemas";

const VALID_CATEGORIES: Category[] = ["music", "theater", "food", "nightlife", "art", "social"];

// Misma razón que en /events/[slug]: esta página depende de query params
// (?category=, ?vibe=, ?neighborhood=) y nunca debe quedar cacheada con
// los filtros de una visita anterior.
export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string; vibe?: string; neighborhood?: string }>;
};

export default async function EventsPage({ params, searchParams }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const { category, vibe, neighborhood } = await searchParams;
  const initialCategory = VALID_CATEGORIES.includes(category as Category)
    ? (category as Category)
    : null;

  const t = await getTranslations("Events");
  const events = await getEvents();

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-6xl px-4 py-10">
        <SectionHeading as="h1" className="text-3xl sm:text-4xl">
          {t("title")}
        </SectionHeading>
        <p className="mt-2 mb-8 opacity-70">{t("subtitle")}</p>

        <EventsCatalog
          events={events}
          locale={locale}
          initialCategory={initialCategory}
          initialVibeId={vibe ?? null}
          initialNeighborhood={neighborhood ?? null}
        />
      </main>
    </>
  );
}