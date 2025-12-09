/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/routes/create/page.tsx
'use client'; 

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import Input from '@/components/ui/Input';
import TextArea from '@/components/ui/TextArea';
import { createRoute } from '@/services/routeService';
import { Loader2 } from 'lucide-react';

// Importar el mapa dinámicamente (solo en cliente)
const InteractiveRouteMap = dynamic(
  () => import('@/components/InteractiveRouteMap'),
  { ssr: false }
);

interface Waypoint {
  id: string;
  lat: number;
  lng: number;
  name: string;
}

export default function CreateRoutePage() {
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [waypoints, setWaypoints] = useState<Waypoint[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    difficulty: 'Media' as 'Fácil' | 'Media' | 'Difícil',
    distanceKm: 0,
    startPoint: '',
    endPoint: '',
    mapUrl: '',
    image: '',
  });

  const handleRouteChange = (newWaypoints: Waypoint[], distance: number) => {
    setWaypoints(newWaypoints);
    setFormData(prev => ({ 
      ...prev, 
      distanceKm: distance,
      startPoint: newWaypoints[0]?.name || '',
      endPoint: newWaypoints[newWaypoints.length - 1]?.name || ''
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Validación básica
      if (!formData.name.trim()) {
        throw new Error('El título es obligatorio');
      }
      if (formData.distanceKm <= 0) {
        throw new Error('La distancia debe ser mayor a 0');
      }

      // Crear la ruta
      const newRoute = await createRoute({
        name: formData.name,
        description: formData.description || undefined,
        distanceKm: formData.distanceKm,
        difficulty: formData.difficulty,
        startPoint: formData.startPoint || undefined,
        endPoint: formData.endPoint || undefined,
        mapUrl: formData.mapUrl || undefined,
        image: formData.image || undefined,
      });

      // Redirigir a la página de detalle de la ruta
      router.push(`/routes/${newRoute.id}`);
      
    } catch (err: any) {
      console.error('Error al crear ruta:', err);
      setError(err.message || 'Error al crear la ruta. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold text-blue-400 mb-6">
        🏍️ Diseña Tu Nueva Ruta
      </h1>

      {/* Mensaje de error */}
      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400">
          {error}
        </div>
      )}

      {/* Contenedor principal: Formulario + Mapa */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Columna 1: Formulario de Datos */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-xl h-fit">
          <h2 className="text-xl font-semibold text-white mb-4">Información de la Ruta</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <Input 
              id="name" 
              label="Título de la Ruta" 
              type="text" 
              placeholder="Ej: Vuelta a la Laguna de Guatavita" 
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required 
              disabled={loading}
            />

            <TextArea
              id="description"
              label="Descripción detallada"
              placeholder="Cuenta qué hace especial a esta ruta, el tipo de terreno, mejores paradas, etc."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              disabled={loading}
            />
            
            {/* Campo Select para Dificultad */}
            <div className="flex flex-col space-y-2 w-full">
              <label htmlFor="difficulty" className="text-sm font-medium text-gray-400">
                Dificultad
              </label>
              <select
                id="difficulty"
                className="flex h-10 w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white disabled:opacity-50"
                value={formData.difficulty}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  difficulty: e.target.value as 'Fácil' | 'Media' | 'Difícil' 
                })}
                required
                disabled={loading}
              >
                <option value="Fácil">Fácil (Para principiantes, solo asfalto)</option>
                <option value="Media">Media (Algo de tierra o curvas exigentes)</option>
                <option value="Difícil">Difícil (Terreno off-road, mucha técnica)</option>
              </select>
            </div>

            {/* Campo de Distancia (ahora readonly, calculado por el mapa) */}
            <Input 
              id="distanceKm" 
              label="Distancia (kilómetros)" 
              type="number" 
              placeholder="Calculado automáticamente" 
              value={formData.distanceKm || ''}
              readOnly
              disabled
              className="bg-gray-700 cursor-not-allowed"
            />

            {/* Punto de Inicio */}
            <Input 
              id="startPoint" 
              label="Punto de Inicio (Opcional)" 
              type="text" 
              placeholder="Ej: Medellín, Antioquia" 
              value={formData.startPoint}
              onChange={(e) => setFormData({ ...formData, startPoint: e.target.value })}
              disabled={loading}
            />

            {/* Punto Final */}
            <Input 
              id="endPoint" 
              label="Punto Final (Opcional)" 
              type="text" 
              placeholder="Ej: Guatapé, Antioquia" 
              value={formData.endPoint}
              onChange={(e) => setFormData({ ...formData, endPoint: e.target.value })}
              disabled={loading}
            />

            {/* URL del Mapa */}
            <Input 
              id="mapUrl" 
              label="Enlace de Google Maps (Opcional)" 
              type="url" 
              placeholder="https://maps.google.com/..." 
              value={formData.mapUrl}
              onChange={(e) => setFormData({ ...formData, mapUrl: e.target.value })}
              disabled={loading}
            />

            {/* URL de Imagen */}
            <Input 
              id="image" 
              label="URL de Imagen (Opcional)" 
              type="url" 
              placeholder="https://ejemplo.com/imagen.jpg" 
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              disabled={loading}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 text-lg font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors mt-6 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Guardando...
                </>
              ) : (
                'Guardar y Publicar Ruta'
              )}
            </button>
          </form>
        </div>

        {/* Columna 2: Mapa Interactivo */}
        <div className="bg-gray-800 p-4 rounded-lg shadow-xl flex flex-col">
          <h2 className="text-xl font-semibold text-white mb-4">Diseña tu Ruta en el Mapa</h2>
          
          {/* Mapa Interactivo de Leaflet */}
          <div className="flex-grow h-96 md:h-full rounded-md overflow-hidden">
            <InteractiveRouteMap 
              onRouteChange={handleRouteChange}
              initialCenter={[6.2442, -75.5812]}
              initialZoom={12}
            />
          </div>
          
          <div className="mt-4 space-y-2 text-sm bg-gray-700/50 p-3 rounded-md">
            <p className="text-gray-300">
              📏 <strong>Distancia calculada:</strong>{' '}
              <span className="text-green-400 font-bold">
                {formData.distanceKm > 0 ? `${formData.distanceKm} km` : 'Añade puntos al mapa'}
              </span>
            </p>
            <p className="text-gray-300">
              📍 <strong>Puntos marcados:</strong>{' '}
              <span className="text-blue-400 font-bold">{waypoints.length}</span>
            </p>
          </div>
        </div>
        
      </div>
    </div>
  );
}