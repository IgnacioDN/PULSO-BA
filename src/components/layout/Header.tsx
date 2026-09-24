import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Category } from "@/lib/schemas";

const NAV_CATEGORIES: Category[] = ["music", "theater", "food", "nightlife", "art", "social"];

export async function Header() {
  const t = await getTranslations("Nav");

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#1c1612]/85 backdrop-blur-md">
      <div className="mx-auto flex h-20 w-full max-w-6xl items-center justify-between px-4">
        <Link href="/" className="pulso-neon flex items-center gap-2">
          <NeonObelisk className="h-8 w-5" />
          <span className="font-display font-bold text-xl tracking-tight">{t("brand")}</span>
        </Link>

        <nav aria-label={t("brand")} className="hidden gap-6 text-sm font-medium sm:flex">
          <Link href="/events" className="text-white/70 transition hover:text-white">
            {t("catalog")}
          </Link>
          {NAV_CATEGORIES.map((category) => (
            <a key={category} href={`/#${category}`} className="text-white/70 transition hover:text-white">
              {t(category)}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}

function NeonObelisk({ className = "h-8 w-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 40"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M9 39 L9 13 L12 2 L15 13 L15 39" />
      <line x1="6" y1="39" x2="18" y2="39" />
    </svg>
  );
}