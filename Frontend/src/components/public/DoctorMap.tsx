"use client";

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import type { Map as LeafletMap } from "leaflet";

// Real interactive map (Leaflet + free OpenStreetMap tiles — no API key).
// Leaflet is loaded inside useEffect so it never runs during SSR.
const CITIES: Record<string, [number, number]> = {
  "القاهرة": [30.0444, 31.2357],
  "الجيزة": [30.0131, 31.2089],
  "الإسكندرية": [31.2001, 29.9187],
};

export function DoctorMap() {
  const elRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !elRef.current || mapRef.current) return;

      const map = L.map(elRef.current, { zoomControl: true, attributionControl: false }).setView(CITIES["القاهرة"], 12);
      mapRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19 }).addTo(map);

      // Teal themed pin (avoids Leaflet's broken default marker images)
      const pin = L.divIcon({
        className: "",
        html: `<span class="material-symbols-outlined" style="font-variation-settings:'FILL' 1;color:#ba1a1a;font-size:34px;filter:drop-shadow(0 1px 2px rgba(0,0,0,.3))">location_on</span>`,
        iconSize: [34, 34],
        iconAnchor: [17, 32],
      });
      L.marker(CITIES["القاهرة"], { icon: pin }).addTo(map);

      // needed when the map lives inside a drawer / initially-hidden container
      setTimeout(() => map.invalidateSize(), 200);
    })();

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  const flyTo = (coords: [number, number]) => mapRef.current?.flyTo(coords, 13);

  const locateMe = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((pos) => flyTo([pos.coords.latitude, pos.coords.longitude]));
  };

  return (
    <div>
      <p className="mb-4 font-bold text-on-surface">الموقع (خريطة تفاعلية)</p>
      <div className="relative h-56 overflow-hidden rounded-xl border border-outline-variant">
        <div ref={elRef} className="h-full w-full" />
        <button
          type="button"
          onClick={locateMe}
          title="موقعي الحالي"
          className="absolute bottom-3 left-3 z-[500] flex h-9 w-9 items-center justify-center rounded-lg border border-outline-variant/40 bg-white text-primary shadow-md transition-colors hover:bg-primary-container hover:text-white"
        >
          <span className="material-symbols-outlined text-[20px]">my_location</span>
        </button>
      </div>
      <select
        onChange={(e) => { const c = CITIES[e.target.value]; if (c) flyTo(c); }}
        className="mt-4 w-full rounded-lg border-outline-variant bg-white px-4 py-2 text-label-md focus:border-primary focus:ring-primary"
      >
        <option value="">اختر مدينة (سريع)</option>
        {Object.keys(CITIES).map((c) => <option key={c} value={c}>{c}</option>)}
      </select>
    </div>
  );
}
