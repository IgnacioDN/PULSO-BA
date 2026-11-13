"use client";

import { useEffect, useRef, useState } from "react";
import { Link } from "@/i18n/navigation";

type Props = {
  /** Email del usuario con sesión, o null si nadie inició sesión. */
  email: string | null;
  /** Server Action que cierra la sesión (se pasa desde el Header, que corre en el servidor). */
  signOutAction: () => Promise<void>;
};

const LOGIN_CLASS = "flex h-10 items-center gap-2 rounded-full border border-white/20 px-3 text-sm font-medium text-white/80 transition hover:border-white/40 hover:text-white sm:px-4";
const AVATAR_CLASS = "flex h-10 w-10 items-center justify-center rounded-full border border-brand-celeste/50 bg-brand-celeste/15 text-sm font-semibold text-brand-celeste transition hover:bg-brand-celeste/25";
const PANEL_CLASS = "absolute right-0 top-full z-50 mt-2 w-64 rounded-2xl border border-white/15 bg-[#1c1612] p-2 shadow-xl";
const MENU_ITEM_CLASS = "flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-white/80 transition hover:bg-white/10 hover:text-white";

/**
 * Botón de cuenta del header.
 * - Sin sesión: un botón con ícono de usuario que lleva a /auth.
 * - Con sesión: un avatar con la inicial del email; al tocarlo se abre un
 *   panel con el email completo y la opción de salir. Se cierra con Escape
 *   o al hacer clic afuera.
 */
export function UserMenu({ email, signOutAction }: Props) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: PointerEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  if (!email) {
    return (
      <Link href="/auth" aria-label="Iniciar sesión" className={LOGIN_CLASS}>
        <UserIcon />
        <span className="hidden sm:inline">Ingresar</span>
      </Link>
    );
  }

  const initial = email.charAt(0).toUpperCase();

  return (
    <div ref={containerRef} className="relative">
      <button type="button" onClick={() => setOpen((current) => !current)} aria-haspopup="menu" aria-expanded={open} aria-label="Menú de usuario" className={AVATAR_CLASS}>
        {initial}
      </button>

      {open && (
        <div role="menu" className={PANEL_CLASS}>
          <div className="px-3 py-2">
            <p className="text-xs text-white/50">Sesión iniciada como</p>
            <p className="truncate text-sm font-medium text-white" title={email}>{email}</p>
          </div>
          <form action={signOutAction} className="border-t border-white/10 pt-1">
            <button type="submit" role="menuitem" className={MENU_ITEM_CLASS}>
              <LogoutIcon />
              Salir
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-3.3 3.6-6 8-6s8 2.7 8 6" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h3" />
      <path d="M16 8l4 4-4 4" />
      <path d="M20 12H9" />
    </svg>
  );
}
