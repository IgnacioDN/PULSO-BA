import { type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// En Next.js 16 el antiguo "middleware.ts" pasó a llamarse "proxy.ts"
const intlMiddleware = createMiddleware(routing);

export default async function proxy(request: NextRequest) {
  // Primero resuelve el idioma (igual que antes), después usa esa misma
  // respuesta para refrescar la sesión de Supabase: si el token venció,
  // acá se renueva y la cookie nueva viaja en la respuesta.
  const response = intlMiddleware(request);

  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    // Si Supabase falla (variable mal pegada, problema de red, proyecto
    // pausado), el sitio NO puede caerse: se ignora el error y la página
    // sigue cargando, solo que sin refrescar la sesión.
    try {
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
          cookies: {
            getAll() {
              return request.cookies.getAll();
            },
            setAll(cookiesToSet) {
              cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
              cookiesToSet.forEach(({ name, value, options }) =>
                response.cookies.set(name, value, options),
              );
            },
          },
        },
      );

      // No usamos el resultado acá, el solo hecho de llamarlo renueva el token.
      await supabase.auth.getUser();
    } catch {
      // Silencioso a propósito.
    }
  }

  return response;
}

export const config = {
  // Ignora /api, /_next, /_vercel y cualquier archivo con extensión (imágenes, etc.)
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};