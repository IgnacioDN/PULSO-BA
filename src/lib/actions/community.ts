"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { displayNameFromEmail } from "@/lib/displayName";

type ActionResult = { error: string } | { ok: true };

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { supabase, user };
}

/**
 * Favoritos y asistencia ("voy") funcionan igual: si ya existe la fila la
 * borra, si no existe la crea. No hace falta saber el estado actual desde
 * el cliente — el toggle se resuelve acá, en el servidor.
 */
export async function toggleFavorite(eventSlug: string, eventId: string): Promise<ActionResult> {
  const { supabase, user } = await requireUser();
  if (!user) return { error: "Iniciá sesión para guardar favoritos." };

  const { data: existing } = await supabase
    .from("favorites")
    .select("user_id")
    .eq("event_id", eventId)
    .eq("user_id", user.id)
    .maybeSingle();

  const { error } = existing
    ? await supabase.from("favorites").delete().eq("event_id", eventId).eq("user_id", user.id)
    : await supabase.from("favorites").insert({ event_id: eventId, user_id: user.id });

  if (error) return { error: "No pudimos guardar el cambio. Probá de nuevo." };

  revalidatePath(`/events/${eventSlug}`);
  return { ok: true };
}

export async function toggleAttendance(eventSlug: string, eventId: string): Promise<ActionResult> {
  const { supabase, user } = await requireUser();
  if (!user) return { error: "Iniciá sesión para marcar que vas." };

  const { data: existing } = await supabase
    .from("attendances")
    .select("user_id")
    .eq("event_id", eventId)
    .eq("user_id", user.id)
    .maybeSingle();

  const { error } = existing
    ? await supabase.from("attendances").delete().eq("event_id", eventId).eq("user_id", user.id)
    : await supabase.from("attendances").insert({ event_id: eventId, user_id: user.id });

  if (error) return { error: "No pudimos guardar el cambio. Probá de nuevo." };

  revalidatePath(`/events/${eventSlug}`);
  return { ok: true };
}

export async function submitReview(
  eventSlug: string,
  eventId: string,
  _prevState: ActionResult | undefined,
  formData: FormData,
): Promise<ActionResult> {
  const { supabase, user } = await requireUser();
  if (!user || !user.email) return { error: "Iniciá sesión para dejar tu reseña." };

  const rating = Number(formData.get("rating"));
  const body = String(formData.get("body") ?? "").trim();

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return { error: "Elegí un puntaje de 1 a 5." };
  }
  if (body.length === 0 || body.length > 1000) {
    return { error: "Escribí una reseña de hasta 1000 caracteres." };
  }

  // upsert: si ya había dejado una reseña para este evento, la actualiza en
  // vez de duplicarla (la tabla tiene unique(user_id, event_id)).
  const { error } = await supabase.from("reviews").upsert(
    {
      event_id: eventId,
      user_id: user.id,
      author_name: displayNameFromEmail(user.email),
      rating,
      body,
    },
    { onConflict: "user_id,event_id" },
  );

  if (error) return { error: "No pudimos publicar la reseña. Probá de nuevo." };

  revalidatePath(`/events/${eventSlug}`);
  return { ok: true };
}