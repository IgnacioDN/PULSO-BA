import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

/**
 * Cliente de Supabase para Server Components y Server Actions: lee y
 * escribe la sesión a través de las cookies de la petición. Un Server
 * Component no puede escribir cookies (Next.js lo bloquea), así que ahí el
 * "set"/"remove" se ignora en silencio — está bien, el middleware (proxy.ts)
 * ya se encarga de refrescar la sesión en cada request.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Llamado desde un Server Component (no una Server Action ni un
            // Route Handler): no se puede escribir cookies acá, y no pasa
            // nada, el middleware refresca la sesión igual.
          }
        },
      },
    },
  );
}