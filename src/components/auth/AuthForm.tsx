"use client";

import { useActionState, useState } from "react";
import { signIn, signUp, type AuthResult } from "@/lib/actions/auth";
import { Button } from "@/components/ui/Button";

type Mode = "login" | "signup";

const initialState: AuthResult = undefined;

const INPUT_CLASS = "w-full rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-sm text-white outline-none transition focus:border-brand-celeste/60";
const TAB_ACTIVE = "flex-1 rounded-full px-4 py-2 text-sm font-medium transition bg-white text-neutral-950";
const TAB_INACTIVE = "flex-1 rounded-full px-4 py-2 text-sm font-medium transition text-white/70 hover:text-white";

/**
 * Un solo formulario que alterna entre "Iniciar sesión" y "Crear cuenta".
 * Las dos Server Actions (signIn/signUp) devuelven {error} en vez de tirar
 * una excepción, así que el mensaje de error queda prolijo y en español.
 */
export function AuthForm({ notice }: { notice?: string }) {
  const [mode, setMode] = useState<Mode>("login");
  const [loginState, loginAction, loginPending] = useActionState(signIn, initialState);
  const [signupState, signupAction, signupPending] = useActionState(signUp, initialState);

  const state = mode === "login" ? loginState : signupState;
  const action = mode === "login" ? loginAction : signupAction;
  const pending = mode === "login" ? loginPending : signupPending;

  return (
    <div className="mx-auto w-full max-w-sm">
      <div className="mb-6 flex gap-1 rounded-full border border-white/15 bg-white/5 p-1">
        <button type="button" onClick={() => setMode("login")} className={mode === "login" ? TAB_ACTIVE : TAB_INACTIVE}>Iniciar sesión</button>
        <button type="button" onClick={() => setMode("signup")} className={mode === "signup" ? TAB_ACTIVE : TAB_INACTIVE}>Crear cuenta</button>
      </div>

      {notice && (
        <p role="status" className="mb-4 rounded-lg bg-amber-500/10 px-3 py-2 text-sm text-amber-200">{notice}</p>
      )}

      <form action={action} className="space-y-4">
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-white/80">Email</label>
          <input id="email" name="email" type="email" required autoComplete="email" className={INPUT_CLASS} />
        </div>

        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-white/80">Contraseña</label>
          <input id="password" name="password" type="password" required minLength={6} autoComplete={mode === "login" ? "current-password" : "new-password"} className={INPUT_CLASS} />
        </div>

        {state && "error" in state && (
          <p role="alert" className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300">{state.error}</p>
        )}

        {state && "info" in state && (
          <p role="status" className="rounded-lg bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">{state.info}</p>
        )}

        <Button type="submit" disabled={pending} className="w-full text-center">
          {pending ? "Un momento…" : mode === "login" ? "Entrar" : "Crear cuenta"}
        </Button>

        {mode === "signup" && (
          <p className="text-center text-xs text-white/50">Si te pedimos confirmar el email, revisá tu casilla antes de entrar.</p>
        )}
      </form>
    </div>
  );
}