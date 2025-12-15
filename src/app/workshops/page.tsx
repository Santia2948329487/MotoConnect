// src/app/workshops/page.tsx
'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Loader2, ArrowLeft } from 'lucide-react'; 
import Link from 'next/link';

// Importar el mapa dinámicamente
const WorkshopsMap = dynamic(
  () => import('@/components/WorkshopsMap'),
  { 
    ssr: false,
    loading: () => (
      <div className="h-full w-full bg-neutral-900 rounded-lg flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
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
    <div className="p-4 bg-neutral-950 min-h-screen">
      
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        
        {/* MODIFICACIÓN: Aumento el espaciado de gap-4 a gap-6 */}
        <div className="flex items-center gap-6">
          
          {/* BOTÓN DE ATRÁS */}
          <Link href="/dashboard">
            <button className="p-2 bg-neutral-800 hover:bg-red-600 text-white rounded-lg transition-colors border border-neutral-700 hover:border-red-600">
              <ArrowLeft className="w-5 h-5" />
            </button>
          </Link>
          
          <div>
            <h1 className="text-3xl font-bold text-red-500 mb-2">
              Mapa de Talleres Moteros 🛠️
            </h1>
            <p className="text-neutral-400 text-sm">
              Encuentra talleres mecánicos cerca de ti
            </p>
          </div>
        </div>
        {/* FIN - Contenedor para el botón de atrás y el título */}


        {/* BOTÓN CREAR TALLER */}
        <Link href="/workshops/new">
          <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md font-semibold transition-colors">
            + Crear Taller
          </button>
        </Link>
      </div>

      {loading && (
        <div className="h-[calc(100vh-200px)] bg-neutral-900 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-red-600 animate-spin mx-auto mb-4" />
            <p className="text-neutral-400">Cargando talleres...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="h-[calc(100vh-200px)] bg-neutral-900 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
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
            <div className="bg-neutral-900 p-4 rounded-lg">
              <p className="text-neutral-400 text-sm">Talleres Registrados</p>
              <p className="text-2xl font-bold text-white">{workshops.length}</p>
            </div>
            <div className="bg-neutral-900 p-4 rounded-lg">
              <p className="text-neutral-400 text-sm">Con Ubicación</p>
              <p className="text-2xl font-bold text-red-500">
                {workshops.filter(w => w.latitude && w.longitude).length}
              </p>
            </div>
            <div className="bg-neutral-900 p-4 rounded-lg">
              <p className="text-neutral-400 text-sm">Zona</p>
              <p className="text-2xl font-bold text-red-500">Medellín</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}