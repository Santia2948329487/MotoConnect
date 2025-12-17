"use client";

import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect } from 'react';

const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

type Waypoint = { lat: number; lng: number; name?: string };

export default function RouteMapViewClient({ 
  waypoints, 
  initialCenter = [6.2442, -75.5812], 
  zoom = 11 
}: { 
  waypoints: Waypoint[]; 
  initialCenter?: [number, number]; 
  zoom?: number 
}) {
  // Debug: mostrar waypoints en consola
  useEffect(() => {
    console.log('🗺️ Waypoints recibidos:', waypoints);
    console.log('📍 Cantidad de waypoints:', waypoints?.length || 0);
  }, [waypoints]);

  const positions = waypoints?.map(w => [w.lat, w.lng] as [number, number]) || [];
  const center: [number, number] = positions.length > 0 
    ? positions[Math.floor(positions.length/2)] 
    : initialCenter;

  return (
    <div className="h-[500px] rounded-xl overflow-hidden relative">
      {/* Mostrar mensaje si no hay waypoints */}
      {(!waypoints || waypoints.length === 0) && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000] bg-yellow-500 text-black px-4 py-2 rounded-lg shadow-lg font-semibold">
          ⚠️ No hay waypoints para esta ruta
        </div>
      )}
      
      <MapContainer center={center} zoom={zoom} scrollWheelZoom className="w-full h-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {positions.map((pos, i) => (
          <Marker key={i} position={pos}>
            <Popup>{waypoints[i]?.name || `Punto ${i+1}`}</Popup>
          </Marker>
        ))}

        {positions.length > 1 && (
          <Polyline positions={positions} color="blue" weight={4} opacity={0.7} />
        )}
      </MapContainer>
    </div>
  );
}