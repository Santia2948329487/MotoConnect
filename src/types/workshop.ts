// src/types/workshop.ts

export interface Workshop {
  id: string;
  name: string;
  latitude: number; // Clave para la ubicación en el mapa
  longitude: number; // Clave para la ubicación en el mapa
    description: string;
  address: string;
  rating: number; // Útil para la UX
  phone: string;
}