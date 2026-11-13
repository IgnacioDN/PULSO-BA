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
  const seen = new Set<string>();
  const vibes: Vibe[] = [];
  for (const event of events) {
    if (!seen.has(event.vibe.id)) {
      seen.add(event.vibe.id);
      vibes.push(event.vibe);
    }
  }

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
            {vibes.map((vibe) => {
              const [c1, c2, c3] = vibe.palette;
              return (
                <li key={vibe.id} className="shrink-0 snap-start">
                  <Link href={`/events?vibe=${vibe.id}`} className="pulso-vibe flex h-32 w-48 flex-col justify-end rounded-2xl p-4 text-white shadow-lg shadow-black/30 transition duration-300 hover:-translate-y-1 hover:scale-[1.03]" style={{ background: `linear-gradient(135deg, ${c1}, ${c2} 55%, ${c3})` }}>
                    <span className="text-base font-bold leading-snug drop-shadow">
                      {localize(vibe.label, locale)}
                    </span>
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