import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Category } from "@/lib/schemas";

const NAV_CATEGORIES: Category[] = ["music", "theater", "food", "nightlife", "art", "social"];

export async function Header() {
  const t = await getTranslations("Nav");

  return (
    <header className="sticky top-0 z-40 border-b border-black/10 bg-white/80 backdrop-blur-md dark:border-white/10 dark:bg-black/60">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4">
        <Link href="/" className="font-display font-bold text-lg tracking-tight">
          {t("brand")}
        </Link>

        <nav aria-label={t("brand")} className="hidden gap-6 text-sm font-medium sm:flex">
          {NAV_CATEGORIES.map((category) => (
            <a key={category} href={`#${category}`} className="opacity-70 transition hover:opacity-100">
              {t(category)}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
