import { getTranslations, setRequestLocale } from "next-intl/server";
import Image from "next/image";
import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/home/Hero";
import { getEvents } from "@/lib/data";
import { formatEventDate, formatPrice, localize } from "@/lib/format";
import { photoCredits } from "@/lib/photoCredits";
import type { Category } from "@/lib/schemas";

type Props = { params: Promise<{ locale: string }> };

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("Home");
  const tCategories = await getTranslations("Categories");
  const events = await getEvents();

  // Eventos agrupados por categoria, para las anclas del header (#music, #theater, ...).
  const categories = Array.from(new Set(events.map((e) => e.category))) as Category[];

  return (
    <>
      <Header />
      <Hero events={events} locale={locale} />

      <main className="mx-auto w-full max-w-6xl px-4 py-14">
        <p className="mb-8 text-sm opacity-50">{t("demoNotice")}</p>

        {categories.map((category) => (
          <section key={category} id={category} className="mb-14 scroll-mt-20">
            <h2 className="mb-4 text-xl font-semibold">{tCategories(category)}</h2>
            <EventGrid
              events={events.filter((e) => e.category === category)}
              category={category}
              locale={locale}
              freeLabel={t("free")}
            />
          </section>
        ))}

        {/* Creditos de fotos: requisito de buena practica, no de la licencia. */}
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

function EventGrid({
  events,
  category,
  locale,
  freeLabel,
}: {
  events: Awaited<ReturnType<typeof getEvents>>;
  category: Category;
  locale: string;
  freeLabel: string;
}) {
  const categoryPhoto = photoCredits.category[category];

  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => {
        const [c1, c2, c3] = event.vibe.palette;
        return (
          <li
            key={event.id}
            className="overflow-hidden rounded-2xl border border-black/10 dark:border-white/15"
          >
            {/* Foto real de la categoria, con el degrade de la vibra del evento
                encima: mantiene la identidad de color sin que todas las
                tarjetas de una misma categoria se vean identicas. */}
            <div className="relative h-32">
              <Image
                src={`${categoryPhoto.url}?auto=format&fit=crop&w=800&q=70`}
                alt=""
                fill
                sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
                className="object-cover"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(135deg, ${c1}cc, ${c2}99 60%, ${c3}66)`,
                }}
              />
            </div>
            <div className="space-y-1 p-4">
              <p className="text-xs font-medium uppercase tracking-wide opacity-60">
                {event.venue.neighborhood}
              </p>
              <h3 className="text-lg font-semibold">{localize(event.title, locale)}</h3>
              <p className="text-sm opacity-70">{formatEventDate(event.startsAt, locale)}</p>
              <p className="text-sm font-medium">{formatPrice(event.priceRange, locale, freeLabel)}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
