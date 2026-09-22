import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // Fase 1: solo español. En la fase 6 agregás "en" acá y creás messages/en.json
  locales: ["es"],
  defaultLocale: "es",
  // El idioma por defecto no lleva prefijo: /events (es) y /en/events (en)
  localePrefix: "as-needed",
});
