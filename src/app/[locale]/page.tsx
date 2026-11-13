import { getTranslations, setRequestLocale } from "next-intl/server";
import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/home/Hero";
import { MarqueeBand } from "@/components/ui/MarqueeBand";
import { HowItWorks } from "@/components/home/HowItWorks";
import { VibeExplorer } from "@/components/home/VibeExplorer";
import { EventCard } from "@/components/events/EventCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Link } from "@/i18n/navigation";
import { getEvents } from "@/lib/data";
import { photoCredits } from "@/lib/photoCredits";
import type { Category } from "@/lib/schemas";

const PREVIEW_COUNT = 2;

type Props = { params: Promise<{ locale: string }> };

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("Home");
  const tCategories = await getTranslations("Categories");
  const events = await getEvents();

  const categories = Array.from(new Set(events.map((e) => e.category))) as Category[];

  return (
    <>
      <Header />
      <Hero events={events} locale={locale} />
      <MarqueeBand />
      <HowItWorks />
      <VibeExplorer events={events} locale={locale} />

      <main className="mx-auto w-full max-w-6xl px-4 py-14">
        <p className="mb-8 text-sm opacity-50">{t("demoNotice")}</p>

        {categories.map((category) => {
          const categoryEvents = events.filter((e) => e.category === category);
          const preview = categoryEvents.slice(0, PREVIEW_COUNT);
          const hasMore = categoryEvents.length > PREVIEW_COUNT;

          return (
            <section key={category} id={category} className="mb-14 scroll-mt-20">
              <Reveal>
                <SectionHeading className="pulso-heading mb-6 text-2xl">{tCategories(category)}</SectionHeading>
              </Reveal>
              <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {preview.map((event, i) => (
                  <li key={event.id}>
                    <Reveal delay={(i % 3) * 90}>
                      <EventCard event={event} locale={locale} freeLabel={t("free")} />
                    </Reveal>
                  </li>
                ))}
              </ul>

              {hasMore && (
                <Link href={`/events?category=${category}`} className="mt-4 inline-block text-sm font-medium text-brand-celeste hover:underline">
                  {t("viewAllIn", { category: tCategories(category) })}
                </Link>
              )}
            </section>
          );
        })}

        <p className="mt-4 text-xs opacity-40">
          Fotos:{" "}
          {Object.values(photoCredits.category)
            .map((c) => c.photographer)
            .join(", ")}{" "}
          / Unsplash
        </p>
      </main>
    </>
  );
}