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

}