// src/lib/mockData.ts
import { Route } from '@/types/route';
import { Community } from '@/types/community';
import { Workshop } from '@/types/workshop'; // <-- Importar Workshop

export const mockRoutes: Route[] = [
  {
    id: "ruta-1", // IDs como string
    title: "La Ruta de la Cordillera Central",
    description: "Una épica travesía de 3 días que cruza el país. Vistas espectaculares, clima frío y tramos de alta exigencia técnica. Requiere neumáticos doble propósito.",
    distanceKm: 480,
    authorName: "El Viajero Solitario",
    duration: '3 días',
    difficulty: 'Difícil',
    views: 1540,
    createdAt: new Date('2024-10-20').toISOString(),
  },
  {
    id: "ruta-2", // IDs como string
    title: 'Ruta Costera',
    description: 'Recorrido escénico por la costa',
    distanceKm: 120,
    authorName: 'Marina Rider',
    duration: '2h 45min',
    difficulty: 'Fácil',
    views: 980,
    createdAt: new Date('2024-11-05').toISOString(),
  },
];

// Mover la función DESPUÉS de definir mockRoutes
export function getMockRouteById(id: string): Route | undefined {
  return mockRoutes.find(r => r.id === id);
}

// Aplicar el tipo Workshop[] y cambiar IDs a string
export const mockWorkshops: Workshop[] = [
  {
    id: "taller-1",
    name: "Taller Moto Medellín",
    latitude: 6.25184,
    longitude: -75.56359,
    description: "Especialistas en motos deportivas.",
    address: "Cra. 43A #1-50, Medellín, Antioquia",
    rating: 4.7,
    phone: "+57 300 1234567",
  },
  {
    id: "taller-2",
    name: "Moto Service Envigado",
    latitude: 6.17591,
    longitude: -75.59174,
    description: "Servicio rápido y confiable.",
    address: "Calle 40 Sur #41-20, Envigado, Antioquia",
    rating: 4.5,
    phone: "+57 301 7654321",
  },
  {
    id: "taller-3",
    name: "Taller La 33",
    latitude: 6.2442,
    longitude: -75.5812,
    description: "Reparaciones generales y repuestos.",
    address: "Av. 33 #65-123, Medellín, Antioquia",
    rating: 4.6,
    phone: "+57 302 9876543",
  },
];

export const mockCommunities: Community[] = [
  { id: '1', name: 'Ruedas de Montaña Bogotá', description: 'Comunidad enfocada en rutas off-road en la sabana y la cordillera.', memberCount: 1200, topic: 'Off-Road', creatorName: 'Daniel A.' },
  { id: '2', name: 'Mantenimiento DIY', description: 'Tips y trucos para hacerle el mantenimiento a tu moto en casa.', memberCount: 850, topic: 'Mecánica', creatorName: 'Taller Master' },
];