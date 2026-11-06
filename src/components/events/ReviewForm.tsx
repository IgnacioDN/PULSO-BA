"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/Button";

type Result = { error: string } | { ok: true };

type Props = {
  /** Server Action ya atada al evento (bind del lado del servidor). */
  action: (prevState: Result | undefined, formData: FormData) => Promise<Result>;
  loggedIn: boolean;
  initialRating?: number;
  initialBody?: string;
};

const TEXTAREA_CLASS = "w-full resize-none rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-sm text-white outline-none transition focus:border-brand-celeste/60";

export function ReviewForm({ action, loggedIn, initialRating = 0, initialBody = "" }: Props) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const [rating, setRating] = useState(initialRating);

  if (!loggedIn) {
    return <p className="text-sm text-white/50">Iniciá sesión para dejar tu reseña.</p>;
  }

  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="rating" value={rating} />
      <div className="flex items-center gap-1" role="radiogroup" aria-label="Puntaje">
        {[1, 2, 3, 4, 5].map((value) => (
          <button key={value} type="button" role="radio" aria-checked={rating === value} aria-label={`${value} de 5`} onClick={() => setRating(value)} className="p-0.5 text-2xl leading-none transition">
            <span className={value <= rating ? "text-brand-celeste" : "text-white/20"}>★</span>
          </button>
        ))}
      </div>

      <textarea name="body" required maxLength={1000} rows={3} defaultValue={initialBody} placeholder="¿Qué tal estuvo? Contale al resto cómo fue." className={TEXTAREA_CLASS} />

      {state && "error" in state && (
        <p role="alert" className="text-sm text-red-300">{state.error}</p>
      )}

      <Button type="submit" disabled={pending || rating === 0} variant="ghost" className="!px-0 hover:underline">
        {pending ? "Publicando…" : "Publicar reseña"}
      </Button>
    </form>
  );
}