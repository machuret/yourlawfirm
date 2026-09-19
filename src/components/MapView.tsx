"use client";
import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
type Pin = { slug: string; name: string; lat: number; lng: number; rating: number | null; count: number | null; suburb: string | null };
export default function MapView({ pins }: { pins: Pin[] }) {
  const el = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let map: import("leaflet").Map | undefined; let cancelled = false;
    (async () => {
      const L = await import("leaflet"); if (cancelled || !el.current) return;
      map = L.map(el.current, { scrollWheelZoom: false, zoomControl: true });
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution: "© OpenStreetMap contributors", maxZoom: 18 }).addTo(map);
      const icon = L.divIcon({ className: "", html: '<span style="display:block;width:14px;height:14px;border-radius:999px;background:#0d6e52;border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.35)"></span>', iconSize: [14, 14], iconAnchor: [7, 7] });
      const pts: [number, number][] = [];
      for (const p of pins) {
        pts.push([p.lat, p.lng]);
        const r = p.rating != null && (p.count ?? 0) >= 3 ? `<br/><span style="color:#ff9500">★</span> ${p.rating.toFixed(1)} (${p.count})` : "";
        L.marker([p.lat, p.lng], { icon, title: p.name }).addTo(map).bindPopup(`<a href="/lawyers/${p.slug}" style="font-weight:600;color:#1d1d1f">${p.name.replace(/</g, "&lt;")}</a><br/><span style="color:#6e6e73">${p.suburb ?? ""}</span>${r}`);
      }
      if (pts.length) map.fitBounds(L.latLngBounds(pts), { padding: [30, 30], maxZoom: 14 }); else map.setView([-28, 134], 4);
    })();
    return () => { cancelled = true; map?.remove(); };
  }, [pins]);
  return <div ref={el} className="surface h-[70vh] min-h-[420px] w-full overflow-hidden" role="region" aria-label="Map of firms" />;
}
