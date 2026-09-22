import { z } from "zod";
import eventsJson from "@/data/events.json";
import venuesJson from "@/data/venues.json";
import vibesJson from "@/data/vibes.json";
import {
  EventSchema,
  VenueSchema,
  VibeSchema,
  type EventWithRelations,
} from "./schemas";

/**
 * CAPA DE DATOS: la única parte de la app que sabe de dónde salen los datos.
 * Hoy lee JSON local; en la fase 4 se reemplaza por Supabase SIN tocar
 * los componentes. Por eso las funciones ya son async.
 */

// Validamos al cargar: si un dato está mal, falla rápido y con un mensaje claro.
const vibes = z.array(VibeSchema).parse(vibesJson);
const venues = z.array(VenueSchema).parse(venuesJson);
const events = z.array(EventSchema).parse(eventsJson);

const vibesById = new Map(vibes.map((v) => [v.id, v]));
const venuesById = new Map(venues.map((v) => [v.id, v]));

function withRelations(event: (typeof events)[number]): EventWithRelations {
  const venue = venuesById.get(event.venueId);
  const vibe = vibesById.get(event.vibeId);
  if (!venue) throw new Error(`Evento "${event.slug}": venueId inexistente "${event.venueId}"`);
  if (!vibe) throw new Error(`Evento "${event.slug}": vibeId inexistente "${event.vibeId}"`);
  return { ...event, venue, vibe };
}

// Resolvemos las relaciones una vez, al cargar el módulo, para detectar datos rotos temprano.
const allEvents: EventWithRelations[] = events
  .map(withRelations)
  .sort((a, b) => a.startsAt.localeCompare(b.startsAt));

export async function getEvents(): Promise<EventWithRelations[]> {
  return allEvents;
}

export async function getEventBySlug(slug: string): Promise<EventWithRelations | undefined> {
  return allEvents.find((e) => e.slug === slug);
}

export async function getVibes() {
  return vibes;
}

export async function getVenues() {
  return venues;
}
