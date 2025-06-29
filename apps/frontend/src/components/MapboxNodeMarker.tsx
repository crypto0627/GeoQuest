'use client'
import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import type { MapNode } from "@/types/nodeType";

interface MapboxNodeMarkerProps {
  mapRef: React.MutableRefObject<mapboxgl.Map | null>;
  node: MapNode;
  onClick?: (node: MapNode) => void;
}

export default function MapboxNodeMarker({ mapRef, node, onClick }: MapboxNodeMarkerProps) {
  const markerRef = useRef<mapboxgl.Marker | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;
    // Create custom marker DOM
    const el = document.createElement('div');
    el.className = 'w-8 h-8 rounded-full bg-yellow-400 border-4 border-white shadow-lg flex items-center justify-center cursor-pointer group';
    el.style.width = '32px';
    el.style.height = '32px';
    el.style.display = 'flex';
    el.style.alignItems = 'center';
    el.style.justifyContent = 'center';
    el.title = node.name;
    el.innerHTML = `<span style="font-size:18px;font-weight:bold;color:#fff;">★</span>`;
    if (onClick) {
      el.onclick = (e) => {
        e.stopPropagation();
        onClick(node);
      };
    }
    // Create marker
    if (markerRef.current) markerRef.current.remove();
    markerRef.current = new mapboxgl.Marker({ element: el })
      .setLngLat([node.lng, node.lat])
      .addTo(mapRef.current);

    return () => {
      if (markerRef.current) markerRef.current.remove();
    };
  }, [mapRef, node, onClick]);

  return null;
} 