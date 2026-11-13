import { notFound } from "next/navigation";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Header } from "@/components/layout/Header";
import { Link } from "@/i18n/navigation";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getEventBySlug } from "@/lib/data";
import { formatEventDate, formatPrice, localize } from "@/lib/format";
import { photoCredits } from "@/lib/photoCredits";
import { VenueMap } from "@/components/map/VenueMap";
import { ToggleButton } from "@/components/events/ToggleButton";
import { ReviewsSection } from "@/components/events/ReviewsSection";
import { getEventCommunityStats } from "@/lib/community";
import { toggleFavorite, toggleAttendance, submitReview } from "@/lib/actions/community";
import { getCurrentUser } from "@/lib/supabase/user";
import { isSupabaseConfigured } from "@/lib/supabase/config";

// Cada evento tiene su propio slug: esta ruta SIEMPRE debe resolverse en el
// servidor según el parámetro de la URL, nunca servir una versión cacheada
// o reutilizada de otra página (como el catálogo).
export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

const DT_CLASS = "text-xs font-semibold uppercase tracking-wide opacity-50";
const MAP_CLASS = "h-72 w-full overflow-hidden rounded-2xl sm:h-80";

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

  const stats = await getEventCommunityStats(event.id);
  const supabaseOn = isSupabaseConfigured();
  const loggedIn = Boolean(await getCurrentUser());

  const boundToggleFavorite = toggleFavorite.bind(null, event.slug, event.id);
  const boundToggleAttendance = toggleAttendance.bind(null, event.slug, event.id);
  const boundSubmitReview = submitReview.bind(null, event.slug, event.id);

  const favoriteLabel = `Favorito${stats.favoriteCount > 0 ? ` · ${stats.favoriteCount}` : ""}`;
  const attendanceLabel = `Voy${stats.attendanceCount > 0 ? ` · ${stats.attendanceCount}` : ""}`;
  const gradient = `linear-gradient(135deg, ${c1}cc, ${c2}80 55%, ${c3}40)`;

  return (
    <>
      <Header />
      <main>
        {/* Cabecera con la foto real de la categoría y el degradé de la vibra.
            Es la "galería" por ahora: con datos de demostración, una foto
            curada por evento queda para cuando haya contenido real. */}
        <div className="relative h-64 sm:h-80">
          <Image src={`${categoryPhoto.url}?auto=format&fit=crop&w=1600&q=75`} alt="" fill priority sizes="100vw" className="object-cover" />
          <div aria-hidden="true" className="absolute inset-0" style={{ background: gradient }} />
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 mx-auto w-full max-w-6xl px-4 py-6 text-white">
            <Link href="/events" className="text-sm font-medium text-white/80 hover:text-white">← {t("back")}</Link>
            <p className="mt-3 text-xs font-medium uppercase tracking-wide text-white/70">{tCategories(event.category)} · {event.venue.neighborhood}</p>
            <SectionHeading as="h1" className="mt-1 text-3xl sm:text-4xl">{localize(event.title, locale)}</SectionHeading>
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
                      <li key={act} className="rounded-full border border-white/15 bg-white/[0.03] px-3 py-1 text-sm">{act}</li>
                    ))}
                  </ul>
                </div>
              )}

              {event.tags.length > 0 && (
                <div className="mt-8 flex flex-wrap gap-2">
                  {event.tags.map((tag) => (
                    <span key={tag} className="text-sm opacity-50">#{tag}</span>
                  ))}
                </div>
              )}

              {/* Mapa embebido, centrado y acercado al lugar exacto del evento.
                  Si falta la clave de Google Maps, VenueMap ya se encarga de
                  mostrar un mensaje claro en vez de romper la página. */}
              <div className="mt-10">
                <p className="mb-3 text-sm font-semibold opacity-70">{t("locationLabel")}</p>
                <VenueMap venues={[event.venue]} center={{ lat: event.venue.lat, lng: event.venue.lng }} zoom={15} className={MAP_CLASS} />
              </div>

              {/* Comunidad: solo aparece si Supabase está configurado. */}
              {supabaseOn && <ReviewsSection stats={stats} action={boundSubmitReview} loggedIn={loggedIn} locale={locale} />}
            </div>

            {/* Ficha de datos: fecha, lugar y precio, siempre visibles al costado. */}
            <aside className="h-fit rounded-2xl border border-white/15 bg-white/[0.03] p-5">
              {supabaseOn && (
                <div className="mb-5 flex flex-wrap gap-2">
                  <ToggleButton action={boundToggleFavorite} initialActive={stats.isFavorited} activeLabel={favoriteLabel} inactiveLabel={favoriteLabel} icon="heart" loggedIn={loggedIn} />
                  <ToggleButton action={boundToggleAttendance} initialActive={stats.isAttending} activeLabel={attendanceLabel} inactiveLabel={attendanceLabel} icon="check" loggedIn={loggedIn} />
                </div>
              )}
              <dl className="space-y-4">
                <div>
                  <dt className={DT_CLASS}>{t("dateLabel")}</dt>
                  <dd className="mt-1">{formatEventDate(event.startsAt, locale)}</dd>
                </div>
                <div>
                  <dt className={DT_CLASS}>{t("venueLabel")}</dt>
                  <dd className="mt-1">
                    {event.venue.name}
                    <br />
                    <span className="opacity-70">{event.venue.address}</span>
                  </dd>
                </div>
                <div>
                  <dt className={DT_CLASS}>{t("priceLabel")}</dt>
                  <dd className="mt-1">{formatPrice(event.priceRange, locale, tBudget("free"))}</dd>
                </div>
              </dl>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}
