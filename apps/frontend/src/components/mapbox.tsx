"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Navigation } from "lucide-react";
import MapboxUserMarker from "./MapboxUserMarker";
import { mockNodes } from "@/constants/nodeInfo";
import MapboxNodeMarker from "./MapboxNodeMarker";
import type { MapNode } from "@/types/nodeType";
import InfoBox from "./InfoBox";
import LaserCorridorGame from "./LaserCorridorGame";

interface MapboxProps {
  center?: [number, number];
  zoom?: number;
  className?: string;
}

type UserLocation = { lng: number; lat: number };

const DEFAULT_LOCATION: UserLocation = { lng: 121.5625, lat: 25.0436 };
const MOVE_STEP = 0.0001; // Step size for each arrow key move

// Haversine formula to get distance in meters between two lat/lng
function getDistance(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371000; // Earth radius in meters
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const NODE_VISIBLE_RADIUS = 50; // meters

export default function Mapbox({
  center,
  zoom = 16,
  className = "absolute inset-0 w-full h-full min-h-full min-w-full z-10",
}: MapboxProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [userLocation, setUserLocation] = useState<UserLocation>(DEFAULT_LOCATION);
  const [isFollowing, setIsFollowing] = useState(true);
  const [mapLoaded, setMapLoaded] = useState(false);
  const initialLocationRef = useRef<UserLocation>(DEFAULT_LOCATION);
  const [visibleNodes, setVisibleNodes] = useState<MapNode[]>([]);
  const [infoBoxNode, setInfoBoxNode] = useState<MapNode | null>(null);
  const [infoBoxPos, setInfoBoxPos] = useState<{ x: number; y: number } | null>(null);
  const [showGame, setShowGame] = useState(false);
  const [gameNode, setGameNode] = useState<MapNode | null>(null);

  // Record initial user location (only on first render)
  useEffect(() => {
    initialLocationRef.current = userLocation;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Listen for keyboard events to control userLocation
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    setUserLocation((prev) => {
      let { lng, lat } = prev;
      switch (e.key) {
        case "ArrowUp":
          lat += MOVE_STEP;
          break;
        case "ArrowDown":
          lat -= MOVE_STEP;
          break;
        case "ArrowLeft":
          lng -= MOVE_STEP;
          break;
        case "ArrowRight":
          lng += MOVE_STEP;
          break;
        default:
          return prev;
      }
      setIsFollowing(true);
      return { lng, lat };
    });
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // When userLocation changes, center the map if isFollowing is true
  useEffect(() => {
    if (!mapRef.current || !userLocation) return;
    if (isFollowing) {
      mapRef.current.setCenter([userLocation.lng, userLocation.lat]);
    }
  }, [userLocation, isFollowing]);

  useEffect(() => {
    if (!mapContainer.current) return;
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_API_KEY!;
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: center ?? [DEFAULT_LOCATION.lng, DEFAULT_LOCATION.lat],
      zoom,
    });
    mapRef.current = map;
    map.on('load', () => {
      setMapLoaded(true);
    });
    map.on('style.load', () => {
      const layers = map.getStyle().layers;
      if (layers) {
        layers.forEach((layer) => {
          if (
            layer.id.includes('poi-business') ||
            layer.id.includes('poi-label')
          ) {
            try { map.removeLayer(layer.id); } catch {}
          }
        });
      }
    });
    // When dragging the map, stop following the user
    map.on('dragstart', () => {
      setIsFollowing(false);
    });
    setTimeout(() => { map.resize(); }, 100);
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [center, zoom]);

  // When clicking the locate button, fly to the user's current location and resume following
  const handleLocate = () => {
    if (mapRef.current && userLocation) {
      setIsFollowing(true);
      mapRef.current.flyTo({ center: [userLocation.lng, userLocation.lat], zoom });
    }
  };

  // Update visible nodes when userLocation changes
  useEffect(() => {
    setVisibleNodes(
      mockNodes.filter((node) =>
        getDistance(userLocation.lat, userLocation.lng, node.lat, node.lng) <= NODE_VISIBLE_RADIUS
      )
    );
    // Automatically close info box when moving
    setInfoBoxNode(null);
  }, [userLocation]);

  // Triggered when clicking a node marker
  const handleNodeClick = (node: MapNode) => {
    setInfoBoxNode(node);
    // Get marker's pixel coordinates
    if (mapRef.current) {
      const p = mapRef.current.project([node.lng, node.lat]);
      setInfoBoxPos({ x: p.x, y: p.y });
    }
  };

  // Automatically update info box position when the map moves
  useEffect(() => {
    if (!infoBoxNode || !mapRef.current) return;
    const update = () => {
      const p = mapRef.current!.project([infoBoxNode.lng, infoBoxNode.lat]);
      setInfoBoxPos({ x: p.x, y: p.y });
    };
    mapRef.current.on('move', update);
    update();
    return () => {
      mapRef.current?.off('move', update);
    };
  }, [infoBoxNode]);

  return (
    <>
      {showGame && gameNode ? (
        <LaserCorridorGame onClose={() => setShowGame(false)} />
      ) : (
        <>
          <div ref={mapContainer} className={className + " min-h-full min-w-full"} />
          {/* User marker: fixed at userLocation using mapboxgl.Marker */}
          {mapLoaded && <MapboxUserMarker mapRef={mapRef} userLocation={userLocation} />}
          {/* Game node markers (within 50m) */}
          {mapLoaded && visibleNodes.map((node) => (
            <MapboxNodeMarker key={node.id} mapRef={mapRef} node={node} onClick={handleNodeClick} />
          ))}
          {/* Node Info Box (only shown above marker) */}
          {infoBoxNode && infoBoxPos && (
            <InfoBox
              node={infoBoxNode}
              pos={infoBoxPos}
              onClose={() => setInfoBoxNode(null)}
              onStart={() => {
                setGameNode(infoBoxNode);
                setShowGame(true);
                setInfoBoxNode(null);
              }}
            />
          )}
          {/* Locate button */}
          <button
            type="button"
            onClick={handleLocate}
            className="absolute bottom-6 right-6 z-30 bg-white rounded-full shadow-lg p-3 border border-neutral-200 hover:bg-blue-50 active:scale-95 transition"
            aria-label="Go to default location"
            style={{ boxShadow: "0 2px 8px 0 rgba(0,0,0,0.10)" }}
          >
            <Navigation size={28} className="text-blue-600" />
          </button>
        </>
      )}
    </>
  );
} 