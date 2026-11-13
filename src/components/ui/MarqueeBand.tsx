import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

/**
 * Cintillo que recorre la home: queda pegado debajo del header mientras se
 * baja por la página (sticky) y lleva a la búsqueda del catálogo. Es solo
 * CSS: el texto se repite dos veces y se desplaza media pista en loop.
 */
export async function MarqueeBand() {
  const t = await getTranslations("Marquee");
  const words = t.raw("words") as string[];

  const track = (
    <span className="flex shrink-0 items-center gap-6 pr-6">
      {words.map((word) => (
        <span key={word} className="flex items-center gap-6">
          <span className="font-bold uppercase tracking-wider">{t("cta")}</span>
          <span aria-hidden="true">✦</span>
          <span className="uppercase tracking-wider">{word}</span>
          <span aria-hidden="true">✦</span>
        </span>
      ))}
    </span>
  );

  return (
    <Link
      href="/events"
      aria-label={t("cta")}
      className="pulso-marquee sticky top-20 z-30 block overflow-hidden bg-brand-celeste py-2 text-sm text-[#0b1a24] shadow-[0_6px_24px_-12px_rgba(56,189,248,0.8)]"
    >
      <span className="pulso-marquee-track flex w-max" aria-hidden="true">
        {track}
        {track}
      </span>
    </Link>
  );
}
