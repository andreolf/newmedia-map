"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { Creator } from "@/types";
import { MapPopupCard } from "./MapPopupCard";
import { getSignalColor, getInitials } from "@/lib/utils";
import { useTheme } from "./ThemeProvider";
import "leaflet/dist/leaflet.css";

interface CreatorsMapProps {
  creators: Creator[];
}

// Create custom avatar marker icon
function createAvatarIcon(creator: Creator): L.DivIcon {
  const color = getSignalColor(creator.primary_signal);
  const initials = getInitials(creator.name);
  const hasAvatar = !!creator.avatar_url;

  const html = hasAvatar
    ? `
      <div class="avatar-marker" style="border-color: ${color}">
        <img src="${creator.avatar_url}" alt="${creator.name}" />
      </div>
    `
    : `
      <div class="avatar-marker avatar-marker-initials" style="border-color: ${color}">
        <span>${initials}</span>
      </div>
    `;

  return L.divIcon({
    html,
    className: "custom-avatar-icon",
    iconSize: [44, 44],
    iconAnchor: [22, 22],
    popupAnchor: [0, -22],
  });
}

// Create cluster icon
function createClusterIcon(cluster: { getChildCount: () => number }): L.DivIcon {
  const count = cluster.getChildCount();
  return L.divIcon({
    html: `<div class="cluster-marker"><span>+${count}</span></div>`,
    className: "custom-cluster-icon",
    iconSize: [44, 44],
    iconAnchor: [22, 22],
  });
}

// Map bounds handler
function MapBoundsHandler({ creators }: { creators: Creator[] }) {
  const map = useMap();

  useEffect(() => {
    if (creators.length > 0) {
      const bounds = L.latLngBounds(
        creators.map((c) => [c.lat, c.lng] as [number, number])
      );
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 5 });
    }
  }, [creators, map]);

  return null;
}

// Tile layer URLs (both CARTO - free, no API key required)
const LIGHT_TILES = "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";
const DARK_TILES = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";

// Component to dynamically switch tile layers
function DynamicTileLayer() {
  const { resolvedTheme } = useTheme();
  const map = useMap();
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  useEffect(() => {
    // Remove existing tile layer
    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    // Add new tile layer based on theme
    const tileUrl = resolvedTheme === "dark" ? DARK_TILES : LIGHT_TILES;
    const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';
    tileLayerRef.current = L.tileLayer(tileUrl, {
      attribution,
    }).addTo(map);

    return () => {
      if (tileLayerRef.current) {
        map.removeLayer(tileLayerRef.current);
      }
    };
  }, [resolvedTheme, map]);

  return null;
}

export function CreatorsMap({ creators }: CreatorsMapProps) {
  const [isMounted, setIsMounted] = useState(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="w-full h-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center">
        <div className="text-stone-400">Loading map...</div>
      </div>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <>
      <style jsx global>{`
        .custom-avatar-icon {
          background: transparent;
          border: none;
        }
        .avatar-marker {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: 3px solid;
          overflow: hidden;
          background: ${isDark ? "#27272a" : "white"};
          box-shadow: 0 2px 8px rgba(0, 0, 0, ${isDark ? "0.5" : "0.15"});
        }
        .avatar-marker img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .avatar-marker-initials {
          display: flex;
          align-items: center;
          justify-content: center;
          background: ${isDark ? "#3f3f46" : "#e7e5e4"};
        }
        .avatar-marker-initials span {
          font-size: 14px;
          font-weight: 600;
          color: ${isDark ? "#d4d4d8" : "#78716c"};
        }
        .custom-cluster-icon {
          background: transparent;
          border: none;
        }
        .cluster-marker {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: ${isDark
          ? "linear-gradient(135deg, #fafafa 0%, #e4e4e7 100%)"
          : "linear-gradient(135deg, #18181b 0%, #3f3f46 100%)"};
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 10px rgba(0, 0, 0, ${isDark ? "0.4" : "0.2"});
        }
        .cluster-marker span {
          color: ${isDark ? "#18181b" : "white"};
          font-size: 14px;
          font-weight: 600;
        }
        .leaflet-popup-content-wrapper {
          border-radius: 12px;
          padding: 0;
          box-shadow: 0 4px 20px rgba(0, 0, 0, ${isDark ? "0.4" : "0.12"});
          background: ${isDark ? "#27272a" : "white"};
        }
        .leaflet-popup-content {
          margin: 0;
        }
        .leaflet-popup-tip {
          background: ${isDark ? "#27272a" : "white"};
        }
        .leaflet-container {
          background: ${isDark ? "#18181b" : "#fafafa"};
        }
      `}</style>
      <MapContainer
        center={[20, 0]}
        zoom={2}
        style={{ width: "100%", height: "100%" }}
        className="z-0"
      >
        <DynamicTileLayer />
        <MapBoundsHandler creators={creators} />
        <MarkerClusterGroup
          chunkedLoading
          iconCreateFunction={createClusterIcon}
          maxClusterRadius={60}
          spiderfyOnMaxZoom
          showCoverageOnHover={false}
        >
          {creators.map((creator) => (
            <Marker
              key={creator.id}
              position={[creator.lat, creator.lng]}
              icon={createAvatarIcon(creator)}
            >
              <Popup>
                <MapPopupCard creator={creator} />
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>
    </>
  );
}

