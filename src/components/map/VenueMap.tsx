"use client";

import { useEffect, useRef, useState } from "react";
import { setOptions, importLibrary } from "@googlemaps/js-api-loader";
import { darkMapStyle } from "@/lib/mapStyle";
import type { Venue } from "@/lib/schemas";

type Props = {
  venues: Venue[];
};

const BUENOS_AIRES_CENTER = { lat: -34.6037, lng: -58.4173 };

export function VenueMap({ venues }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(() =>
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
      ? null
      : "Falta configurar la clave de Google Maps (NEXT_PUBLIC_GOOGLE_MAPS_API_KEY).",
  );

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey || !mapRef.current) return;

    setOptions({ key: apiKey, v: "weekly" });
    let cancelled = false;

    importLibrary("maps")
      .then(({ Map, InfoWindow }) => {
        if (cancelled || !mapRef.current) return;

        const map = new Map(mapRef.current, {
          center: BUENOS_AIRES_CENTER,
          zoom: 12,
          styles: darkMapStyle,
          disableDefaultUI: true,
          zoomControl: true,
        });

        const infoWindow = new InfoWindow();

        venues.forEach((venue) => {
          const marker = new google.maps.Marker({
            map,
            position: { lat: venue.lat, lng: venue.lng },
            title: venue.name,
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 8,
              fillColor: "#38bdf8",
              fillOpacity: 1,
              strokeColor: "#0369a1",
              strokeWeight: 2,
            },
          });

          marker.addListener("click", () => {
            infoWindow.setContent(
              `<div style="font-family: system-ui, sans-serif; padding: 4px 2px; color:#1c1612; max-width:200px">
                <strong>${venue.name}</strong><br/>
                <span style="opacity:0.7">${venue.neighborhood}</span><br/>
                <a href="/events?neighborhood=${encodeURIComponent(venue.neighborhood)}" style="color:#0369a1">Ver eventos acá →</a>
              </div>`,
            );
            infoWindow.open({ map, anchor: marker });
          });
        });
      })
      .catch(() => {
        if (!cancelled) setError("No pudimos cargar el mapa. Revisá la clave de Google Maps.");
      });

    return () => {
      cancelled = true;
    };
  }, [venues]);

  if (error) {
    return (
      <div className="flex h-[480px] items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-center text-white/60">
        <p className="max-w-sm px-6">{error}</p>
      </div>
    );
  }

  return <div ref={mapRef} className="h-[480px] w-full overflow-hidden rounded-2xl" />;
}