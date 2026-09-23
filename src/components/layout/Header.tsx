import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Isotype } from "@/components/ui/Isotype";
import type { Category } from "@/lib/schemas";

const NAV_CATEGORIES: Category[] = ["music", "theater", "food", "nightlife", "art", "social"];

export async function Header() {
  const t = await getTranslations("Nav");

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#14100d]/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-display font-bold text-lg tracking-tight text-white">
          <Isotype className="h-7 w-7" />
          {t("brand")}
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