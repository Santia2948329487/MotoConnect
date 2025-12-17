'use client';

import dynamic from 'next/dynamic';
import { MapPin } from 'lucide-react';

type Waypoint = { lat: number; lng: number; name?: string };

// ✅ Aquí SÍ podemos usar ssr: false porque estamos en un Client Component
const RouteMapView = dynamic(() => import('@/components/RouteMapView'), {
  ssr: false,
  loading: () => (
    <div className="h-[500px] rounded-xl bg-neutral-900 border-2 border-neutral-800 flex items-center justify-center">
      <div className="text-center">
        <MapPin className="w-12 h-12 text-neutral-600 mx-auto mb-2 animate-pulse" />
        <p className="text-neutral-400">Cargando mapa...</p>
      </div>
    </div>
  )
});

export default function RouteMapWrapper({ waypoints }: { waypoints: Waypoint[] }) {
  return <RouteMapView waypoints={waypoints} />;
}