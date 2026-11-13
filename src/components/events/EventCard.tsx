import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { formatEventParts, formatPrice, localize } from "@/lib/format";
import { photoCredits } from "@/lib/photoCredits";
import type { EventWithRelations } from "@/lib/schemas";

type Props = {
  event: EventWithRelations;
  locale: string;
  freeLabel: string;
};

/**
 * Tarjeta tipo cartelera: un "cartel" arriba con el título grande sobre la
 * foto y los colores de la vibra, y abajo los datos que se buscan de un
 * vistazo (día, fecha, hora, precio y lugar).
 */
export function EventCard({ event, locale, freeLabel }: Props) {
  const categoryPhoto = photoCredits.category[event.category];
  const [c1, c2, c3] = event.vibe.palette;
  const when = formatEventParts(event.startsAt, locale);
  const isFree = event.priceRange.max === 0;

  return (
    <Link
      href={`/events/${event.slug}`}
      className="pulso-card group block overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] transition duration-300 hover:-translate-y-1 hover:border-brand-celeste/60 hover:shadow-[0_0_32px_-8px_rgba(56,189,248,0.55)]"
    >
      <div className="relative h-48 overflow-hidden">
        <Image
          src={`${categoryPhoto.url}?auto=format&fit=crop&w=800&q=70`}
          alt=""
          fill
          sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition duration-700 group-hover:scale-110"
        />
        <div aria-hidden="true" className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${c1}d9, ${c2}a6 60%, ${c3}80)` }} />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div aria-hidden="true" className="pulso-shine" />

        <span className="absolute left-3 top-3 rounded-full bg-black/55 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white backdrop-blur-sm">
          {event.venue.neighborhood}
        </span>
        <span
          className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-bold ${isFree ? "bg-emerald-400 text-emerald-950" : "bg-white text-neutral-900"}`}
        >
          {formatPrice(event.priceRange, locale, freeLabel)}
        </span>

        <h3 className="font-display absolute inset-x-0 bottom-0 p-4 text-2xl font-bold leading-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
          {localize(event.title, locale)}
        </h3>
      </div>

      <dl className="grid grid-cols-3 divide-x divide-white/10 border-t border-white/10 text-center text-sm">
        <div className="px-2 py-2.5">
          <dt className="sr-only">Día</dt>
          <dd className="font-medium capitalize">{when.weekday}</dd>
        </div>
        <div className="px-2 py-2.5">
          <dt className="sr-only">Fecha</dt>
          <dd className="font-medium">{when.date}</dd>
        </div>
        <div className="px-2 py-2.5">
          <dt className="sr-only">Hora</dt>
          <dd className="font-medium text-brand-celeste">{when.time} hs</dd>
        </div>
      </dl>

      <p className="flex items-center justify-center gap-2 border-t border-white/10 px-3 py-2.5 text-sm font-medium text-white/85">
        <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-brand-celeste" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z" />
          <circle cx="12" cy="10" r="2.5" />
        </svg>
        <span className="truncate">{event.venue.name}</span>
      </p>
    </Link>
  );
}
