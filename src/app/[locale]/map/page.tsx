import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Header } from "@/components/layout/Header";
import { VenueMap } from "@/components/map/VenueMap";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Link } from "@/i18n/navigation";
import { getEvents, getVenues } from "@/lib/data";

type Props = { params: Promise<{ locale: string }> };

export default async function MapPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("MapPage");
  const venues = await getVenues();
  const events = await getEvents();

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-6xl px-4 py-10">
        <SectionHeading as="h1" className="text-3xl sm:text-4xl">
          {t("title")}
        </SectionHeading>
        <p className="mt-2 mb-8 opacity-70">{t("subtitle")}</p>

        <VenueMap venues={venues} />

        <div className="mt-10">
          <h2 className="mb-4 text-lg font-semibold">{t("listTitle")}</h2>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {venues.map((venue) => {
              const venueEvents = events.filter((e) => e.venueId === venue.id);
              const photoUrl = venueEvents.find((e) => e.photo)?.photo?.url;
              return (
                <li key={venue.id} className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] transition hover:-translate-y-0.5 hover:border-brand-celeste/50">
                  {photoUrl && (
                    <div className="relative h-32">
                      <Image src={`${photoUrl}?auto=format&fit=crop&w=600&q=70`} alt="" fill sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw" className="object-cover" />
                      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      <span className="absolute bottom-2 left-3 rounded-full bg-black/55 px-2.5 py-0.5 text-xs font-semibold text-white backdrop-blur-sm">
                        {venueEvents.length} {venueEvents.length === 1 ? "evento" : "eventos"}
                      </span>
                    </div>
                  )}
                  <div className="p-4">
                    <p className="font-medium">{venue.name}</p>
                    <p className="text-sm text-white/70">{venue.neighborhood}</p>
                    <Link href={`/events?neighborhood=${encodeURIComponent(venue.neighborhood)}`} className="mt-2 inline-block text-sm font-medium text-brand-celeste hover:underline">
                      {t("viewEvents")}
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </main>
    </>
  );
}