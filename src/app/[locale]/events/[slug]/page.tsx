import { notFound } from "next/navigation";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Header } from "@/components/layout/Header";
import { Link } from "@/i18n/navigation";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getEventBySlug } from "@/lib/data";
import { formatEventDate, formatPrice, localize } from "@/lib/format";
import { photoCredits } from "@/lib/photoCredits";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export default async function EventDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const event = await getEventBySlug(slug);
  if (!event) notFound();

  const t = await getTranslations("EventDetail");
  const tCategories = await getTranslations("Categories");
  const tBudget = await getTranslations("Hero.budget");

  const categoryPhoto = photoCredits.category[event.category];
  const [c1, c2, c3] = event.vibe.palette;

  return (
    <>
      <Header />
      <main>
        <div className="relative h-64 sm:h-80">
          <Image
            src={`${categoryPhoto.url}?auto=format&fit=crop&w=1600&q=75`}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{ background: `linear-gradient(135deg, ${c1}cc, ${c2}80 55%, ${c3}40)` }}
          />
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 mx-auto w-full max-w-6xl px-4 py-6 text-white">
            <Link href="/events" className="text-sm font-medium text-white/80 hover:text-white">
              ← {t("back")}
            </Link>
            <p className="mt-3 text-xs font-medium uppercase tracking-wide text-white/70">
              {tCategories(event.category)} · {event.venue.neighborhood}
            </p>
            <SectionHeading as="h1" className="mt-1 text-3xl sm:text-4xl">
              {localize(event.title, locale)}
            </SectionHeading>
          </div>
        </div>

        <div className="mx-auto w-full max-w-6xl px-4 py-10">
          <div className="grid gap-10 md:grid-cols-[1fr_280px]">
            <div>
              <p className="text-lg leading-relaxed">{localize(event.description, locale)}</p>

              {event.lineup && event.lineup.length > 0 && (
                <div className="mt-8">
                  <p className="mb-2 text-sm font-semibold opacity-70">{t("lineupLabel")}</p>
                  <ul className="flex flex-wrap gap-2">
                    {event.lineup.map((act) => (
                      <li
                        key={act}
                        className="rounded-full border border-white/15 bg-white/[0.03] px-3 py-1 text-sm"
                      >
                        {act}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {event.tags.length > 0 && (
                <div className="mt-8 flex flex-wrap gap-2">
                  {event.tags.map((tag) => (
                    <span key={tag} className="text-sm opacity-50">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <aside className="h-fit rounded-2xl border border-white/15 bg-white/[0.03] p-5">
              <dl className="space-y-4">
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide opacity-50">
                    {t("dateLabel")}
                  </dt>
                  <dd className="mt-1">{formatEventDate(event.startsAt, locale)}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide opacity-50">
                    {t("venueLabel")}
                  </dt>
                  <dd className="mt-1">
                    {event.venue.name}
                    <br />
                    <span className="opacity-70">{event.venue.address}</span>
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide opacity-50">
                    {t("priceLabel")}
                  </dt>
                  <dd className="mt-1">
                    {formatPrice(event.priceRange, locale, tBudget("free"))}
                  </dd>
                </div>
              </dl>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}