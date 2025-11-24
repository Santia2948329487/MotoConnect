// src/components/WorkshopsMap.tsx
'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix para los íconos de Leaflet
const WorkshopIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = WorkshopIcon;

interface Workshop {
  id: string;
  name: string;
  latitude: number | null;
  longitude: number | null;
  description?: string | null;
  address?: string | null;
  phone?: string | null;
  services?: string | null;
}

interface WorkshopsMapProps {
  workshops: Workshop[];
  initialCenter?: [number, number];
  initialZoom?: number;
}

export default function WorkshopsMap({
  workshops,
  initialCenter = [6.2442, -75.5812], // Medellín por defecto
  initialZoom = 13
}: WorkshopsMapProps) {
  // Filtrar talleres que tengan coordenadas válidas
  const validWorkshops = workshops.filter(
    w => w.latitude !== null && w.longitude !== null
  );

  return (
    <div className="h-full w-full">
      <MapContainer
        center={initialCenter}
        zoom={initialZoom}
        scrollWheelZoom={true}
        className="h-full w-full rounded-lg"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {validWorkshops.map(workshop => (
          <Marker
            key={workshop.id}
            position={[workshop.latitude!, workshop.longitude!]}
          >
            <Popup>
              <div className="p-2 min-w-[200px]">
                <h3 className="font-bold text-lg text-blue-600 mb-2">
                  {workshop.name}
                </h3>
                
                {workshop.description && (
                  <p className="text-sm text-gray-700 mb-2">
                    {workshop.description}
                  </p>
                )}
                
                {workshop.address && (
                  <p className="text-xs text-gray-600 mb-1">
                    📍 {workshop.address}
                  </p>
                )}
                
                {workshop.phone && (
                  <p className="text-xs text-gray-600 mb-1">
                    📞 {workshop.phone}
                  </p>
                )}
                
                {workshop.services && (
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <p className="text-xs font-semibold text-gray-700 mb-1">
                      Servicios:
                    </p>
                    <p className="text-xs text-gray-600">
                      {workshop.services}
                    </p>
                  </div>
                )}
                
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${workshop.latitude},${workshop.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 block text-center bg-blue-500 hover:bg-blue-600 text-white text-xs py-2 px-3 rounded transition-colors"
                >
                  Cómo llegar
                </a>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {validWorkshops.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80 rounded-lg">
          <p className="text-white text-lg">
            No hay talleres con coordenadas disponibles
          </p>
        </div>
      )}
    </div>
  );
}