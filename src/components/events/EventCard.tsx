import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { formatEventDate, formatPrice, localize } from "@/lib/format";
import { photoCredits } from "@/lib/photoCredits";
import type { EventWithRelations } from "@/lib/schemas";

type Props = {
  event: EventWithRelations;
  locale: string;
  freeLabel: string;
};

export function EventCard({ event, locale, freeLabel }: Props) {
  const categoryPhoto = photoCredits.category[event.category];
  const [c1, c2, c3] = event.vibe.palette;

  return (
    <Link
      href={`/events/${event.slug}`}
      className="block overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition hover:-translate-y-0.5 hover:border-brand-celeste/40 hover:shadow-[0_0_28px_-10px_rgba(56,189,248,0.45)]"
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
          style={{ background: `linear-gradient(135deg, ${c1}cc, ${c2}99 60%, ${c3}66)` }}
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
    </Link>
  );
}