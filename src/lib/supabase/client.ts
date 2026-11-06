import { createBrowserClient } from "@supabase/ssr";

/**
 * Cliente de Supabase para componentes del navegador ("use client").
 * Usa la URL y la clave "anon" (pública a propósito: la seguridad real la
 * da Row Level Security en la base, no el secreto de esta clave).
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}