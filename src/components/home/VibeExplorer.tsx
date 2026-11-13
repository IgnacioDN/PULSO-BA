import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { localize } from "@/lib/format";
import type { EventWithRelations, Vibe } from "@/lib/schemas";

type Props = {
  events: EventWithRelations[];
  locale: string;
};

/**
 * "Explorá por vibra": scroll horizontal en vez de otra grilla vertical.
 * Es el patrón de interacción que le da más uso al sistema de colores por
 * vibra, que hasta ahora solo se veía como un detalle en cada tarjeta.
 * Cada card linkea al catálogo ya filtrado por esa vibra (?vibe=id).
 */
export async function VibeExplorer({ events, locale }: Props) {
  const t = await getTranslations("VibeExplorer");

  // Solo vibras que tienen al menos un evento real: ninguna tarjeta lleva
  // a un catálogo vacío.
  // De paso guardamos la foto del primer evento de cada vibra y cuántos hay.
  const seen = new Map<string, { vibe: Vibe; photoUrl: string | null; count: number }>();
  for (const event of events) {
    const entry = seen.get(event.vibe.id);
    if (entry) {
      entry.count += 1;
      entry.photoUrl ??= event.photo?.url ?? null;
    } else {
      seen.set(event.vibe.id, { vibe: event.vibe, photoUrl: event.photo?.url ?? null, count: 1 });
    }
  }
  const vibes = Array.from(seen.values());

  if (vibes.length === 0) return null;

  return (
    <section className="border-b border-white/10">
      <div className="mx-auto w-full max-w-6xl px-4 py-14">
        <Reveal>
          <SectionHeading as="h2" className="pulso-heading text-2xl sm:text-3xl">
            {t("title")}
          </SectionHeading>
          <p className="mt-2 text-white/60">{t("subtitle")}</p>
        </Reveal>

        <Reveal delay={100}>
          <ul className="mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [scrollbar-width:none]">
            {vibes.map(({ vibe, photoUrl, count }) => {
              const [c1, c2, c3] = vibe.palette;
              return (
                <li key={vibe.id} className="shrink-0 snap-start">
                  <Link href={`/events?vibe=${vibe.id}`} className="pulso-vibe group relative flex h-44 w-56 flex-col justify-end overflow-hidden rounded-2xl p-4 text-white shadow-lg shadow-black/30 transition duration-300 hover:-translate-y-1 hover:scale-[1.03]" style={{ background: `linear-gradient(135deg, ${c1}, ${c2} 55%, ${c3})` }}>
                    {photoUrl && (
                      <>
                        <Image src={`${photoUrl}?auto=format&fit=crop&w=500&q=70`} alt="" fill sizes="224px" className="object-cover transition duration-700 group-hover:scale-110" />
                        <div aria-hidden="true" className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${c1}8c, ${c2}59 55%, ${c3}33)` }} />
                      </>
                    )}
                    <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
                    <span className="relative text-lg font-bold leading-snug drop-shadow">{localize(vibe.label, locale)}</span>
                    <span className="relative text-xs font-medium text-white/80">{count} {count === 1 ? "evento" : "eventos"}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}