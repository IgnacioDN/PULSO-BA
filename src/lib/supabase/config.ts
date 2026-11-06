/**
 * Mismo criterio que con Google Maps y Gemini: mientras no estén cargadas
 * las variables de entorno de Supabase, el resto del sitio sigue andando
 * normal — solo se ocultan el login y las funciones de comunidad.
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}