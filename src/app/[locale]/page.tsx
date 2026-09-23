import { getTranslations, setRequestLocale } from "next-intl/server";
import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/home/Hero";
import { EventCard } from "@/components/events/EventCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getEvents } from "@/lib/data";
import { photoCredits } from "@/lib/photoCredits";
import type { Category } from "@/lib/schemas";

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

      <main className="mx-auto w-full max-w-6xl px-4 py-14">
        <p className="mb-8 text-sm opacity-50">{t("demoNotice")}</p>

        {categories.map((category) => (
          <section key={category} id={category} className="mb-14 scroll-mt-20">
            <SectionHeading className="mb-4 text-xl">{tCategories(category)}</SectionHeading>
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {events
                .filter((e) => e.category === category)
                .map((event) => (
                  <li key={event.id}>
                    <EventCard event={event} locale={locale} freeLabel={t("free")} />
                  </li>
                ))}
            </ul>
          </section>
        ))}

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