import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Destino del link del mail de confirmación. Supabase redirige acá con un
 * `?code=...`; lo canjeamos por una sesión (cookies) y mandamos al usuario a
 * la home, ya con la sesión iniciada. Si algo falla, lo llevamos al login con
 * un aviso en vez de dejarlo en una pantalla en blanco.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  // A dónde ir después (por ejemplo, la pantalla de contraseña nueva). Solo
  // se aceptan rutas internas: "//otro-sitio.com" sería un redirect abierto.
  const nextParam = searchParams.get("next");
  const next = nextParam && nextParam.startsWith("/") && !nextParam.startsWith("//") ? nextParam : "/";

  // Detrás del proxy de Vercel, la dirección pública viene en este header.
  const forwardedHost = request.headers.get("x-forwarded-host");
  const base = forwardedHost ? `https://${forwardedHost}` : origin;

  if (code) {
    try {
      const supabase = await createClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) return NextResponse.redirect(`${base}${next}`);
      console.error("[auth] exchangeCodeForSession falló:", error.message);
    } catch (err) {
      console.error("[auth] callback falló:", err);
    }
  }

  return NextResponse.redirect(`${base}/auth?error=${next === "/auth/reset" ? "recuperacion" : "confirmacion"}`);
}
