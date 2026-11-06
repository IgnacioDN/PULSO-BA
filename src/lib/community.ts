import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export type Review = {
  id: string;
  authorEmail: string;
  rating: number;
  body: string;
  createdAt: string;
};

export type EventCommunityStats = {
  favoriteCount: number;
  attendanceCount: number;
  averageRating: number | null;
  reviews: Review[];
  isFavorited: boolean;
  isAttending: boolean;
  myReview: Review | null;
};

const EMPTY_STATS: EventCommunityStats = {
  favoriteCount: 0,
  attendanceCount: 0,
  averageRating: null,
  reviews: [],
  isFavorited: false,
  isAttending: false,
  myReview: null,
};

/**
 * Trae todo lo que hace falta mostrar en la ficha de un evento: cuántos lo
 * marcaron favorito, cuántos van, las reseñas, y (si hay sesión) si el
 * usuario actual ya lo favoriteó / va / ya dejó su reseña. Si Supabase no
 * está configurado, devuelve todo en cero — la página sigue funcionando.
 */
export async function getEventCommunityStats(eventId: string): Promise<EventCommunityStats> {
  if (!isSupabaseConfigured()) return EMPTY_STATS;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [favoriteCountRes, attendanceCountRes, reviewsRes, myFavoriteRes, myAttendanceRes] =
    await Promise.all([
      supabase.from("favorites").select("user_id", { count: "exact", head: true }).eq("event_id", eventId),
      supabase.from("attendances").select("user_id", { count: "exact", head: true }).eq("event_id", eventId),
      supabase
        .from("reviews")
        .select("id, author_email, rating, body, created_at, user_id")
        .eq("event_id", eventId)
        .order("created_at", { ascending: false }),
      user
        ? supabase.from("favorites").select("user_id").eq("event_id", eventId).eq("user_id", user.id).maybeSingle()
        : Promise.resolve({ data: null }),
      user
        ? supabase.from("attendances").select("user_id").eq("event_id", eventId).eq("user_id", user.id).maybeSingle()
        : Promise.resolve({ data: null }),
    ]);

  const reviews: Review[] = (reviewsRes.data ?? []).map((r) => ({
    id: r.id,
    authorEmail: r.author_email,
    rating: r.rating,
    body: r.body,
    createdAt: r.created_at,
  }));

  const averageRating =
    reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : null;

  const myReview = user
    ? ((reviewsRes.data ?? []).find((r) => r.user_id === user.id) ?? null)
    : null;

  return {
    favoriteCount: favoriteCountRes.count ?? 0,
    attendanceCount: attendanceCountRes.count ?? 0,
    averageRating,
    reviews,
    isFavorited: Boolean(myFavoriteRes.data),
    isAttending: Boolean(myAttendanceRes.data),
    myReview: myReview
      ? {
          id: myReview.id,
          authorEmail: myReview.author_email,
          rating: myReview.rating,
          body: myReview.body,
          createdAt: myReview.created_at,
        }
      : null,
  };
}