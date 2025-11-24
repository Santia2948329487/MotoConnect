// src/lib/rateLimiter.ts
import { NextResponse } from 'next/server';

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

// Almacenamiento en memoria (para producción usa Redis o Upstash)
const store: RateLimitStore = {};

interface RateLimitOptions {
  windowMs: number; // Ventana de tiempo en milisegundos
  maxRequests: number; // Número máximo de requests
}

/**
 * Rate Limiter simple en memoria
 * Para producción, considera usar @vercel/kv o Redis
 */
export function rateLimit(options: RateLimitOptions) {
  const { windowMs, maxRequests } = options;

  return function rateLimitMiddleware(identifier: string): {
    success: boolean;
    remaining: number;
    resetTime: number;
  } {
    const now = Date.now();
    const key = `ratelimit:${identifier}`;

    // Obtener o crear entrada
    if (!store[key] || store[key].resetTime < now) {
      store[key] = {
        count: 0,
        resetTime: now + windowMs,
      };
    }

    // Incrementar contador
    store[key].count += 1;

    const remaining = Math.max(0, maxRequests - store[key].count);
    const success = store[key].count <= maxRequests;

    return {
      success,
      remaining,
      resetTime: store[key].resetTime,
    };
  };
}

// Presets comunes
export const rateLimiters = {
  // Para login: 5 intentos por 15 minutos
  auth: rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    maxRequests: 5,
  }),

  // Para API general: 100 requests por minuto
  api: rateLimit({
    windowMs: 60 * 1000, // 1 minuto
    maxRequests: 100,
  }),

  // Para creación de contenido: 10 por hora
  create: rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hora
    maxRequests: 10,
  }),
};

/**
 * Helper para aplicar rate limiting en API routes
 */
export function applyRateLimit(
  req: Request,
  limiter: ReturnType<typeof rateLimit>
): NextResponse | null {
  // Usar IP como identificador (en producción, considera usar userId también)
  const ip = req.headers.get('x-forwarded-for') || 
             req.headers.get('x-real-ip') || 
             'unknown';

  const result = limiter(ip);

  if (!result.success) {
    const resetDate = new Date(result.resetTime);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Demasiados intentos. Por favor, intenta más tarde.',
        retryAfter: Math.ceil((result.resetTime - Date.now()) / 1000),
      },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': limiter.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': resetDate.toISOString(),
          'Retry-After': Math.ceil((result.resetTime - Date.now()) / 1000).toString(),
        },
      }
    );
  }

  return null;
}

// Cleanup automático cada 10 minutos para evitar memory leaks
setInterval(() => {
  const now = Date.now();
  Object.keys(store).forEach((key) => {
    if (store[key].resetTime < now) {
      delete store[key];
    }
  });
}, 10 * 60 * 1000);