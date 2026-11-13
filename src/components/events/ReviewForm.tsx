"use client";

import { useActionState, useState } from "react";
import { Link } from "@/i18n/navigation";

export type ReviewFormResult = { error: string } | { ok: true };

export type ReviewAction = (prevState: ReviewFormResult | undefined, formData: FormData) => Promise<ReviewFormResult>;

type Props = {
  /** Server Action ya atada al evento (bind del lado del servidor). */
  action: ReviewAction;
  loggedIn: boolean;
  initialRating?: number;
  initialBody?: string;
};

const MAX_BODY = 1000;
const RATING_LABELS = ["Elegí un puntaje", "Malo", "Regular", "Bien", "Muy bueno", "Excelente"];

const CARD_CLASS = "rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6";
const TEXTAREA_CLASS = "w-full resize-none rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-brand-celeste/60";
const SUBMIT_CLASS = "rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-neutral-950 transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-40";
const LOGIN_LINK_CLASS = "inline-flex shrink-0 rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-neutral-950 transition hover:bg-white/90";

export function ReviewForm({ action, loggedIn, initialRating = 0, initialBody = "" }: Props) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const [rating, setRating] = useState(initialRating);
  const [hovered, setHovered] = useState(0);
  const [body, setBody] = useState(initialBody);

  if (!loggedIn) {
    return (
      <div className={`${CARD_CLASS} sm:flex sm:items-center sm:justify-between sm:gap-6`}>
        <div>
          <p className="font-medium text-white/90">¿Fuiste a este evento?</p>
          <p className="mt-1 text-sm text-white/55">Iniciá sesión para dejar tu reseña.</p>
        </div>
        <Link href="/auth" className={`${LOGIN_LINK_CLASS} mt-4 sm:mt-0`}>Iniciar sesión</Link>
      </div>
    );
  }

  const isEditing = initialRating > 0;
  const shown = hovered || rating;

  return (
    <form action={formAction} className={CARD_CLASS}>
      <p className="mb-4 text-sm font-semibold text-white/80">{isEditing ? "Editá tu reseña" : "Dejá tu reseña"}</p>

      <input type="hidden" name="rating" value={rating} />
      <div className="flex items-center gap-1" role="radiogroup" aria-label="Puntaje" onMouseLeave={() => setHovered(0)}>
        {[1, 2, 3, 4, 5].map((value) => (
          <button key={value} type="button" role="radio" aria-checked={rating === value} aria-label={`${value} de 5`} onClick={() => setRating(value)} onMouseEnter={() => setHovered(value)} className="p-0.5 text-3xl leading-none transition hover:scale-110">
            <span className={value <= shown ? "text-brand-celeste" : "text-white/20"}>★</span>
          </button>
        ))}
        <span className="ml-3 text-sm text-white/55">{RATING_LABELS[shown]}</span>
      </div>

      <div className="mt-4">
        <textarea name="body" required maxLength={MAX_BODY} rows={4} value={body} onChange={(event) => setBody(event.target.value)} placeholder="¿Qué tal estuvo? Contale al resto cómo fue." aria-label="Tu reseña" className={TEXTAREA_CLASS} />
        <p className="mt-1 text-right text-xs text-white/35">{body.length}/{MAX_BODY}</p>
      </div>

      {state && "error" in state && (
        <p role="alert" className="mt-2 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300">{state.error}</p>
      )}
      {state && "ok" in state && (
        <p role="status" className="mt-2 rounded-lg bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">¡Gracias! Tu reseña quedó publicada.</p>
      )}

      <div className="mt-4 flex justify-end">
        <button type="submit" disabled={pending || rating === 0 || body.trim().length === 0} className={SUBMIT_CLASS}>
          {pending ? "Publicando…" : isEditing ? "Actualizar reseña" : "Publicar reseña"}
        </button>
      </div>
    </form>
  );
}
