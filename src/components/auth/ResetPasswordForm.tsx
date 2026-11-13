"use client";

import { useActionState } from "react";
import { updatePassword, type AuthResult } from "@/lib/actions/auth";
import { Button } from "@/components/ui/Button";

const initialState: AuthResult = undefined;

const INPUT_CLASS = "w-full rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-sm text-white outline-none transition focus:border-brand-celeste/60";

/** Formulario para elegir la contraseña nueva, después de abrir el link del mail. */
export function ResetPasswordForm() {
  const [state, action, pending] = useActionState(updatePassword, initialState);

  return (
    <form action={action} className="mx-auto w-full max-w-sm space-y-4">
      <div>
        <label htmlFor="new-password" className="mb-1.5 block text-sm font-medium text-white/80">Contraseña nueva</label>
        <input id="new-password" name="password" type="password" required minLength={6} autoComplete="new-password" className={INPUT_CLASS} />
      </div>

      <div>
        <label htmlFor="confirm-password" className="mb-1.5 block text-sm font-medium text-white/80">Repetí la contraseña</label>
        <input id="confirm-password" name="confirm" type="password" required minLength={6} autoComplete="new-password" className={INPUT_CLASS} />
      </div>

      {state && "error" in state && (
        <p role="alert" className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300">{state.error}</p>
      )}

      <Button type="submit" disabled={pending} className="w-full text-center">
        {pending ? "Guardando…" : "Guardar contraseña"}
      </Button>
    </form>
  );
}
