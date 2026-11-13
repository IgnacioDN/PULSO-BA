import { z } from "zod";

/**
 * Los tipos se DERIVAN de los esquemas (z.infer): una sola fuente de verdad.
 * Los esquemas validan los datos cuando entran (JSON hoy, Supabase mañana),
 * y TypeScript ya conoce la forma exacta de lo que sale.
 */

export const CategorySchema = z.enum([
  "music",
  "theater",
  "food",
  "nightlife",
  "art",
  "social",
]);

const LocalizedSchema = z.object({ es: z.string(), en: z.string() });
const HexColor = z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Color hex inválido");

export const VibeSchema = z.object({
  id: z.string(),
  label: LocalizedSchema,
  palette: z.tuple([HexColor, HexColor, HexColor]),
  tags: z.array(z.string()),
});

export const VenueSchema = z.object({
  id: z.string(),
  name: z.string(),
  neighborhood: z.string(),
  address: z.string(),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  images: z.array(z.string()),
});

export const PhotoSchema = z.object({
  url: z.url(),
  photographer: z.string(),
  photographerUrl: z.url(),
  sourceUrl: z.url(),
});

export const EventSchema = z.object({
  id: z.string(),
  slug: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Slug inválido"),
  title: LocalizedSchema,
  description: LocalizedSchema,
  category: CategorySchema,
  vibeId: z.string(),
  venueId: z.string(),
  startsAt: z.iso.datetime({ offset: true }), // ISO 8601 con zona horaria
  endsAt: z.iso.datetime({ offset: true }).optional(),
  priceRange: z
    .object({
      min: z.number().int().nonnegative(),
      max: z.number().int().nonnegative(),
      currency: z.literal("ARS"),
    })
    .refine((p) => p.max >= p.min, "El precio máximo no puede ser menor al mínimo"),
  images: z.array(z.string()),
  /** Foto propia del evento (Unsplash). Si falta, se usa la de su categoría. */
  photo: PhotoSchema.optional(),
  lineup: z.array(z.string()).optional(),
  tags: z.array(z.string()),
});

export const ReviewSchema = z.object({
  id: z.string(),
  eventId: z.string(),
  userId: z.string(),
  rating: z.number().int().min(1).max(5),
  body: z.string().min(1),
  photos: z.array(z.string()),
  createdAt: z.iso.datetime({ offset: true }),
});

export type Photo = z.infer<typeof PhotoSchema>;
export type Category = z.infer<typeof CategorySchema>;
export type Vibe = z.infer<typeof VibeSchema>;
export type Venue = z.infer<typeof VenueSchema>;
export type EventItem = z.infer<typeof EventSchema>;
export type Review = z.infer<typeof ReviewSchema>;

/** Un evento con su lugar y su vibra ya resueltos (lo que consume la UI). */
export type EventWithRelations = EventItem & { venue: Venue; vibe: Vibe };
