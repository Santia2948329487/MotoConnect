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

// Icono rojo para puntos de ruta
const RedIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

type Waypoint = { lat: number; lng: number; name?: string };

export default function RouteMapView({ 
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
    console.log('🗺️ RouteMapView - Waypoints recibidos:', waypoints);
    console.log('🗺️ RouteMapView - Tipo de waypoints:', typeof waypoints);
    console.log('🗺️ RouteMapView - Es array?', Array.isArray(waypoints));
    console.log('🗺️ RouteMapView - Cantidad:', waypoints?.length || 0);
    
    if (waypoints && waypoints.length > 0) {
      console.log('🗺️ RouteMapView - Primer waypoint:', waypoints[0]);
    }
  }, [waypoints]);

  // Asegurar que waypoints sea un array válido
  const validWaypoints = Array.isArray(waypoints) ? waypoints : [];
  
  const positions = validWaypoints
    .filter(w => w && typeof w.lat === 'number' && typeof w.lng === 'number')
    .map(w => [w.lat, w.lng] as [number, number]);

  const center: [number, number] = positions.length > 0 
    ? positions[Math.floor(positions.length/2)] 
    : initialCenter;

  console.log('🗺️ RouteMapView - Posiciones procesadas:', positions);
  console.log('🗺️ RouteMapView - Centro del mapa:', center);

  return (
    <div className="h-[500px] rounded-xl overflow-hidden relative">
      {/* Mostrar mensaje si no hay waypoints */}
      {positions.length === 0 && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000] bg-yellow-500 text-black px-4 py-2 rounded-lg shadow-lg font-semibold">
          ⚠️ No hay waypoints para esta ruta
        </div>
      )}
      
      {/* Mostrar contador de waypoints */}
      {positions.length > 0 && (
        <div className="absolute top-4 right-4 z-[1000] bg-green-500 text-white px-3 py-1 rounded-lg shadow-lg font-semibold text-sm">
          ✓ {positions.length} puntos en la ruta
        </div>
      )}
      
      <MapContainer 
        center={center} 
        zoom={zoom} 
        scrollWheelZoom 
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Marcadores de waypoints */}
        {positions.map((pos, i) => (
          <Marker key={i} position={pos} icon={RedIcon}>
            <Popup>
              <div className="text-center">
                <strong>{validWaypoints[i]?.name || `Punto ${i+1}`}</strong>
                <br />
                <small>Lat: {pos[0].toFixed(5)}, Lng: {pos[1].toFixed(5)}</small>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Línea de la ruta */}
        {positions.length > 1 && (
          <Polyline 
            positions={positions} 
            color="#ef4444" 
            weight={4} 
            opacity={0.8}
            dashArray="10, 5"
          />
        )}
      </MapContainer>
    </div>
  );
}