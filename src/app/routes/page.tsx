// src/app/routes/page.tsx
import { fetchAllRoutes } from '@/services/routeService';
import RouteCard from '@/components/cards/RouteCard';
import Link from 'next/link';
import { Suspense } from 'react';
import FilterButton from './FilterButton';
import RetryButton from './RetryButton';

// Asegurar que los estilos de Leaflet se carguen
import 'leaflet/dist/leaflet.css';

import 'leaflet/dist/leaflet.css';

// Componente de carga
function RoutesSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="bg-gray-800 p-4 rounded-lg shadow-xl animate-pulse">
          <div className="h-6 bg-gray-700 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-700 rounded w-full mb-1"></div>
          <div className="h-4 bg-gray-700 rounded w-5/6"></div>
          <div className="mt-3 space-y-2">
            <div className="h-3 bg-gray-700 rounded w-1/2"></div>
            <div className="h-3 bg-gray-700 rounded w-2/3"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Componente de contenido
async function RoutesContent({ difficulty }: { difficulty?: string }) {
  try {
    const routes = await fetchAllRoutes({ difficulty });

    if (routes.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="text-6xl mb-4">🏍️</div>
          <h2 className="text-2xl font-bold text-white mb-2">
            No hay rutas disponibles
          </h2>
          <p className="text-gray-400 mb-6">
            Sé el primero en compartir una ruta épica
          </p>
          <Link 
            href="/routes/create" 
            className="py-2 px-6 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
          >
            Crear Primera Ruta
          </Link>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {routes.map(route => (
          <RouteCard key={route.id} route={route} />
        ))}
      </div>
    );
  } catch (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-red-400 mb-2">
          Error al cargar las rutas
        </h2>
        <p className="text-gray-400 mb-6">
          Por favor, intenta nuevamente más tarde
        </p>
        <button 
          onClick={() => window.location.reload()} 
          className="py-2 px-6 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
        >
          Reintentar
        </button>
      </div>
    );
  }
}

// Componente principal (Server Component)
export default async function RoutesPage({
  searchParams,
}: {
  searchParams: Promise<{ difficulty?: string }>;
}) {
  // Unwrap la Promise de searchParams
  const params = await searchParams;
  
  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-blue-400">Rutas Compartidas 🌎</h1>
          <p className="text-gray-400 text-sm mt-1">
            Descubre y comparte las mejores rutas moteras
          </p>
        </div>
        
        <div className="flex gap-3 items-center">
          {/* Filtro por dificultad */}
          <FilterButton currentDifficulty={params.difficulty} />

          <Link 
            href="/routes/create" 
            className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium whitespace-nowrap"
          >
            + Crear Ruta
          </Link>
        </div>
      </div>

      <Suspense fallback={<RoutesSkeleton />}>
        <RoutesContent difficulty={params.difficulty} />
      </Suspense>
    </div>
  );
}