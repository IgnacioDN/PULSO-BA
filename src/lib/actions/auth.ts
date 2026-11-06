"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type AuthResult = { error: string } | void;

/**
 * Registra un usuario nuevo con email + contraseña. Supabase, por defecto,
 * exige confirmar el email antes de poder iniciar sesión (manda un mail con
 * un link) — si en Authentication > Settings desactivaste esa opción para
 * probar más rápido, el login funciona al toque.
 */
export async function signUp(_prevState: AuthResult, formData: FormData): Promise<AuthResult> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Completá el email y la contraseña." };
  }
  if (password.length < 6) {
    return { error: "La contraseña tiene que tener al menos 6 caracteres." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({ email, password });

  if (error) {
    return { error: translateAuthError(error.message) };
  }

  redirect("/");
}

export async function signIn(_prevState: AuthResult, formData: FormData): Promise<AuthResult> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Completá el email y la contraseña." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: translateAuthError(error.message) };
  }

  redirect("/");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

// Supabase devuelve los mensajes de error en inglés; traducimos los más
// comunes para que la experiencia quede en español de punta a punta.
function translateAuthError(message: string): string {
  const known: Record<string, string> = {
    "Invalid login credentials": "Email o contraseña incorrectos.",
    "User already registered": "Ya existe una cuenta con ese email.",
    "Email not confirmed": "Todavía no confirmaste tu email: revisá tu bandeja de entrada.",
  };
  return known[message] ?? "Algo salió mal. Probá de nuevo en un momento.";
}