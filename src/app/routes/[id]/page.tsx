// src/app/routes/[id]/page.tsx
import { getMockRouteById } from '@/lib/mockData';
import MapDisplay from '@/components/MapDisplay'; // Asume que ya existe
import Link from 'next/link';

// Componente principal que recibe el ID de la ruta de la URL
interface RoutePageProps {
  params: {
    id: string;
  };
}

export default function RouteDetailPage({ params }: RoutePageProps) {
  // Simulación: Llama a la función mock con el ID
  // Cuando el Backend esté listo, esto será: const route = await fetchRoute(params.id);
  const route = getMockRouteById(params.id);

  if (!route) {
    // Manejo de error o ruta no encontrada
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 p-8">
        <div className="text-center text-red-400">
          <h1 className="text-4xl font-bold mb-4">Ruta no Encontrada 😟</h1>
          <p className="text-lg">El identificador **{params.id}** no existe.</p>
          <Link href="/routes" className="mt-6 inline-block py-2 px-4 bg-blue-600 rounded-md text-white hover:bg-blue-700 transition-colors">
            Volver a Rutas
          </Link>
        </div>
      </div>
    );
  }

  // --- Renderización de la Ruta ---

  // Datos mock de coordenadas para el mapa (simulando una ruta)
  const routePointsMock = [
    { id: 'start', name: 'Inicio', latitude: 6.25, longitude: -75.58 },
    { id: 'end', name: 'Destino', latitude: 6.15, longitude: -75.65 },
  ];
  
  // Función de ayuda para formatear fecha
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="bg-gray-900 min-h-screen pt-4 md:pt-8 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Encabezado Principal */}
        <h1 className="text-4xl font-extrabold text-white mb-2">{route.title}</h1>
        <div className="flex items-center space-x-4 text-sm text-gray-400 mb-6">
          <span>Por <span className="font-semibold text-blue-400">{route.authorName}</span></span>
          <span>•</span>
          <span>Publicado: {formatDate(route.createdAt)}</span>
          <span>•</span>
          <span>Vistas: {route.views}</span>
        </div>

        {/* Sección de Mapa y Datos */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Columna Izquierda: Mapa (2/3 de ancho) */}
          <div className="lg:col-span-2 bg-gray-800 rounded-xl shadow-2xl overflow-hidden h-[500px]">
            {/* Aquí usarías un componente más avanzado que dibuje el trayecto, no solo marcadores */}
            <div className="w-full h-full flex items-center justify-center text-gray-400">
                [ Componente Mapa de Ruta - Muestra el Trazo Completo ]
                {/* <MapDisplay locations={routePointsMock} initialCenter={[6.2, -75.6]} zoom={11} /> */}
            </div>
          </div>
          
          {/* Columna Derecha: Estadísticas (1/3 de ancho) */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-semibold text-white mb-3">Estadísticas Clave</h3>
              <StatItem label="Distancia Total" value={`${route.distanceKm} km`} icon="📏" />
              <StatItem label="Dificultad" value={route.difficulty} icon="🚧" difficulty={route.difficulty} />
              <StatItem label="Tiempo Estimado" value="10-12 Horas" icon="⏱️" /> 
            </div>
            
            <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-semibold text-white mb-3">Acciones</h3>
              <button className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md mb-2">
                Guardar Ruta
              </button>
              <button className="w-full py-2 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-md">
                Comenzar Navegación (Simulación)
              </button>
            </div>
          </div>
        </div>

        {/* Sección de Descripción */}
        <div className="mt-8 p-6 bg-gray-800 rounded-xl shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-3">Sobre la Ruta</h2>
          <p className="text-gray-300 whitespace-pre-line">{route.description}</p>
        </div>

        {/* Sección de Interacción Social (Requisito Social) */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-white mb-4">Comentarios y Experiencias (15)</h2>
          
          {/* Formulario de Comentarios */}
          <div className="bg-gray-800 p-4 rounded-lg mb-6">
              <TextArea id="comment" label="" placeholder="Comparte tu experiencia o pregunta sobre la ruta..." />
              <button className="mt-2 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium">
                  Publicar Comentario
              </button>
          </div>

          {/* Feed de Comentarios Mock */}
          <div className="space-y-4">
              <CommentMock author="Juan R." text="Hice esta ruta el mes pasado, ¡el tramo final es brutal! Muy recomendada." />
              <CommentMock author="Ana Motera" text="¿Es seguro para una moto de baja cilindrada?" />
          </div>
        </div>
        
      </div>
    </div>
  );
}

// Componente auxiliar para las estadísticas
const StatItem = ({ label, value, icon, difficulty }: { label: string; value: string; icon: string; difficulty?: string }) => {
    let colorClass = 'text-white';
    if (difficulty === 'Fácil') colorClass = 'text-green-400';
    if (difficulty === 'Media') colorClass = 'text-yellow-400';
    if (difficulty === 'Difícil') colorClass = 'text-red-400';

    return (
        <div className="flex justify-between items-center py-2 border-b border-gray-700 last:border-b-0">
            <span className="text-gray-400 flex items-center">{icon} <span className="ml-2">{label}</span></span>
            <span className={`font-semibold ${colorClass}`}>{value}</span>
        </div>
    );
};

// Componente auxiliar para comentarios
const TextArea = ({ id, label, placeholder }: { id: string; label?: string; placeholder?: string }) => (
    <div>
        {label ? <label htmlFor={id} className="text-sm text-gray-400 mb-1 block">{label}</label> : null}
        <textarea
            id={id}
            placeholder={placeholder}
            className="w-full mt-1 p-2 bg-gray-900 border border-gray-700 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
        />
    </div>
);

const CommentMock = ({ author, text }: { author: string; text: string }) => (
    <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
        <p className="text-sm font-semibold text-blue-400">{author}</p>
        <p className="text-gray-300 mt-1">{text}</p>
    </div>
);