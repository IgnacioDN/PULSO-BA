# Pulso BA

Una guía de lo que pasa en Buenos Aires (música, teatro, gastronomía, noche, arte) que se explora por *vibra* y no solo por fecha o categoría.

**Demo en vivo:** https://pulso-ba.vercel.app  ·  [English version](README.md)

> Los eventos y lugares son datos de demostración inventados. Las fotos son de Unsplash (créditos en `src/lib/photoCredits.ts`).

## Por qué lo hice

Soy desarrollador frontend junior y vengo de QA. Quería un proyecto de portfolio que no fuera una lista de tareas: algo que me obligara a tomar decisiones de verdad. ¿Dónde viven los datos? ¿Cómo los valido? ¿Qué pasa si se cae un servicio de terceros? ¿Cómo se maneja la autenticación con server components?

Los eventos de Buenos Aires eran un tema fácil de querer, y la "vibra" (un clima como *jazz de sótano* o *domingo de feria*) resultó una forma divertida de explorarlos.

## Qué se puede hacer

- **Pedir un plan con tus propias palabras**, tipo "algo barato en Palermo con música en vivo". Gemini convierte la frase en filtros (presupuesto, categoría, barrio, palabras clave). Si preferís clickear, un asistente corto te pregunta presupuesto, tipo de plan y barrio.
- **Explorar por vibra.** Ocho vibras, cada una con su paleta de colores. Cada tarjeta lleva al catálogo ya filtrado.
- **Recorrer el catálogo.** Los filtros viven en la URL (`?category=`, `?vibe=`, `?neighborhood=`), así que cualquier vista filtrada se puede compartir.
- **Abrir un evento** y ver el line-up, las etiquetas, el precio y un mapa acercado al lugar.
- **Ver todos los lugares en un mapa** (Google Maps con un estilo oscuro propio). Cada pin lleva a los eventos de ese barrio.
- **Crear una cuenta** (email y contraseña, con recuperación de contraseña) y después guardar favoritos, marcar "Voy" y dejar una reseña por evento. Las reseñas se pueden editar.

## Stack

| | |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack), React 19 |
| Lenguaje | TypeScript (strict) |
| Estilos | Tailwind CSS v4, Framer Motion para las transiciones del asistente |
| Validación | Zod 4 |
| i18n | next-intl 4 (por ahora la interfaz está solo en español, ver "Lo que falta") |
| Auth + base de datos | Supabase (Postgres, Row Level Security, `@supabase/ssr`) |
| Mapas | Google Maps JavaScript API |
| Búsqueda con IA | Google Gemini (`gemini-2.5-flash`) |
| Hosting | Vercel |

## Decisiones que vale la pena explicar

**Los esquemas de Zod son la única fuente de verdad.** Los tipos salen de `z.infer`, así que no hay una interfaz aparte que mantener sincronizada. Los datos se validan al cargarlos, y un registro roto falla rápido con un mensaje claro (por ejemplo, un evento que apunta a un lugar que no existe).

**Una capa de datos que no se filtra.** Los componentes nunca importan los JSON. Llaman a `getEvents()` o `getEventBySlug()`, que ya son `async`, así que pasar los eventos a una base de datos más adelante no toca la interfaz. Para ser honesto con el estado actual: eventos, lugares y vibras siguen siendo JSON local. Solo las funciones de comunidad (favoritos, asistencia, reseñas) usan Supabase. Por eso esas tablas guardan `event_id` como texto simple y no como clave foránea.

**No confío en lo que devuelve la IA.** El prompt de Gemini lista las categorías y barrios exactos que se permiten, y la respuesta pasa por un esquema de Zod antes de tocar cualquier filtro. La ruta `/api/search` también tiene un límite por IP (12 pedidos por minuto). Está en memoria, así que no se sostiene entre instancias serverless: para una demo alcanza, y en producción lo pasaría a algo como Redis. Si la IA se cae, tarda o no está configurada, la búsqueda cae a un buscador local por palabras clave y el usuario nunca ve un error.

**Cualquier servicio externo puede faltar sin romper el sitio.** Sin clave de Maps: el mapa muestra un mensaje. Si Google rechaza la clave (por ejemplo, un dominio no permitido): el mapa muestra un mensaje amable en vez del cartel gris de Google. Sin variables de Supabase: el login y las funciones de comunidad directamente no se dibujan. Sin clave de Gemini: la búsqueda sigue andando con palabras clave.

Esto salió de un bug real. Una variable de entorno mal pegada tiró abajo todo el sitio con un error 500, porque la renovación de sesión de Supabase en `proxy.ts` no tenía manejo de errores. Ahora las fallas de Supabase se atrapan en el proxy, en `getCurrentUser()` y en cada acción de auth, y el resto del sitio sigue funcionando.

**Detalles de autenticación.**
- Las sesiones viven en cookies (`@supabase/ssr`). En Next.js 16 el viejo `middleware.ts` pasó a ser `proxy.ts`, y ahí se renueva la sesión.
- Las Server Actions devuelven `{ error }` o `{ info }` en vez de lanzar excepciones, así los mensajes aparecen en español al lado del formulario.
- `redirect()` funciona lanzando una excepción, por eso está *afuera* de los `try/catch`. Adentro se lo tragarían.
- "Olvidé mi contraseña" responde igual exista o no el email, para que el formulario no sirva para averiguar quién tiene cuenta.
- El callback de auth solo acepta rutas internas en `?next=`, para evitar un redirect abierto.

**Row Level Security hace el trabajo pesado.** Todo es de lectura pública (para mostrar contadores y reseñas), y cada usuario solo puede escribir o borrar sus propias filas. El SQL está en [`supabase/schema.sql`](supabase/schema.sql).

**El plan gratis de Supabase pausa los proyectos inactivos.** Después de más o menos una semana sin pedidos el proyecto se pausa y el login deja de andar. Una tarea programada de Vercel (`vercel.json`) abre `/api/health` una vez por día. Esa ruta hace una consulta mínima, que cuenta como actividad. Además devuelve un 503 si la base no responde, así que abrirla en el navegador sirve de chequeo rápido.

**Detalles que me importaron.** Las animaciones de entrada son CSS puro y su último fotograma es `opacity: 1`, así el contenido nunca queda invisible si algo falla. Los anillos de foco son explícitos y visibles, y el slider de la home se detiene si el usuario tiene activado "reducir movimiento". Las páginas son Server Components por defecto; los componentes de cliente aparecen solo donde hay interacción real (el asistente de la home, el mapa, los formularios y los botones de favorito y "Voy").

## Correrlo en local

Necesitás Node.js 20.9 o superior.

```bash
git clone https://github.com/IgnacioDN/PULSO-BA.git
cd PULSO-BA
npm install
cp .env.example .env.local   # completá lo que tengas, todo es opcional
npm run dev                  # http://localhost:3000
```

Otros scripts: `npm run lint` y `npm run build`.

Sin ninguna clave funcionan el catálogo, los filtros, las páginas de evento y la búsqueda por palabras clave. Cada clave habilita una cosa:

| Variable | Habilita | Dónde conseguirla |
|---|---|---|
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Mapas | Google Cloud → habilitar *Maps JavaScript API* |
| `GEMINI_API_KEY` | Búsqueda en lenguaje natural | Google AI Studio |
| `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Login, favoritos, "Voy", reseñas | Supabase → Project Settings |

**Configurar Supabase**
1. Creá un proyecto y corré [`supabase/schema.sql`](supabase/schema.sql) en el SQL Editor.
2. Copiá la Project URL (sin `/rest/v1/` al final) y la *publishable key*.
3. Para una demo rápida, apagá **Confirm email** en Authentication → Sign In / Providers → Email. El plan gratis manda solo unos pocos mails por hora.
4. Si dejás la confirmación activa, poné la **Site URL** en Authentication → URL Configuration con la dirección de tu deploy y agregá `https://tu-dominio/**` en **Redirect URLs**. Los links de confirmación y de recuperación de contraseña dependen de eso.

**Clave de Google Maps.** Restringila por referrer HTTP. En desarrollo local usá `http://localhost:3000/*`, y para Vercel tu dominio (más `https://*.vercel.app/*` si querés que los deploys de preview muestren el mapa).

## Estructura del proyecto

```
src/
  app/
    [locale]/        páginas: home, events, events/[slug], map, auth, auth/reset
    api/             search (Gemini), health (latido de Supabase), auth/callback
  components/        auth, events, home, layout, map, ui
  lib/
    schemas.ts       esquemas de Zod y los tipos derivados
    data.ts          capa de datos (hoy JSON, mañana una base)
    filterEvents.ts  filtros y búsqueda por palabras clave, funciones puras
    actions/         Server Actions: auth y comunidad
    supabase/        cliente de navegador, cliente de servidor, helpers de config
  data/              events.json, venues.json, vibes.json
  proxy.ts           idioma + renovación de sesión de Supabase
messages/            es.json
supabase/            schema.sql
```

## Lo que falta

- **No hay tests automáticos.** Es la mayor deuda. Lo próximo: tests unitarios de los filtros y esquemas, y un test end-to-end con Playwright del flujo principal (buscar → evento → login).
- **Interfaz en inglés.** El contenido de los eventos ya es bilingüe en el esquema (`{ es, en }`) y next-intl está configurado, pero solo existe `messages/es.json`.
- **Eventos reales.** Todo es de demostración. La capa de datos está lista para leer de una base.
- **Las reseñas guardan el email del autor.** La interfaz muestra solo las primeras letras, pero la columna es legible públicamente por la API. La solución es guardar un nombre para mostrar.

## Sobre mí

Desarrollador frontend con React y TypeScript, con más de 3 años en ecommerce sobre Adobe Commerce (Magento). Mi pasado en QA se nota en cómo construyo: me importan los casos borde, la accesibilidad y los estados de error. Convierto diseños en interfaces responsive y reutilizables, y trabajo bien con equipos de diseño y negocio. Pulso BA es mi proyecto más reciente: una app full-stack en Next.js con login, búsqueda con IA y base de datos.

## Licencia

Todavía no tiene licencia, así que por ahora todos los derechos reservados.
