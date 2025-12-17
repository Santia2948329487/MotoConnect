/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/routes/create/page.tsx
'use client'; 

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Input from '@/components/ui/Input';
import TextArea from '@/components/ui/TextArea';
import { createRoute } from '@/services/routeService';
import { Loader2, ArrowLeft } from 'lucide-react';

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
        waypoints: waypoints.map(w => ({ lat: w.lat, lng: w.lng, name: w.name })),
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
    // Estilo del contenedor principal similar a LandingPage
    <div className="p-4 md:p-10 bg-neutral-950 min-h-screen text-white">
      
      <div className="flex items-center gap-4 mb-6">
        {/* BOTÓN DE ATRÁS */}
        <Link href="/routes">
          <button className="p-3 bg-neutral-800 hover:bg-red-600 text-white rounded-lg transition-colors border border-neutral-700 hover:border-red-600 flex-shrink-0">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </Link>
        
        {/* Título principal */}
        <h1 className="text-3xl md:text-4xl font-bold text-white">
          🏍️ Diseña Tu Nueva Ruta
        </h1>
      </div>

      {/* Mensaje de error (ajustado al tema) */}
      {error && (
        <div className="mb-6 p-4 bg-red-900/40 border border-red-600 rounded-lg text-red-400">
          {error}
        </div>
      )}

      {/* Contenedor principal: Formulario + Mapa */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        
        {/* Columna 1: Formulario de Datos (ocupa 2/5) */}
        <div className="lg:col-span-2 bg-neutral-900 border border-neutral-800 p-6 rounded-xl shadow-2xl h-fit">
          <h2 className="text-2xl font-semibold text-white mb-4 border-b border-neutral-800 pb-2">Información de la Ruta</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Componente Input con estilos ajustados para el tema */}
            <Input 
              id="name" 
              label="Título de la Ruta" 
              type="text" 
              placeholder="Ej: Vuelta a la Laguna de Guatavita" 
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required 
              disabled={loading}
              className="bg-neutral-800 border-neutral-700 placeholder:text-neutral-500 text-white focus:ring-red-600 focus:border-red-600"
              // labelClassName="text-neutral-300" // <--- ELIMINADO
            />

            {/* Componente TextArea con estilos ajustados para el tema */}
            <TextArea
              id="description"
              label="Descripción detallada"
              placeholder="Cuenta qué hace especial a esta ruta, el tipo de terreno, mejores paradas, etc."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              disabled={loading}
              className="bg-neutral-800 border-neutral-700 placeholder:text-neutral-500 text-white focus:ring-red-600 focus:border-red-600"
              // labelClassName="text-neutral-300" // <--- ELIMINADO
            />
            
            {/* Campo Select para Dificultad con estilos ajustados */}
            <div className="flex flex-col space-y-2 w-full">
              <label htmlFor="difficulty" className="text-sm font-medium text-neutral-300">
                Dificultad
              </label>
              <select
                id="difficulty"
                className="flex h-10 w-full rounded-md border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-white disabled:opacity-50 focus:ring-red-600 focus:border-red-600 appearance-none cursor-pointer"
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

            {/* Campo de Distancia (readonly) con estilos ajustados */}
            <Input 
              id="distanceKm" 
              label="Distancia (kilómetros)" 
              type="number" 
              placeholder="Calculado automáticamente" 
              value={formData.distanceKm || ''}
              readOnly
              disabled
              className="bg-neutral-700 cursor-not-allowed border-neutral-700 placeholder:text-neutral-500 text-white"
              // labelClassName="text-neutral-300" // <--- ELIMINADO
            />

            {/* Punto de Inicio con estilos ajustados */}
            <Input 
              id="startPoint" 
              label="Punto de Inicio (Opcional)" 
              type="text" 
              placeholder="Ej: Medellín, Antioquia" 
              value={formData.startPoint}
              onChange={(e) => setFormData({ ...formData, startPoint: e.target.value })}
              disabled={loading}
              className="bg-neutral-800 border-neutral-700 placeholder:text-neutral-500 text-white focus:ring-red-600 focus:border-red-600"
              // labelClassName="text-neutral-300" // <--- ELIMINADO
            />

            {/* Punto Final con estilos ajustados */}
            <Input 
              id="endPoint" 
              label="Punto Final (Opcional)" 
              type="text" 
              placeholder="Ej: Guatapé, Antioquia" 
              value={formData.endPoint}
              onChange={(e) => setFormData({ ...formData, endPoint: e.target.value })}
              disabled={loading}
              className="bg-neutral-800 border-neutral-700 placeholder:text-neutral-500 text-white focus:ring-red-600 focus:border-red-600"
              // labelClassName="text-neutral-300" // <--- ELIMINADO
            />

            {/* URL del Mapa con estilos ajustados */}
            <Input 
              id="mapUrl" 
              label="Enlace de Google Maps (Opcional)" 
              type="url" 
              placeholder="https://maps.google.com/..." 
              value={formData.mapUrl}
              onChange={(e) => setFormData({ ...formData, mapUrl: e.target.value })}
              disabled={loading}
              className="bg-neutral-800 border-neutral-700 placeholder:text-neutral-500 text-white focus:ring-red-600 focus:border-red-600"
              // labelClassName="text-neutral-300" // <--- ELIMINADO
            />

            {/* URL de Imagen con estilos ajustados */}
            <Input 
              id="image" 
              label="URL de Imagen (Opcional)" 
              type="url" 
              placeholder="https://ejemplo.com/imagen.jpg" 
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              disabled={loading}
              className="bg-neutral-800 border-neutral-700 placeholder:text-neutral-500 text-white focus:ring-red-600 focus:border-red-600"
              // labelClassName="text-neutral-300" // <--- ELIMINADO
            />

            {/* Botón de Submit con estilo de CTA de LandingPage */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 text-lg font-semibold text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors mt-6 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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

        {/* Columna 2: Mapa Interactivo (ocupa 3/5) */}
        <div className="lg:col-span-3 bg-neutral-900 border border-neutral-800 p-6 rounded-xl shadow-2xl flex flex-col">
          <h2 className="text-2xl font-semibold text-white mb-4 border-b border-neutral-800 pb-2">Diseña tu Ruta en el Mapa</h2>
          
          {/* Mapa Interactivo de Leaflet */}
          {/* Ajustado para ser más alto en pantallas medianas/grandes */}
          <div className="flex-grow h-[500px] lg:h-[700px] rounded-md overflow-hidden border border-red-900/50">
            <InteractiveRouteMap 
              onRouteChange={handleRouteChange}
              initialCenter={[6.2442, -75.5812]}
              initialZoom={12}
            />
          </div>
          
          <div className="mt-4 space-y-2 text-sm bg-neutral-800 p-4 rounded-md border border-neutral-700">
            <p className="text-neutral-300">
              📏 <strong>Distancia calculada:</strong>{' '}
              <span className="text-red-400 font-bold">
                {formData.distanceKm > 0 ? `${formData.distanceKm.toFixed(2)} km` : 'Añade puntos al mapa'}
              </span>
            </p>
            <p className="text-neutral-300">
              📍 <strong>Puntos marcados:</strong>{' '}
              <span className="text-red-400 font-bold">{waypoints.length}</span>
            </p>
          </div>
        </div>
        
      </div>
    </div>
  );
}