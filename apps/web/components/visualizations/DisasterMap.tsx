"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import { disasterEvents } from "@/lib/mock-data";

export function DisasterMap({ territory = "All", onSelectProject }: { territory?: string, onSelectProject?: (id: string) => void }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  const territoryCoords: Record<string, { center: [number, number]; zoom: number }> = {
    "All": { center: [20.5937, 78.9629], zoom: 4.5 },
    "North India": { center: [28.7041, 77.1025], zoom: 6 },
    "South India": { center: [12.9716, 77.5946], zoom: 6 },
    "East India": { center: [22.5726, 88.3639], zoom: 6 },
    "West India": { center: [19.0760, 72.8777], zoom: 6 },
    "Central India": { center: [23.2599, 77.4126], zoom: 6 },
    "Global": { center: [20, 0], zoom: 2 }
  };

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: territoryCoords["All"].center,
      zoom: territoryCoords["All"].zoom,
      scrollWheelZoom: true
    });
    mapRef.current = map;
    
    layerGroupRef.current = L.layerGroup().addTo(map);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors"
    }).addTo(map);

    return () => {
      map.remove();
      mapRef.current = null;
      layerGroupRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current || !layerGroupRef.current) return;

    const map = mapRef.current;
    const layerGroup = layerGroupRef.current;

    layerGroup.clearLayers();

    const filteredEvents = territory === "All" ? disasterEvents : disasterEvents.filter(e => e.territory === territory);

    filteredEvents.forEach((event) => {
      L.circle([event.lat, event.lng], {
        radius: event.radiusKm * 1000,
        color: event.riskScore > 80 ? "#ff6f61" : "#50e3d6",
        fillColor: event.riskScore > 80 ? "#ff6f61" : "#50e3d6",
        fillOpacity: 0.14,
        weight: 2
      }).addTo(layerGroup);

      L.circleMarker([event.lat, event.lng], {
        radius: 8,
        color: "#081014",
        fillColor: event.riskScore > 80 ? "#ff6f61" : "#50e3d6",
        fillOpacity: 1,
        weight: 2
      })
        .bindPopup(`
          <div style="min-width: 200px; padding: 4px;">
            <div style="font-size: 10px; text-transform: uppercase; color: #50e3d6; margin-bottom: 4px;">${event.type}</div>
            <strong style="font-size: 15px; display: block; margin-bottom: 2px;">${event.name}</strong>
            <div style="font-size: 12px; color: #94a3b8; margin-bottom: 10px;">${event.location}</div>
            
            <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 4px; padding-top: 6px; border-top: 1px solid rgba(255,255,255,0.1);">
              <span style="color: #94a3b8;">Risk Score:</span> <strong style="color: ${event.riskScore > 80 ? '#ff6f61' : '#50e3d6'}">${event.riskScore}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 4px;">
              <span style="color: #94a3b8;">Status:</span> <strong>${event.status}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 12px;">
              <span style="color: #94a3b8;">Radius:</span> <strong>${event.radiusKm} km</strong>
            </div>
          </div>
        `)
        .on('click', () => {
          if (onSelectProject) {
            onSelectProject(event.id);
          }
        })
        .addTo(layerGroup);
    });

    const target = territoryCoords[territory] || territoryCoords["All"];
    map.flyTo(target.center, target.zoom, { duration: 1.5 });

  }, [territory]);

  return (
    <div className="h-[440px] overflow-hidden rounded-lg border border-white/10">
      <div ref={containerRef} className="h-full w-full" />
    </div>
  );
}
