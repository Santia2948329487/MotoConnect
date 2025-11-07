// src/components/cards/RouteCard.tsx
import { Route } from '@/types/route';
import Link from 'next/link';

interface RouteCardProps {
  route: Route;
}

export default function RouteCard({ route }: RouteCardProps) {
  return (
    <Link href={`/routes/${route.id}`} className="block">
      <div className="bg-gray-800 p-4 rounded-lg shadow-xl hover:shadow-2xl hover:border-blue-500 border border-transparent transition-all duration-300">
        <h3 className="text-xl font-semibold text-blue-400 truncate">{route.title}</h3>
        <p className="text-sm text-gray-400 mt-1 line-clamp-2">{route.description}</p>
        
        <div className="mt-3 text-sm space-y-1">
          <p className="text-gray-300">
            Distancia: <span className="font-medium text-white">{route.distanceKm} km</span>
          </p>
          <p className="text-gray-300">
            Dificultad: <span className={`font-medium ${route.difficulty === 'Difícil' ? 'text-red-400' : route.difficulty === 'Media' ? 'text-yellow-400' : 'text-green-400'}`}>{route.difficulty}</span>
          </p>
          <p className="text-gray-500 text-xs">
            Por {route.authorName} | Vistas: {route.views}
          </p>
        </div>
      </div>
    </Link>
  );
}