"use client";

import { useState, useTransition } from "react";

type Result = { error: string } | { ok: true };

type Props = {
  /** Server Action ya atada al evento (bind del lado del servidor). */
  action: () => Promise<Result>;
  initialActive: boolean;
  activeLabel: string;
  inactiveLabel: string;
  icon: "heart" | "check";
  loggedIn: boolean;
};

const BASE_CLASS = "flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition disabled:opacity-60";
const ACTIVE_CLASS = "border-brand-celeste/50 bg-brand-celeste/15 text-brand-celeste";
const INACTIVE_CLASS = "border-white/20 bg-white/5 text-white/80 hover:border-white/40";
const HEART_PATH = "M12 20.5s-7.5-4.6-10-9.3C.5 7.8 2.3 4.5 5.7 4c2-.3 3.9.6 5 2.2.2.3.6.3.8 0 1.1-1.6 3-2.5 5-2.2 3.4.5 5.2 3.8 3.7 7.2-2.5 4.7-10 9.3-10 9.3Z";

/**
 * Botón de "favorito" o "voy": actualiza de una (optimista) y si el
 * servidor responde con error (típicamente, no hay sesión) revierte el
 * cambio y muestra el motivo. El mismo componente sirve para los dos casos,
 * solo cambia el ícono y las etiquetas.
 */
export function ToggleButton({ action, initialActive, activeLabel, inactiveLabel, icon, loggedIn }: Props) {
  const [active, setActive] = useState(initialActive);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleClick() {
    if (!loggedIn) {
      setError(icon === "heart" ? "Iniciá sesión para guardar favoritos." : "Iniciá sesión para marcar que vas.");
      return;
    }
    setError(null);
    setActive((current) => !current);
    startTransition(async () => {
      const result = await action();
      if ("error" in result) {
        setActive((current) => !current);
        setError(result.error);
      }
    });
  }

  return (
    <div>
      <button type="button" onClick={handleClick} disabled={pending} aria-pressed={active} className={`${BASE_CLASS} ${active ? ACTIVE_CLASS : INACTIVE_CLASS}`}>
        {icon === "heart" ? <HeartIcon filled={active} /> : <CheckIcon filled={active} />}
        {active ? activeLabel : inactiveLabel}
      </button>
      {error && <p className="mt-1.5 text-xs text-white/50">{error}</p>}
    </div>
  );
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d={HEART_PATH} />
    </svg>
  );
}

function CheckIcon({ filled }: { filled: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {filled ? <path d="M4 12.5 9.5 18 20 6" /> : <path d="M5 12h14M12 5v14" />}
    </svg>
  );
}