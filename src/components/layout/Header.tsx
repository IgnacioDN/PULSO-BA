import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Category } from "@/lib/schemas";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { signOut } from "@/lib/actions/auth";

const NAV_CATEGORIES: Category[] = ["music", "theater", "food", "nightlife", "art", "social"];

const AUTH_BUTTON_CLASS = "rounded-full border border-white/20 px-4 py-1.5 text-sm font-medium text-white/80 transition hover:border-white/40 hover:text-white";
const NAV_LINK_CLASS = "text-white/70 transition hover:text-white";

export async function Header() {
  const t = await getTranslations("Nav");

  // Si Supabase no está configurado todavía, el header se muestra igual,
  // simplemente sin la parte de login (en vez de romper toda la página).
  let userEmail: string | null = null;
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    userEmail = user?.email ?? null;
  }

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#1c1612]/85 backdrop-blur-md">
      <div className="mx-auto flex h-20 w-full max-w-6xl items-center justify-between gap-6 px-4">
        {/* Cartel de neón: el mismo lenguaje visual para el ícono y la letra
            (trazo fino + resplandor que respira), en vez de mezclar una
            ilustración pintada con tipografía plana. */}
        <Link href="/" className="pulso-neon flex shrink-0 items-center gap-2">
          <NeonObelisk className="h-8 w-5" />
          <span className="font-display font-bold text-xl tracking-tight">{t("brand")}</span>
        </Link>

        <div className="flex items-center gap-6">
          <nav aria-label={t("brand")} className="hidden gap-6 text-sm font-medium sm:flex">
            <Link href="/events" className={NAV_LINK_CLASS}>{t("catalog")}</Link>
            <Link href="/map" className={NAV_LINK_CLASS}>{t("map")}</Link>
            {NAV_CATEGORIES.map((category) => (
              <a key={category} href={`/#${category}`} className={NAV_LINK_CLASS}>{t(category)}</a>
            ))}
          </nav>

          {isSupabaseConfigured() &&
            (userEmail ? (
              <form action={signOut} className="flex items-center gap-3">
                <span className="hidden max-w-[12ch] truncate text-sm text-white/60 sm:inline" title={userEmail}>{userEmail}</span>
                <button type="submit" className={AUTH_BUTTON_CLASS}>Salir</button>
              </form>
            ) : (
              <Link href="/auth" className={AUTH_BUTTON_CLASS}>Iniciar sesión</Link>
            ))}
        </div>
      </div>
    </header>
  );
}

function NeonObelisk({ className = "h-8 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 40" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">
      <path d="M9 39 L9 13 L12 2 L15 13 L15 39" />
      <line x1="6" y1="39" x2="18" y2="39" />
    </svg>
  );
}