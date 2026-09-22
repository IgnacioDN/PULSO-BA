# Pulso BA

La agenda viva de Buenos Aires: música, teatro, gastronomía y planes sociales, con la vibra de cada evento.

> Proyecto en construcción. Todos los eventos y lugares son **datos de demostración**.

## Stack

- Next.js (App Router) + TypeScript (strict)
- Tailwind CSS
- next-intl (español por ahora; inglés en la fase 6)
- Zod (validación de datos)

## Cómo correrlo

Requiere Node.js 20.9 o superior.

```bash
npm install
npm run dev      # http://localhost:3000
npm run lint
npm run build
```

## Estructura

```
src/
  app/[locale]/    páginas (layout raíz con <html lang>)
  i18n/            configuración de next-intl (routing, request, navigation)
  lib/
    schemas.ts     esquemas Zod + tipos derivados
    data.ts        capa de datos (hoy JSON, mañana Supabase)
    format.ts      fechas, precios y textos por idioma
  data/            events.json, venues.json, vibes.json
  proxy.ts         detección de idioma (antes "middleware")
messages/          es.json (y en.json más adelante)
```

## Decisiones de diseño

- **Datos separados de la interfaz:** los componentes consumen `lib/data.ts`. Cambiar el origen de los datos no toca la UI.
- **Tipos derivados de esquemas:** con Zod hay una sola fuente de verdad y los datos se validan al entrar.
- **Datos propios:** no depende de APIs externas de eventos.
- **i18n desde el inicio:** la estructura `[locale]` está lista; solo se traduce al final.
