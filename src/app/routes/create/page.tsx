// src/app/routes/create/page.tsx
'use client'; 

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/Input';
import TextArea from '@/components/ui/TextArea';
import { createRoute } from '@/services/routeService';
import { Loader2 } from 'lucide-react';

export default function CreateRoutePage() {
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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

            {/* Campo de Distancia */}
            <Input 
              id="distanceKm" 
              label="Distancia (kilómetros)" 
              type="number" 
              placeholder="Ej: 150" 
              min="1"
              step="0.1"
              value={formData.distanceKm || ''}
              onChange={(e) => setFormData({ 
                ...formData, 
                distanceKm: parseFloat(e.target.value) || 0 
              })}
              required
              disabled={loading}
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
          <h2 className="text-xl font-semibold text-white mb-4">Vista Previa</h2>
          
          <div className="flex-grow h-96 md:h-full bg-gray-700 rounded-md flex flex-col items-center justify-center text-gray-400 p-6">
            {formData.image ? (
              <img 
                src={formData.image} 
                alt="Vista previa" 
                className="max-w-full max-h-full object-contain rounded-md"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : (
              <>
                <svg className="w-24 h-24 mb-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
                <p className="text-center">
                  Agrega una URL de imagen para ver la vista previa
                </p>
              </>
            )}
          </div>
          
          <div className="mt-4 space-y-2 text-sm">
            <p className="text-gray-400">
              📏 Distancia: <span className="font-semibold text-white">
                {formData.distanceKm > 0 ? `${formData.distanceKm} km` : 'No especificada'}
              </span>
            </p>
            <p className="text-gray-400">
              🚧 Dificultad: <span className={`font-semibold ${
                formData.difficulty === 'Fácil' ? 'text-green-400' :
                formData.difficulty === 'Media' ? 'text-yellow-400' :
                'text-red-400'
              }`}>
                {formData.difficulty}
              </span>
            </p>
            {formData.startPoint && (
              <p className="text-gray-400">
                📍 Inicio: <span className="font-semibold text-white">{formData.startPoint}</span>
              </p>
            )}
            {formData.endPoint && (
              <p className="text-gray-400">
                🏁 Fin: <span className="font-semibold text-white">{formData.endPoint}</span>
              </p>
            )}
          </div>
        </div>
        
      </div>
    </div>
  );
}