// src/app/routes/create/page.tsx
'use client'; 

import Input from '@/components/ui/Input';
import TextArea from '@/components/ui/TextArea';
// Importa el componente del mapa que creamos antes
// import MapDisplay from '@/components/MapDisplay'; 

export default function CreateRoutePage() {
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Aquí iría la lógica final de envío de datos
    // 1. Recoger datos del formulario (título, descripción, dificultad)
    // 2. Recoger datos del mapa (waypoints/coordenadas)
    // 3. Llamar al API de tu compañero: fetch('/api/routes', { method: 'POST', body: data })
    console.log("Datos listos para enviar al Backend...");
  };

  return (
    <div className="p-4 md:p-8 bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold text-blue-400 mb-6">
        🏍️ Diseña Tu Nueva Ruta
      </h1>

      {/* Contenedor principal: Formulario + Mapa */}
      {/* En mobile (sm), usa una sola columna. En tablet/desktop (md), usa dos columnas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Columna 1: Formulario de Datos */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-xl h-fit">
          <h2 className="text-xl font-semibold text-white mb-4">Información de la Ruta</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <Input 
              id="title" 
              label="Título de la Ruta" 
              type="text" 
              placeholder="Ej: Vuelta a la Laguna de Guatavita" 
              required 
            />

            <TextArea
              id="description"
              label="Descripción detallada"
              placeholder="Cuenta qué hace especial a esta ruta, el tipo de terreno, mejores paradas, etc."
              required
            />
            
            {/* Campo Select para Dificultad */}
            <div className="flex flex-col space-y-2 w-full">
              <label htmlFor="difficulty" className="text-sm font-medium text-gray-400">
                Dificultad
              </label>
              <select
                id="difficulty"
                className="flex h-10 w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white"
                defaultValue="Media"
                required
              >
                <option value="Fácil">Fácil (Para principiantes, solo asfalto)</option>
                <option value="Media">Media (Algo de tierra o curvas exigentes)</option>
                <option value="Difícil">Difícil (Terreno off-road, mucha técnica)</option>
              </select>
            </div>
            
            {/* Campo Opcional */}
             <Input 
              id="stops" 
              label="Puntos de Interés / Paradas (Opcional)" 
              type="text" 
              placeholder="Ej: Gasolinera, mirador La Calera" 
            />

            <button
              type="submit"
              className="w-full py-2 text-lg font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors mt-6"
            >
              Guardar y Publicar Ruta
            </button>
          </form>
        </div>

        {/* Columna 2: Mapa Interactivo para Diseñar la Ruta */}
        <div className="bg-gray-800 p-4 rounded-lg shadow-xl flex flex-col">
          <h2 className="text-xl font-semibold text-white mb-4">Traza la Ruta en el Mapa</h2>
          
          {/* El mapa debería ser un componente interactivo que permita al usuario hacer click 
              para marcar el punto de inicio, waypoints y punto final. */}
          <div className="flex-grow h-96 md:h-full bg-gray-700 rounded-md flex items-center justify-center text-gray-400">
             [ Aquí va el componente **InteractiveMap** de Leaflet ]
          </div>
          
          <p className="mt-3 text-sm text-gray-400">
              *Hacer click en el mapa para añadir un punto de paso. El mapa calculará la distancia.
          </p>
        </div>
        
      </div>
    </div>
  );
}