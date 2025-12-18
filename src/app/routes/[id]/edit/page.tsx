/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/routes/[id]/edit/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import Input from '@/components/ui/Input';
import TextArea from '@/components/ui/TextArea';
import { fetchRouteById, updateRoute } from '@/services/routeService';
import { Loader2, ArrowLeft, AlertCircle, Save } from 'lucide-react';

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

interface EditRoutePageProps {
  params: Promise<{ id: string }>;
}

export default function EditRoutePage({ params }: EditRoutePageProps) {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useUser();
  
  const [routeId, setRouteId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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

  useEffect(() => {
    const loadRoute = async () => {
      try {
        const resolvedParams = await params;
        setRouteId(resolvedParams.id);
        
        const route = await fetchRouteById(resolvedParams.id);
        
        if (!route) {
          setError('Ruta no encontrada');
          return;
        }

        // Cargar datos del formulario
        setFormData({
          name: route.title,
          description: route.description || '',
          difficulty: route.difficulty,
          distanceKm: route.distanceKm,
          startPoint: '',
          endPoint: '',
          mapUrl: '',
          image: '',
        });

        // Cargar waypoints si existen
        if (route.waypoints && Array.isArray(route.waypoints)) {
          const loadedWaypoints = route.waypoints.map((w: any, i: number) => ({
            id: `waypoint-${i}`,
            lat: w.lat,
            lng: w.lng,
            name: w.name || `Punto ${i + 1}`
          }));
          setWaypoints(loadedWaypoints);
        }

      } catch (err) {
        console.error('Error cargando ruta:', err);
        setError('Error al cargar la ruta');
      } finally {
        setLoading(false);
      }
    };

    loadRoute();
  }, [params]);

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
    setSaving(true);

    try {
      if (!isSignedIn) {
        throw new Error('Debes iniciar sesión para editar una ruta');
      }

      if (!formData.name.trim()) {
        throw new Error('El título es obligatorio');
      }

      if (waypoints.length < 2) {
        throw new Error('Debes marcar al menos 2 puntos en el mapa');
      }

      console.log('📤 Actualizando ruta:', routeId);

      await updateRoute(routeId, {
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

      console.log('✅ Ruta actualizada exitosamente');

      // Redirigir a la página de detalle
      router.push(`/routes/${routeId}`);
      
    } catch (err: any) {
      console.error('❌ Error al actualizar ruta:', err);
      setError(err.message || '❌ Error al actualizar la ruta. Por favor, intenta nuevamente.');
    } finally {
      setSaving(false);
    }
  };

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-red-500 animate-spin mx-auto mb-4" />
          <p className="text-neutral-400">Cargando ruta...</p>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-white mb-4">Autenticación Requerida</h1>
          <p className="text-neutral-400 mb-6">Debes iniciar sesión para editar rutas</p>
          <Link href="/sign-in">
            <button className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors">
              Iniciar Sesión
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-10 bg-neutral-950 min-h-screen text-white">
      
      <div className="flex items-center gap-4 mb-6">
        <Link href={`/routes/${routeId}`}>
          <button className="p-3 bg-neutral-800 hover:bg-red-600 text-white rounded-lg transition-colors border border-neutral-700 hover:border-red-600 flex-shrink-0">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </Link>
        
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            ✏️ Editar Ruta
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Actualiza la información y waypoints de tu ruta
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-900/40 border border-red-600 rounded-lg text-red-400 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div className="flex-1">{error}</div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        
        <div className="lg:col-span-2 bg-neutral-900 border border-neutral-800 p-6 rounded-xl shadow-2xl h-fit">
          <h2 className="text-2xl font-semibold text-white mb-4 border-b border-neutral-800 pb-2">
            Información de la Ruta
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <Input 
              id="name" 
              label="Título de la Ruta" 
              type="text" 
              placeholder="Ej: Vuelta a la Laguna de Guatavita" 
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required 
              disabled={saving}
              className="bg-neutral-800 border-neutral-700 placeholder:text-neutral-500 text-white focus:ring-red-600 focus:border-red-600"
            />

            <TextArea
              id="description"
              label="Descripción detallada"
              placeholder="Cuenta qué hace especial a esta ruta..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              disabled={saving}
              className="bg-neutral-800 border-neutral-700 placeholder:text-neutral-500 text-white focus:ring-red-600 focus:border-red-600"
            />
            
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
                disabled={saving}
              >
                <option value="Fácil">Fácil (Para principiantes, solo asfalto)</option>
                <option value="Media">Media (Algo de tierra o curvas exigentes)</option>
                <option value="Difícil">Difícil (Terreno off-road, mucha técnica)</option>
              </select>
            </div>

            <Input 
              id="distanceKm" 
              label="Distancia (kilómetros)" 
              type="number" 
              placeholder="Calculado automáticamente" 
              value={formData.distanceKm || ''}
              readOnly
              disabled
              className="bg-neutral-700 cursor-not-allowed border-neutral-700 placeholder:text-neutral-500 text-white"
            />

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => router.push(`/routes/${routeId}`)}
                disabled={saving}
                className="flex-1 py-3 text-lg font-semibold text-white bg-neutral-800 rounded-md hover:bg-neutral-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancelar
              </button>
              
              <button
                type="submit"
                disabled={saving}
                className="flex-1 py-3 text-lg font-semibold text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Guardar Cambios
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        <div className="lg:col-span-3 bg-neutral-900 border border-neutral-800 p-6 rounded-xl shadow-2xl flex flex-col">
          <h2 className="text-2xl font-semibold text-white mb-4 border-b border-neutral-800 pb-2">
            Edita los Waypoints en el Mapa
          </h2>
          
          <div className="flex-grow h-[500px] lg:h-[700px] rounded-md overflow-hidden border border-red-900/50">
            <InteractiveRouteMap 
              onRouteChange={handleRouteChange}
              initialCenter={waypoints.length > 0 ? [waypoints[0].lat, waypoints[0].lng] : [6.2442, -75.5812]}
              initialZoom={12}
             // initialWaypoints={waypoints}
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