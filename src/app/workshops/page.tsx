// src/app/workshops/page.tsx
'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

// Importar el mapa dinámicamente
const WorkshopsMap = dynamic(
  () => import('@/components/WorkshopsMap'),
  { 
    ssr: false,
    loading: () => (
      <div className="h-full w-full bg-gray-800 rounded-lg flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
      </div>
    )
  }
);

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

export default function WorkshopsPage() {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchWorkshops() {
      try {
        const response = await fetch('/api/workshops');
        
        if (!response.ok) {
          throw new Error('Error al cargar talleres');
        }

        const result = await response.json();
        
        if (result.success && result.data) {
          setWorkshops(result.data);
        }
      } catch (err) {
        console.error('Error fetching workshops:', err);
        setError('Error al cargar los talleres');
      } finally {
        setLoading(false);
      }
    }

    fetchWorkshops();
  }, []);

  return (
    <div className="p-4 bg-gray-900 min-h-screen">
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-blue-400 mb-2">
          Mapa de Talleres Moteros 🛠️
        </h1>
        <p className="text-gray-400 text-sm">
          Encuentra talleres mecánicos cerca de ti
        </p>
      </div>

      {loading && (
        <div className="h-[calc(100vh-200px)] bg-gray-800 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-blue-400 animate-spin mx-auto mb-4" />
            <p className="text-gray-400">Cargando talleres...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="h-[calc(100vh-200px)] bg-gray-800 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-400 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
            >
              Reintentar
            </button>
          </div>
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="h-[calc(100vh-200px)] relative">
            <WorkshopsMap 
              workshops={workshops}
              initialCenter={[6.2442, -75.5812]}
              initialZoom={13}
            />
          </div>

          {/* Estadísticas */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-800 p-4 rounded-lg">
              <p className="text-gray-400 text-sm">Talleres Registrados</p>
              <p className="text-2xl font-bold text-white">{workshops.length}</p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <p className="text-gray-400 text-sm">Con Ubicación</p>
              <p className="text-2xl font-bold text-green-400">
                {workshops.filter(w => w.latitude && w.longitude).length}
              </p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <p className="text-gray-400 text-sm">Zona</p>
              <p className="text-2xl font-bold text-blue-400">Medellín</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}