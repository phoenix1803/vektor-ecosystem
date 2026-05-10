"use client";

import { useMemo } from "react";
import { CircleMarker, MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { divIcon } from "leaflet";

type LeafletMapProps = {
  center: [number, number];
  hospitalName: string;
  ambulanceLabel: string;
};

export function LeafletMap({ center, hospitalName, ambulanceLabel }: LeafletMapProps) {
  const markerIcon = useMemo(
    () =>
      divIcon({
        className: "",
        html: `
          <div style="width:18px;height:18px;border-radius:9999px;background:#0e5f4f;border:3px solid white;box-shadow:0 8px 18px rgba(0,0,0,.18)"></div>
        `,
        iconSize: [18, 18],
        iconAnchor: [9, 9],
      }),
    [],
  );

  return (
    <div className="overflow-hidden rounded-2xl border border-line">
      <MapContainer center={center} zoom={13} scrollWheelZoom={false} className="h-80 w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <CircleMarker center={center} radius={10} pathOptions={{ color: "#0e5f4f", fillColor: "#0e5f4f", fillOpacity: 0.2 }} />
        <Marker position={center} icon={markerIcon}>
          <Popup>
            {hospitalName}
            <br />
            {ambulanceLabel}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
