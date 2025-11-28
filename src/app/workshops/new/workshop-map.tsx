"use client";

import { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const markerIcon = new L.Icon({
  iconUrl: "https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function WorkshopMap({ onSelectPosition }: any) {
  // ⬅️ Guardamos la posición interna
  const [position, setPosition] = useState<[number, number] | null>(null);

  function LocationSelector() {
    useMapEvents({
      click(e) {
        const newPos: [number, number] = [e.latlng.lat, e.latlng.lng];
        setPosition(newPos);           // actualizar el mapa
        onSelectPosition(newPos);      // enviar posición al formulario
      },
    });
    return null;
  }

  return (
    <MapContainer
      center={[6.2442, -75.5812]} // Medellín
      zoom={13}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <LocationSelector />

      {/* Mostrar marcador SOLO si ya se seleccionó */}
      {position && (
        <Marker position={position} icon={markerIcon} />
      )}
    </MapContainer>
  );
}
