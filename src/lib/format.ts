/** Utilidades de formato. Todas reciben el locale para no depender de valores fijos. */

const TIME_ZONE = "America/Argentina/Buenos_Aires";

type Localized = { es: string; en: string };

/** Elige el texto según el idioma; si no existe, cae en español. */
export function localize(field: Localized, locale: string): string {
  return locale === "en" ? field.en : field.es;
}

export function formatEventDate(iso: string, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: TIME_ZONE,
  }).format(new Date(iso));
}

export function formatPrice(
  range: { min: number; max: number },
  locale: string,
  freeLabel: string,
): string {
  if (range.max === 0) return freeLabel;
  const fmt = new Intl.NumberFormat(locale === "en" ? "en-US" : "es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  });
  return range.min === range.max
    ? fmt.format(range.min)
    : `${fmt.format(range.min)} – ${fmt.format(range.max)}`;
}
