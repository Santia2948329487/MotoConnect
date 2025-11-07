// src/services/routeService.ts
import { Route } from '@/types/route';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'; // Usa la URL de tu compañero

// 1. Obtener todas las Rutas
export async function fetchAllRoutes(): Promise<Route[]> {
  try {
    // Llama al API de tu compañero que está conectado a Neon/DBeaver
    const response = await fetch(`${API_BASE}/routes`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Opcional: Si usas Clerk y tu Backend necesita saber quién eres:
        // 'Authorization': `Bearer ${clerkToken}` 
      },
      // Esto es crucial para la caché de Next.js
      next: { revalidate: 60 }, 
    });

    if (!response.ok) {
      throw new Error(`Error al cargar rutas: ${response.statusText}`);
    }

    const data = await response.json();
    return data.routes as Route[]; // Asume que la respuesta tiene un array 'routes'
    
  } catch (error) {
    console.error("Error fetching routes:", error);
    // En caso de fallo, podrías devolver mockData como fallback temporal
    // return mockRoutes; 
    return []; 
  }
}

// 2. Crear una Ruta (POST)
export async function createRoute(newRouteData: Omit<Route, 'id' | 'createdAt' | 'views'>): Promise<Route> {
  // Llama al API de tu compañero con los datos del formulario
  const response = await fetch(`${API_BASE}/routes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newRouteData),
  });

  if (!response.ok) {
    throw new Error('Fallo al crear la ruta.');
  }

  return response.json() as Promise<Route>;
}