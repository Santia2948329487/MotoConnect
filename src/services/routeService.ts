// src/services/routeService.ts
import { Route } from '@/types/route';

// Determinar la URL base según el entorno
const getBaseUrl = () => {
  // En el servidor (Server Components)
  if (typeof window === 'undefined') {
    // En desarrollo
    if (process.env.NODE_ENV === 'development') {
      return 'http://localhost:3000/api';
    }
    // En producción, usar la URL del vercel
    return process.env.NEXT_PUBLIC_API_URL || 'https://motoconnect.vercel.app/api';
  }
  // En el cliente (navegador)
  return '/api';
};

const API_BASE = getBaseUrl();

// Tipo de respuesta de la API
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  details?: Array<{ field: string; message: string }>;
  pagination?: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

// 1. Obtener todas las rutas
export async function fetchAllRoutes(options?: {
  difficulty?: string;
  limit?: number;
  offset?: number;
}): Promise<Route[]> {
  try {
    const params = new URLSearchParams();
    if (options?.difficulty) params.append('difficulty', options.difficulty);
    if (options?.limit) params.append('limit', options.limit.toString());
    if (options?.offset) params.append('offset', options.offset.toString());

    const url = `${API_BASE}/routes${params.toString() ? '?' + params.toString() : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 60 }, // Cache por 60 segundos
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const result: ApiResponse<any[]> = await response.json();
    
    if (!result.success || !result.data) {
      throw new Error(result.error || 'Error al cargar rutas');
    }

    // Transformar a tu tipo Route
    return result.data.map(route => ({
      id: route.id,
      title: route.name, // El backend usa "name", frontend usa "title"
      description: route.description || '',
      distanceKm: route.distanceKm || 0,
      authorName: route.creator?.name || 'Anónimo',
      difficulty: route.difficulty as 'Fácil' | 'Media' | 'Difícil',
      views: 0, // TODO: implementar sistema de vistas
      createdAt: route.createdAt,
      duration: calculateDuration(route.distanceKm), // Función auxiliar
    }));
    
  } catch (error) {
    console.error("Error fetching routes:", error);
    throw error;
  }
}

// 2. Obtener una ruta específica por ID
export async function fetchRouteById(id: string): Promise<Route | null> {
  try {
    const response = await fetch(`${API_BASE}/routes/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const result: ApiResponse<any> = await response.json();
    
    if (!result.success || !result.data) {
      return null;
    }

    const route = result.data;
    
    return {
      id: route.id,
      title: route.name,
      description: route.description || '',
      distanceKm: route.distanceKm || 0,
      authorName: route.creator?.name || 'Anónimo',
      difficulty: route.difficulty as 'Fácil' | 'Media' | 'Difícil',
      views: 0,
      createdAt: route.createdAt,
      duration: calculateDuration(route.distanceKm),
    };
    
  } catch (error) {
    console.error("Error fetching route:", error);
    return null;
  }
}

// 3. Crear una nueva ruta
export async function createRoute(routeData: {
  name: string;
  description?: string;
  distanceKm: number;
  difficulty: 'Fácil' | 'Media' | 'Difícil';
  startPoint?: string;
  endPoint?: string;
  mapUrl?: string;
  image?: string;
}): Promise<Route> {
  try {
    const response = await fetch(`${API_BASE}/routes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(routeData),
    });

    const result: ApiResponse<any> = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.error || 'Error al crear la ruta');
    }

    const route = result.data!;
    
    return {
      id: route.id,
      title: route.name,
      description: route.description || '',
      distanceKm: route.distanceKm || 0,
      authorName: route.creator?.name || 'Anónimo',
      difficulty: route.difficulty as 'Fácil' | 'Media' | 'Difícil',
      views: 0,
      createdAt: route.createdAt,
      duration: calculateDuration(route.distanceKm),
    };
    
  } catch (error) {
    console.error("Error creating route:", error);
    throw error;
  }
}

// 4. Actualizar una ruta
export async function updateRoute(
  id: string,
  routeData: Partial<{
    name: string;
    description: string;
    distanceKm: number;
    difficulty: 'Fácil' | 'Media' | 'Difícil';
    startPoint: string;
    endPoint: string;
    mapUrl: string;
    image: string;
  }>
): Promise<Route> {
  try {
    const response = await fetch(`${API_BASE}/routes/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(routeData),
    });

    const result: ApiResponse<any> = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.error || 'Error al actualizar la ruta');
    }

    const route = result.data!;
    
    return {
      id: route.id,
      title: route.name,
      description: route.description || '',
      distanceKm: route.distanceKm || 0,
      authorName: route.creator?.name || 'Anónimo',
      difficulty: route.difficulty as 'Fácil' | 'Media' | 'Difícil',
      views: 0,
      createdAt: route.createdAt,
      duration: calculateDuration(route.distanceKm),
    };
    
  } catch (error) {
    console.error("Error updating route:", error);
    throw error;
  }
}

// 5. Eliminar una ruta
export async function deleteRoute(id: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE}/routes/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result: ApiResponse<any> = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.error || 'Error al eliminar la ruta');
    }
    
  } catch (error) {
    console.error("Error deleting route:", error);
    throw error;
  }
}

// Función auxiliar para calcular duración estimada
function calculateDuration(distanceKm: number): string {
  if (!distanceKm) return 'N/A';
  
  // Asumiendo velocidad promedio de 60 km/h en moto
  const hours = distanceKm / 60;
  
  if (hours < 1) {
    const minutes = Math.round(hours * 60);
    return `${minutes} min`;
  } else if (hours < 24) {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return m > 0 ? `${h}h ${m}min` : `${h}h`;
  } else {
    const days = Math.floor(hours / 24);
    const h = Math.round(hours % 24);
    return h > 0 ? `${days}d ${h}h` : `${days}d`;
  }
}