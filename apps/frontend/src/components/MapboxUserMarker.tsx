'use client'
import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";

type UserLocation = { lng: number; lat: number };

interface MapboxUserMarkerProps {
  mapRef: React.MutableRefObject<mapboxgl.Map | null>;
  userLocation: UserLocation;
}

export default function MapboxUserMarker({ mapRef, userLocation }: MapboxUserMarkerProps) {
  const markerRef = useRef<mapboxgl.Marker | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;
    // Create custom marker DOM
    const el = document.createElement('div');
    el.className = 'w-7 h-7 rounded-full bg-blue-500 border-4 border-white shadow-lg flex items-center justify-center';
    el.style.width = '28px';
    el.style.height = '28px';
    el.style.display = 'flex';
    el.style.alignItems = 'center';
    el.style.justifyContent = 'center';
    el.innerHTML = '<div style="width:10px;height:10px;border-radius:50%;background:white"></div>';

    // Create marker
    if (markerRef.current) markerRef.current.remove();
    markerRef.current = new mapboxgl.Marker({ element: el })
      .setLngLat([userLocation.lng, userLocation.lat])
      .addTo(mapRef.current);

    return () => {
      if (markerRef.current) markerRef.current.remove();
    };
  }, [mapRef, userLocation]);

  return null;
} 