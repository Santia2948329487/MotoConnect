// src/components/MapDisplay.tsx
'use client'; 
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Workshop } from '@/types/workshop';
import L from 'leaflet';

// --- ARREGLO PARA ÍCONOS DE LEAFLET ---
// (Leaflet y React no se llevan bien con los íconos por defecto)
// Descarga 'marker-icon.png' y 'marker-shadow.png' de Leaflet y ponlos en tu carpeta /public
const DefaultIcon = L.icon({
  iconUrl: '/marker-icon.png', 
  shadowUrl: '/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;
// --- FIN DEL ARREGLO ---

interface MapDisplayProps {
  locations: Workshop[];
  initialCenter: [number, number];
  zoom: number;
}

// *** LA CLAVE ES ESTE EXPORT DEFAULT ***
export default function MapDisplay({ locations, initialCenter, zoom }: MapDisplayProps) {
  return (
    <div className="h-[calc(100vh-64px)] w-full relative">
        <MapContainer 
            center={initialCenter} 
            zoom={zoom} 
            scrollWheelZoom={true}
            className="h-full w-full rounded-lg shadow-lg"
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {locations.map(loc => (
                <Marker key={loc.id} position={[loc.latitude, loc.longitude]}>
                    <Popup>
                        <h3 className="font-bold text-lg text-blue-500">{loc.name}</h3>
                        <p className="text-sm">{loc.address}</p>
                        <p className="text-xs">⭐️ {loc.rating} / 5</p>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    </div>
  );
}