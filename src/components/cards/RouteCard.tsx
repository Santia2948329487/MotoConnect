// src/components/cards/RouteCard.tsx
import { Route } from '@/types/route';
import Link from 'next/link';
import { MapPin, Calendar, TrendingUp } from 'lucide-react';

interface RouteCardProps {
  route: Route;
}

export default function RouteCard({ route }: RouteCardProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty) {
      case 'Fácil': return 'text-green-500 bg-green-500/10 border-green-500/20';
      case 'Media': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'Difícil': return 'text-red-500 bg-red-500/10 border-red-500/20';
      default: return 'text-neutral-500 bg-neutral-500/10 border-neutral-500/20';
    }
  };

  return (
    <Link href={`/routes/${route.id}`} className="block group">
      <div className="bg-neutral-900 border-2 border-neutral-800 hover:border-red-600 rounded-xl p-5 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-red-600/10">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-white line-clamp-2 flex-1 group-hover:text-red-500 transition-colors">
            {route.title}
          </h3>
          <div className="w-10 h-10 bg-red-600/10 border border-red-600/20 rounded-lg flex items-center justify-center flex-shrink-0 ml-2">
            <MapPin className="w-5 h-5 text-red-500" />
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-neutral-400 mb-4 line-clamp-2 leading-relaxed">
          {route.description}
        </p>
        
        {/* Stats */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-500">Distancia</span>
            <span className="font-bold text-white">{route.distanceKm} km</span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-500">Dificultad</span>
            <span className={`px-2 py-1 rounded border text-xs font-bold uppercase ${getDifficultyColor(route.difficulty)}`}>
              {route.difficulty}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-500">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>Por {route.authorName}</span>
          </div>
          <div className="flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>{route.views} vistas</span>
          </div>
        </div>
      </div>
    </Link>
  );
}