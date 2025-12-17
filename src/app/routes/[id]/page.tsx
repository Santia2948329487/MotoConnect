// src/app/routes/[id]/page.tsx
import { fetchRouteById } from '@/services/routeService';
import RouteMapWrapper from '@/components/RouteMapWrapper';
import Link from 'next/link';
import { MapPin, Calendar, TrendingUp, Star, Bookmark, Navigation, MessageCircle } from 'lucide-react';
import CommentForm from './CommentForm';
import CommentsList from './CommentList';

interface RoutePageProps {
  params: Promise<{ id: string }>;
}

export default async function RouteDetailPage({ params }: RoutePageProps) {
  const { id } = await params;
  const route = await fetchRouteById(id);

  // Cargar comentarios
  const commentsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/routes/${id}/comments`, {
    cache: 'no-store'
  });
  
  const commentsData = await commentsResponse.json();
  const comments = commentsData.success ? commentsData.data : [];

  if (!route) {
    return (
      <div className="min-h-screen bg-neutral-950 pt-16 flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-20 h-20 bg-neutral-900 border-2 border-neutral-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <MapPin className="w-10 h-10 text-neutral-600" />
          </div>
          <h1 className="text-4xl font-black text-white mb-4">Ruta no Encontrada 😟</h1>
          <p className="text-neutral-400 mb-6">El identificador no existe.</p>
          <Link 
            href="/routes" 
            className="inline-block px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
          >
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

  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty) {
      case 'Fácil': return 'text-green-500 bg-green-500/10 border-green-500/20';
      case 'Media': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'Difícil': return 'text-red-500 bg-red-500/10 border-red-500/20';
      default: return 'text-neutral-500 bg-neutral-500/10 border-neutral-500/20';
    }
  };

  const reviews = Array.isArray(route.reviews) ? route.reviews : [];
  const averageRating = reviews.length > 0
    ? reviews.reduce((acc, r) => acc + (r.rating || 0), 0) / reviews.length
    : 0;

  return (
    <div className="min-h-screen bg-neutral-950 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-neutral-400 mb-6">
          <Link href="/routes" className="hover:text-white transition">Rutas</Link>
          <span>/</span>
          <span className="text-white">{route.title}</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">{route.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-400">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>Por <span className="font-semibold text-red-500">{route.authorName}</span></span>
            </div>
            <span>•</span>
            <span>{formatDate(route.createdAt)}</span>
            <span>•</span>
            <div className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              <span>{route.views} vistas</span>
            </div>
            {reviews.length > 0 && (
              <>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                  <span>{averageRating.toFixed(1)} ({reviews.length} reseñas)</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          
          {/* Map Section - 2/3 */}
          <div className="lg:col-span-2 space-y-6">
            {/* Map */}
            <div>
              <RouteMapWrapper waypoints={route.waypoints || []} />
            </div>

            {/* Description */}
            <div className="bg-neutral-900 border-2 border-neutral-800 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Sobre la Ruta</h2>
              <p className="text-neutral-300 leading-relaxed whitespace-pre-line">
                {route.description}
              </p>
            </div>

            {/* Reviews Section */}
            <div className="bg-neutral-900 border-2 border-neutral-800 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-white mb-4">
                Reseñas ({reviews.length})
              </h2>
              
              {reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div 
                      key={review.id}
                      className="bg-neutral-800/50 border border-neutral-700 rounded-lg p-4"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-orange-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-sm">
                              {review.user?.name?.[0]?.toUpperCase() || 'U'}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white">{review.user?.name || 'Usuario'}</p>
                            <div className="flex items-center gap-1 mt-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3 h-3 ${
                                    i < review.rating
                                      ? 'fill-yellow-500 text-yellow-500'
                                      : 'text-neutral-600'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <p className="text-xs text-neutral-500">
                          {formatDate(review.createdAt)}
                        </p>
                      </div>
                      {review.comment && (
                        <p className="text-neutral-300 text-sm mt-2">{review.comment}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Star className="w-12 h-12 text-neutral-700 mx-auto mb-3" />
                  <p className="text-neutral-500">Aún no hay reseñas para esta ruta</p>
                  <p className="text-sm text-neutral-600 mt-1">Sé el primero en compartir tu experiencia</p>
                </div>
              )}
            </div>

            {/* Comments Section */}
            <div className="bg-neutral-900 border-2 border-neutral-800 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <MessageCircle className="w-6 h-6 text-red-500" />
                <h2 className="text-2xl font-bold text-white">
                  Comentarios ({comments.length})
                </h2>
              </div>
              
              {/* Comment Form */}
              <CommentForm routeId={id} />

              {/* Comments List */}
              <CommentsList comments={comments} />
            </div>
          </div>
          
          {/* Sidebar - 1/3 */}
          <div className="lg:col-span-1 space-y-6">
            {/* Stats Card */}
            <div className="bg-neutral-900 border-2 border-neutral-800 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Estadísticas Clave</h3>
              <div className="space-y-3">
                <StatItem 
                  label="Distancia Total" 
                  value={`${route.distanceKm} km`} 
                  icon={<MapPin className="w-4 h-4" />}
                />
                <StatItem 
                  label="Dificultad" 
                  value={route.difficulty} 
                  icon={<TrendingUp className="w-4 h-4" />}
                  valueClassName={getDifficultyColor(route.difficulty)}
                />
                <StatItem 
                  label="Duración" 
                  value={route.duration || 'N/A'} 
                  icon={<Calendar className="w-4 h-4" />}
                />
                {averageRating > 0 && (
                  <StatItem 
                    label="Valoración" 
                    value={`${averageRating.toFixed(1)}/5`} 
                    icon={<Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />}
                    valueClassName="text-yellow-500"
                  />
                )}
              </div>
            </div>
            
            {/* Actions Card */}
            <div className="bg-neutral-900 border-2 border-neutral-800 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Acciones</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-center gap-2 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors">
                  <Bookmark className="w-4 h-4" />
                  Guardar Ruta
                </button>
                <button className="w-full flex items-center justify-center gap-2 py-3 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-white font-semibold rounded-lg transition-colors">
                  <Navigation className="w-4 h-4" />
                  Comenzar Navegación
                </button>
              </div>
            </div>

            {/* Creator Card */}
            <div className="bg-neutral-900 border-2 border-neutral-800 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Creador</h3>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-orange-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    {route.authorName[0]?.toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-white">{route.authorName}</p>
                  <p className="text-xs text-neutral-500">Motero Verificado</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}

const StatItem = ({ 
  label, 
  value, 
  icon,
  valueClassName = 'text-white'
}: { 
  label: string; 
  value: string; 
  icon: React.ReactNode;
  valueClassName?: string;
}) => {
  return (
    <div className="flex justify-between items-center py-3 border-b border-neutral-800 last:border-b-0">
      <div className="flex items-center gap-2 text-neutral-400">
        {icon}
        <span>{label}</span>
      </div>
      <span className={`font-bold text-sm px-2 py-1 rounded border ${valueClassName}`}>
        {value}
      </span>
    </div>
  );
};