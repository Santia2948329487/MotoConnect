// src/app/routes/[id]/page.tsx
import Link from 'next/link';
import RouteReviews from '@/components/RouteReviews';

interface RoutePageProps {
  params: { id: string }; // ← CORREGIDO
}

async function getRoute(id: string) {
  try {
    const baseUrl = process.env.NODE_ENV === 'development' 
      ? 'http://localhost:3000' 
      : process.env.NEXT_PUBLIC_API_URL || 'https://motoconnect.vercel.app';
    
    const response = await fetch(`${baseUrl}/api/routes/${id}`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      return null;
    }
    
    const result = await response.json();
    return result.success ? result.data : null;
  } catch (error) {
    console.error('Error fetching route:', error);
    return null;
  }
}

export default async function RouteDetailPage({ params }: RoutePageProps) {
  const { id } = params; // ← CORREGIDO
  const route = await getRoute(id);

  if (!route) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 p-8">
        <div className="text-center text-red-400">
          <h1 className="text-4xl font-bold mb-4">Ruta no Encontrada 😟</h1>
          <p className="text-lg">El identificador no existe o hubo un error al cargar la ruta.</p>
          <Link href="/routes" className="mt-6 inline-block py-2 px-4 bg-blue-600 rounded-md text-white hover:bg-blue-700 transition-colors">
            Volver a Rutas
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CO', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="bg-gray-900 min-h-screen pt-4 md:pt-8 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <h1 className="text-4xl font-extrabold text-white mb-2">{route.name}</h1>
        <div className="flex items-center space-x-4 text-sm text-gray-400 mb-6">
          <span>Por <span className="font-semibold text-blue-400">{route.creator?.name || 'Anónimo'}</span></span>
          <span>•</span>
          <span>Publicado: {formatDate(route.createdAt)}</span>
          <span>•</span>
          {route.averageRating > 0 && (
            <>
              <span>Rating: ⭐ {route.averageRating.toFixed(1)}</span>
              <span>•</span>
            </>
          )}
          <span>{route.reviewCount} reseñas</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="lg:col-span-2 bg-gray-800 rounded-xl shadow-2xl overflow-hidden h-[500px]">
            {route.image ? (
              <img 
                src={route.image} 
                alt={route.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <p className="text-xl mb-2">🗺️</p>
                  <p>Imagen no disponible</p>
                </div>
              </div>
            )}
          </div>
          
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-semibold text-white mb-3">Estadísticas Clave</h3>
              
              <div className="flex justify-between items-center py-2 border-b border-gray-700">
                <span className="text-gray-400 flex items-center">📏 <span className="ml-2">Distancia Total</span></span>
                <span className="font-semibold text-white">{route.distanceKm} km</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-gray-700">
                <span className="text-gray-400 flex items-center">🚧 <span className="ml-2">Dificultad</span></span>
                <span className={`font-semibold ${
                  route.difficulty === 'Fácil' ? 'text-green-400' :
                  route.difficulty === 'Media' ? 'text-yellow-400' :
                  'text-red-400'
                }`}>{route.difficulty}</span>
              </div>
              
              {route.startPoint && (
                <div className="flex justify-between items-center py-2 border-b border-gray-700">
                  <span className="text-gray-400 flex items-center">📍 <span className="ml-2">Inicio</span></span>
                  <span className="font-semibold text-white text-sm">{route.startPoint}</span>
                </div>
              )}
              
              {route.endPoint && (
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-400 flex items-center">🏁 <span className="ml-2">Destino</span></span>
                  <span className="font-semibold text-white text-sm">{route.endPoint}</span>
                </div>
              )}
            </div>
            
            {route.mapUrl && (
              <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-semibold text-white mb-3">Navegación</h3>
                <a 
                  href={route.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md block text-center"
                >
                  Ver en Google Maps
                </a>
              </div>
            )}
          </div>
        </div>

        {route.description && (
          <div className="mt-8 p-6 bg-gray-800 rounded-xl shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-3">Sobre la Ruta</h2>
            <p className="text-gray-300 whitespace-pre-line">{route.description}</p>
          </div>
        )}

        <div className="mt-8">
          <RouteReviews routeId={id} />
        </div>
        
      </div>
    </div>
  );
}
