// src/app/routes/page.tsx
import { fetchAllRoutes } from '@/services/routeService';
import RouteCard from '@/components/cards/RouteCard';
import Link from 'next/link';
import { Suspense } from 'react';
import FilterButton from './FilterButton';
import { Plus, MapPin } from 'lucide-react';

// Asegurar que los estilos de Leaflet se carguen
import 'leaflet/dist/leaflet.css';

import 'leaflet/dist/leaflet.css';


// Componente de carga
function RoutesSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="bg-neutral-900 border-2 border-neutral-800 rounded-xl p-4 animate-pulse">
          <div className="h-6 bg-neutral-800 rounded w-3/4 mb-3"></div>
          <div className="h-4 bg-neutral-800 rounded w-full mb-2"></div>
          <div className="h-4 bg-neutral-800 rounded w-5/6 mb-4"></div>
          <div className="space-y-2">
            <div className="h-3 bg-neutral-800 rounded w-1/2"></div>
            <div className="h-3 bg-neutral-800 rounded w-2/3"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Componente para cuando no hay rutas
function NoRoutesContent() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-20 h-20 bg-neutral-900 border-2 border-neutral-800 rounded-full flex items-center justify-center mb-6">
        <MapPin className="w-10 h-10 text-neutral-600" />
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">
        No hay rutas disponibles
      </h2>
      <p className="text-neutral-400 mb-6">
        Sé el primero en compartir una ruta épica
      </p>
      <Link 
        href="/routes/create" 
        className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
      >
        <Plus className="w-5 h-5" />
        Crear Primera Ruta
      </Link>
    </div>
  );
}

// Componente de contenido
async function RoutesContent({ difficulty }: { difficulty?: string }) {
  const routes = await fetchAllRoutes({ difficulty });

  if (routes.length === 0) {
    return <NoRoutesContent />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {routes.map(route => (
        <RouteCard key={route.id} route={route} />
      ))}
    </div>
  );
}

// Componente principal
export default async function RoutesPage({
  searchParams,
}: {
  searchParams: Promise<{ difficulty?: string }>;
}) {
  const params = await searchParams;
  
  return (
    <div className="min-h-screen bg-neutral-950 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-black text-white mb-2">Rutas Compartidas 🌎</h1>
            <p className="text-neutral-400">
              Descubre y comparte las mejores rutas moteras
            </p>
          </div>
          
          <div className="flex gap-3 items-center">
            <FilterButton currentDifficulty={params.difficulty} />

            <Link 
              href="/routes/create" 
              className="px-6 py-3 bg-red-600 hover:bg-red-700 border-2 border-red-600 text-white rounded-lg font-semibold transition-all hover:scale-105 whitespace-nowrap flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Crear Ruta
            </Link>
          </div>
        </div>

        <Suspense fallback={<RoutesSkeleton />}>
          <RoutesContent difficulty={params.difficulty} />
        </Suspense>
      </div>
    </div>
  );
}