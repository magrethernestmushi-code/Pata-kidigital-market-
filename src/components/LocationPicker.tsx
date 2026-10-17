"use client";

import { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";

const DAR_ES_SALAAM: [number, number] = [-6.7924, 39.2083];

export default function LocationPicker({
  initial,
  onConfirm,
  onClose,
}: {
  initial?: { lat: number; lng: number } | null;
  onConfirm: (coords: { lat: number; lng: number }) => void;
  onClose: () => void;
}) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<import("leaflet").Map | null>(null);
  const [center, setCenter] = useState<[number, number]>(
    initial ? [initial.lat, initial.lng] : DAR_ES_SALAAM
  );
  const [locating, setLocating] = useState(false);
  const [ready, setReady] = useState(false);

  // Set up the map once, on mount.
  useEffect(() => {
    let cancelled = false;

    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !mapContainerRef.current || mapRef.current) return;

      const map = L.map(mapContainerRef.current, {
        center,
        zoom: 16,
        zoomControl: false,
        attributionControl: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      L.control.zoom({ position: "bottomright" }).addTo(map);

      map.on("move", () => {
        const c = map.getCenter();
        setCenter([c.lat, c.lng]);
      });

      mapRef.current = map;
      setReady(true);

      // If we don't already have a precise initial pin, try to center on the
      // visitor's current location as a starting point (they still drag from there).
      if (!initial && "geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            if (cancelled) return;
            const c: [number, number] = [pos.coords.latitude, pos.coords.longitude];
            map.setView(c, 17);
            setCenter(c);
          },
          () => {
            /* fall back silently to the Dar es Salaam default view */
          },
          { enableHighAccuracy: true, timeout: 8000 }
        );
      }
    })();

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleUseMyLocation() {
    if (!("geolocation" in navigator) || !mapRef.current) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const c: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        mapRef.current?.setView(c, 17);
        setCenter(c);
        setLocating(false);
      },
      () => setLocating(false),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-cream">
      <div className="flex items-center justify-between px-4 py-3 border-b border-forest/10 bg-white">
        <h2 className="font-bold text-forest-dark text-sm sm:text-base">
          Drag the map to position the pin
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="text-charcoal/60 hover:text-charcoal text-sm font-semibold"
          aria-label="Close map"
        >
          ✕ Cancel
        </button>
      </div>

      <div className="relative flex-1">
        <div ref={mapContainerRef} className="absolute inset-0" />

        {/* Fixed center pin — the map moves underneath it; this is the exact
            spot that gets saved, same pattern as Uber/Bolt/Glovo. */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full z-[500] text-4xl drop-shadow-lg">
          📍
        </div>
        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[400] h-2 w-2 rounded-full bg-forest-dark/40" />

        {!ready && (
          <div className="absolute inset-0 flex items-center justify-center bg-cream text-sm text-charcoal/50">
            Loading map...
          </div>
        )}

        <button
          type="button"
          onClick={handleUseMyLocation}
          disabled={locating}
          className="absolute bottom-4 left-4 z-[500] rounded-full bg-white shadow-lg px-3.5 py-2 text-sm font-semibold text-forest-dark flex items-center gap-1.5 disabled:opacity-60"
        >
          🎯 {locating ? "Locating..." : "Use my current location"}
        </button>
      </div>

      <div className="border-t border-forest/10 bg-white p-4 flex flex-col gap-2">
        <p className="text-xs text-charcoal/50 text-center">
          {center[0].toFixed(5)}, {center[1].toFixed(5)}
        </p>
        <button
          type="button"
          onClick={() => onConfirm({ lat: center[0], lng: center[1] })}
          className="btn-primary"
        >
          Confirm This Location
        </button>
      </div>
    </div>
  );
}
