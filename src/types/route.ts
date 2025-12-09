// src/types/route.ts
export interface RouteReview {
  id: string;
  rating: number;
  comment?: string;
  user: {
    id: string;
    name: string;
  };
  createdAt: string;
}

export interface Route {
  id: string;
  title: string;
  description: string;
  distanceKm: number;
  authorName: string;
  difficulty: 'Fácil' | 'Media' | 'Difícil';
  views: number;
  createdAt: string;
  duration?: string;
  reviews?: RouteReview[]; // ✅ Agregar reviews opcionales
}