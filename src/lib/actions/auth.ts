"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type AuthResult = { error: string } | { info: string } | undefined;

/**
 * Registra un usuario nuevo con email + contraseña.
 *
 * Ojo con `redirect()`: funciona lanzando una excepción especial, así que
 * NUNCA va dentro de un try/catch (se la tragaría). Por eso las llamadas a
 * Supabase se atrapan aparte y el redirect queda afuera, al final.
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

  let hasSession = false;
  try {
    // El link del mail de confirmación tiene que volver a ESTE sitio (no a
    // localhost): lo armamos con la dirección desde la que se envió el form.
    const requestHeaders = await headers();
    const origin = requestHeaders.get("origin");

    const supabase = await createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: origin ? { emailRedirectTo: `${origin}/api/auth/callback` } : undefined,
    });
    if (error) {
      return { error: translateAuthError(error.message) };
    }
    hasSession = Boolean(data.session);
  } catch (err) {
    console.error("[auth] signUp falló:", err);
    return { error: unexpectedError(err) };
  }

  // Si Supabase pide confirmar el email, todavía no hay sesión: avisamos en
  // vez de mandar al usuario a la home como si ya estuviera adentro.
  if (!hasSession) {
    return { info: "Cuenta creada. Te mandamos un mail para confirmarla: revisá tu bandeja y después iniciá sesión." };
  }

  redirect("/");
}

export async function signIn(_prevState: AuthResult, formData: FormData): Promise<AuthResult> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Completá el email y la contraseña." };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      return { error: translateAuthError(error.message) };
    }
  } catch (err) {
    console.error("[auth] signIn falló:", err);
    return { error: unexpectedError(err) };
  }

  redirect("/");
}

/**
 * Pide el mail para elegir una contraseña nueva. Siempre responde lo mismo
 * exista o no la cuenta: así nadie puede usar este formulario para averiguar
 * qué emails están registrados.
 */
export async function requestPasswordReset(_prevState: AuthResult, formData: FormData): Promise<AuthResult> {
  const email = String(formData.get("email") ?? "").trim();

  if (!email) {
    return { error: "Escribí tu email." };
  }

  try {
    const requestHeaders = await headers();
    const origin = requestHeaders.get("origin");

    const supabase = await createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      // El callback canjea el código del mail por una sesión y después nos
      // lleva a la pantalla donde se elige la contraseña nueva.
      redirectTo: origin ? `${origin}/api/auth/callback?next=/auth/reset` : undefined,
    });
    if (error) {
      return { error: translateAuthError(error.message) };
    }
  } catch (err) {
    console.error("[auth] requestPasswordReset falló:", err);
    return { error: unexpectedError(err) };
  }

  return { info: "Si hay una cuenta con ese email, te mandamos un link para elegir una contraseña nueva. Revisá tu bandeja de entrada (y el spam)." };
}

/** Guarda la contraseña nueva. Solo funciona con la sesión que abre el link del mail. */
export async function updatePassword(_prevState: AuthResult, formData: FormData): Promise<AuthResult> {
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (password.length < 6) {
    return { error: "La contraseña tiene que tener al menos 6 caracteres." };
  }
  if (password !== confirm) {
    return { error: "Las contraseñas no coinciden." };
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return { error: "El link venció o ya se usó. Pedí uno nuevo desde el inicio de sesión." };
    }

    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      return { error: translateAuthError(error.message) };
    }
  } catch (err) {
    console.error("[auth] updatePassword falló:", err);
    return { error: unexpectedError(err) };
  }

  redirect("/");
}

export async function signOut() {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
  } catch (err) {
    console.error("[auth] signOut falló:", err);
  }
  redirect("/");
}

// Supabase devuelve los mensajes de error en inglés; traducimos los más
// comunes para que la experiencia quede en español de punta a punta.
function translateAuthError(message: string): string {
  const known: Record<string, string> = {
    "Invalid login credentials": "Email o contraseña incorrectos.",
    "User already registered": "Ya existe una cuenta con ese email.",
    "Email not confirmed": "Todavía no confirmaste tu email: revisá tu bandeja de entrada.",
    "Signups not allowed for this instance": "El registro de cuentas está desactivado en este momento.",
    "Anonymous sign-ins are disabled": "Completá el email y la contraseña.",
    "New password should be different from the old password.": "La contraseña nueva tiene que ser distinta a la anterior.",
  };
  if (known[message]) return known[message];

  const lower = message.toLowerCase();
  if (lower.includes("rate limit") || lower.includes("only request this after")) {
    return "Hiciste demasiados intentos seguidos. Esperá unos minutos y probá de nuevo.";
  }
  if (lower.includes("invalid format") || lower.includes("unable to validate email")) {
    return "El email no parece válido. Revisalo y probá de nuevo.";
  }
  if (lower.includes("password should be")) {
    return "La contraseña es muy débil. Probá con una más larga.";
  }
  return `No se pudo completar la operación (${message}).`;
}

function unexpectedError(err: unknown): string {
  const detail = err instanceof Error ? err.message : "error desconocido";
  return `No pudimos conectar con el servicio de cuentas (${detail}). Probá de nuevo en un momento.`;
}
