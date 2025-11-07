// src/app/routes/page.tsx
import { fetchAllRoutes } from '@/services/routeService'; 
import RouteCard from '@/components/cards/RouteCard';
import Link from 'next/link';
import { mockRoutes } from '@/lib/mockData'; // Si aún usas mocks
// Añadir mockRoutes a src/lib/mockData.ts
// Ejemplo: export const mockRoutes: Route[] = [...]

export default async function RoutesPage() {
  
  // Opción 1 (Conexión real, ASÍNCRONA): 
  // const routes = await fetchAllRoutes(); 
  
  // Opción 2 (Mientras esperas el backend, usa mockData):
  const routes = mockRoutes; 

  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-400">Rutas Compartidas 🌎</h1>
        <Link href="/routes/create" className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium">
          + Crear Nueva Ruta
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {routes.map(route => (
          <RouteCard key={route.id} route={route} />
        ))}
      </div>
    </div>
  );
}