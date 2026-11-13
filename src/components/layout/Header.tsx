import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Category } from "@/lib/schemas";
import { getCurrentUser } from "@/lib/supabase/user";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { signOut } from "@/lib/actions/auth";
import { UserMenu } from "@/components/layout/UserMenu";

const NAV_CATEGORIES: Category[] = ["music", "theater", "food", "nightlife", "art", "social"];

const NAV_LINK_CLASS = "text-white/70 transition hover:text-white";

export async function Header() {
  const t = await getTranslations("Nav");

  // Si Supabase no está configurado todavía, el header se muestra igual,
  // simplemente sin la parte de login (en vez de romper toda la página).
  const user = await getCurrentUser();
  const userEmail = user?.email ?? null;

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

          {isSupabaseConfigured() && <UserMenu email={userEmail} signOutAction={signOut} />}
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
