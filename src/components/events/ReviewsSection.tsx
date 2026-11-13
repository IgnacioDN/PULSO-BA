import { SectionHeading } from "@/components/ui/SectionHeading";
import { ReviewForm, type ReviewAction } from "@/components/events/ReviewForm";
import { StarRating } from "@/components/events/StarRating";
import type { EventCommunityStats } from "@/lib/community";

type Props = {
  stats: EventCommunityStats;
  /** Server Action ya atada al evento (bind del lado del servidor). */
  action: ReviewAction;
  loggedIn: boolean;
  locale: string;
};

const CARD_CLASS = "rounded-2xl border border-white/10 bg-white/[0.03]";

/**
 * Las reseñas son públicas, así que no mostramos el email completo: solo
 * las primeras letras. (El email sigue guardado, pero no se exhibe.)
 */
function maskedName(email: string): string {
  const local = email.split("@")[0] ?? "";
  const visible = local.slice(0, Math.min(3, Math.max(1, local.length - 1)));
  return `${visible}•••`;
}

function formatReviewDate(iso: string, locale: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat(locale === "es" ? "es-AR" : locale, { day: "numeric", month: "short", year: "numeric" }).format(date);
}

export function ReviewsSection({ stats, action, loggedIn, locale }: Props) {
  const { reviews, averageRating } = stats;
  const total = reviews.length;
  const counts = [5, 4, 3, 2, 1].map((stars) => ({ stars, count: reviews.filter((r) => r.rating === stars).length }));

  return (
    <section className="mt-12 border-t border-white/10 pt-10">
      <SectionHeading as="h2" className="text-2xl">Reseñas</SectionHeading>

      {averageRating !== null ? (
        <div className={`mt-6 grid gap-6 p-5 sm:grid-cols-[auto_1fr] sm:items-center sm:gap-10 sm:p-6 ${CARD_CLASS}`}>
          <div className="text-center sm:text-left">
            <p className="font-display text-5xl font-bold leading-none">{averageRating.toFixed(1)}</p>
            <StarRating rating={averageRating} className="mt-2 text-lg" />
            <p className="mt-1.5 text-sm text-white/55">{total} {total === 1 ? "reseña" : "reseñas"}</p>
          </div>

          <ul className="space-y-1.5">
            {counts.map(({ stars, count }) => (
              <li key={stars} className="flex items-center gap-3 text-xs text-white/60">
                <span className="w-6 shrink-0">{stars} ★</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-brand-celeste" style={{ width: `${(count / total) * 100}%` }} />
                </div>
                <span className="w-5 text-right tabular-nums">{count}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className={`mt-6 p-5 text-sm text-white/55 ${CARD_CLASS}`}>Todavía no hay reseñas. ¡Sé el primero en opinar!</p>
      )}

      <div className="mt-6">
        <ReviewForm action={action} loggedIn={loggedIn} initialRating={stats.myReview?.rating ?? 0} initialBody={stats.myReview?.body ?? ""} />
      </div>

      {total > 0 && (
        <ul className="mt-6 space-y-3">
          {reviews.map((review) => {
            const isMine = stats.myReview?.id === review.id;
            return (
              <li key={review.id} className={`p-5 ${CARD_CLASS}`}>
                <div className="flex items-start gap-3">
                  <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/10 text-sm font-semibold uppercase text-white/80">
                    {review.authorEmail.charAt(0)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span className="text-sm font-medium text-white/90">{maskedName(review.authorEmail)}</span>
                      {isMine && <span className="rounded-full bg-brand-celeste/15 px-2 py-0.5 text-[11px] font-medium text-brand-celeste">Tu reseña</span>}
                    </div>
                    <div className="mt-0.5 flex items-center gap-2 text-xs text-white/45">
                      <StarRating rating={review.rating} className="text-sm" />
                      <span>{formatReviewDate(review.createdAt, locale)}</span>
                    </div>
                  </div>
                </div>
                <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-white/75">{review.body}</p>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
