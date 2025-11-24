// src/components/InteractiveRouteMap.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix para los íconos de Leaflet en Next.js
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface Waypoint {
  id: string;
  lat: number;
  lng: number;
  name: string;
}

interface InteractiveRouteMapProps {
  onRouteChange: (waypoints: Waypoint[], distance: number) => void;
  initialCenter?: [number, number];
  initialZoom?: number;
}

// Componente para manejar clicks en el mapa
function MapClickHandler({ onAddWaypoint }: { onAddWaypoint: (lat: number, lng: number) => void }) {
  useMapEvents({
    click: (e) => {
      onAddWaypoint(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function InteractiveRouteMap({
  onRouteChange,
  initialCenter = [6.2442, -75.5812], // Medellín por defecto
  initialZoom = 12
}: InteractiveRouteMapProps) {
  const [waypoints, setWaypoints] = useState<Waypoint[]>([]);
  const [distance, setDistance] = useState<number>(0);
  const mapRef = useRef<any>(null);

  // Calcular distancia usando fórmula de Haversine
  const calculateDistance = (points: Waypoint[]): number => {
    if (points.length < 2) return 0;

    let totalDistance = 0;
    for (let i = 0; i < points.length - 1; i++) {
      const R = 6371; // Radio de la Tierra en km
      const lat1 = points[i].lat * Math.PI / 180;
      const lat2 = points[i + 1].lat * Math.PI / 180;
      const dLat = (points[i + 1].lat - points[i].lat) * Math.PI / 180;
      const dLng = (points[i + 1].lng - points[i].lng) * Math.PI / 180;

      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1) * Math.cos(lat2) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);

      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      totalDistance += R * c;
    }

    return Math.round(totalDistance * 10) / 10; // Redondear a 1 decimal
  };

  // Agregar waypoint
  const handleAddWaypoint = (lat: number, lng: number) => {
    const newWaypoint: Waypoint = {
      id: `wp-${Date.now()}`,
      lat,
      lng,
      name: waypoints.length === 0 ? 'Inicio' : waypoints.length === 1 ? 'Destino' : `Punto ${waypoints.length + 1}`
    };

    const updatedWaypoints = [...waypoints, newWaypoint];
    setWaypoints(updatedWaypoints);

    const newDistance = calculateDistance(updatedWaypoints);
    setDistance(newDistance);
    onRouteChange(updatedWaypoints, newDistance);
  };

  // Eliminar waypoint
  const handleRemoveWaypoint = (id: string) => {
    const updatedWaypoints = waypoints.filter(wp => wp.id !== id);
    setWaypoints(updatedWaypoints);

    const newDistance = calculateDistance(updatedWaypoints);
    setDistance(newDistance);
    onRouteChange(updatedWaypoints, newDistance);
  };

  // Limpiar todos los waypoints
  const handleClear = () => {
    setWaypoints([]);
    setDistance(0);
    onRouteChange([], 0);
  };

  // Generar coordenadas para la polyline
  const polylinePositions: [number, number][] = waypoints.map(wp => [wp.lat, wp.lng]);

  return (
    <div className="relative w-full h-full">
      {/* Mapa */}
      <MapContainer
        center={initialCenter}
        zoom={initialZoom}
        scrollWheelZoom={true}
        className="w-full h-full rounded-lg"
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Manejador de clicks */}
        <MapClickHandler onAddWaypoint={handleAddWaypoint} />

        {/* Marcadores */}
        {waypoints.map((waypoint, index) => (
          <Marker key={waypoint.id} position={[waypoint.lat, waypoint.lng]}>
            <Popup>
              <div className="text-center">
                <p className="font-bold text-blue-600">{waypoint.name}</p>
                <p className="text-xs text-gray-600">
                  {waypoint.lat.toFixed(5)}, {waypoint.lng.toFixed(5)}
                </p>
                <button
                  onClick={() => handleRemoveWaypoint(waypoint.id)}
                  className="mt-2 px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                >
                  Eliminar
                </button>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Polyline (línea de la ruta) */}
        {waypoints.length > 1 && (
          <Polyline
            positions={polylinePositions}
            color="blue"
            weight={4}
            opacity={0.7}
          />
        )}
      </MapContainer>

      {/* Panel de control flotante */}
      <div className="absolute top-4 right-4 bg-gray-800/95 backdrop-blur-sm p-4 rounded-lg shadow-xl z-[1000] min-w-[200px]">
        <h3 className="text-white font-bold mb-2 text-sm">Control de Ruta</h3>
        
        <div className="space-y-2 text-xs">
          <div className="flex justify-between text-gray-300">
            <span>Puntos:</span>
            <span className="font-bold text-blue-400">{waypoints.length}</span>
          </div>
          
          <div className="flex justify-between text-gray-300">
            <span>Distancia:</span>
            <span className="font-bold text-green-400">{distance} km</span>
          </div>
        </div>

        {waypoints.length > 0 && (
          <button
            onClick={handleClear}
            className="mt-3 w-full py-2 bg-red-500 hover:bg-red-600 text-white text-xs rounded transition-colors"
          >
            Limpiar Todo
          </button>
        )}

        <div className="mt-3 pt-3 border-t border-gray-700">
          <p className="text-xs text-gray-400 leading-relaxed">
            💡 <strong>Click en el mapa</strong> para añadir puntos de paso
          </p>
        </div>
      </div>

      {/* Lista de waypoints (opcional, en la parte inferior) */}
      {waypoints.length > 0 && (
        <div className="absolute bottom-4 left-4 bg-gray-800/95 backdrop-blur-sm p-3 rounded-lg shadow-xl z-[1000] max-w-[250px]">
          <h4 className="text-white font-bold mb-2 text-xs">Puntos de Ruta</h4>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {waypoints.map((wp, index) => (
              <div key={wp.id} className="flex items-center justify-between text-xs bg-gray-700 p-2 rounded">
                <span className="text-gray-300">
                  {index + 1}. {wp.name}
                </span>
                <button
                  onClick={() => handleRemoveWaypoint(wp.id)}
                  className="text-red-400 hover:text-red-300 ml-2"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}