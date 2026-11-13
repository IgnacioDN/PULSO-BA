/**
 * Nombre que se muestra junto a una reseña. Sale de la parte del email antes
 * de la @, limpia y acortada, así el email completo nunca queda en la base.
 */
export function displayNameFromEmail(email: string): string {
  const local = email.split("@")[0] ?? "";
  const clean = local.replace(/[^\p{L}\p{N}._-]/gu, "").slice(0, 24);
  return clean.length > 0 ? clean : "Usuario";
}
