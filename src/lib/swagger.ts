// src/lib/swagger.ts
import { createSwaggerSpec } from 'next-swagger-doc';

export const getApiDocs = () => {
  const spec = createSwaggerSpec({
    apiFolder: 'src/app/api',
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'MotoConnect API',
        version: '1.0.0',
        description: 'API REST para MotoConnect - Red Social de Moteros',
        contact: {
          name: 'MotoConnect Team',
          email: 'support@motoconnect.com',
        },
      },
      servers: [
        {
          url: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
          description: 'Servidor de desarrollo',
        },
        {
          url: 'https://motoconnect.vercel.app',
          description: 'Servidor de producción',
        },
      ],
      components: {
        securitySchemes: {
          BearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            description: 'Token de autenticación de Clerk',
          },
        },
        schemas: {
          Route: {
            type: 'object',
            properties: {
              id: { type: 'string', example: 'cm3abc123' },
              name: { type: 'string', example: 'Ruta del Café' },
              description: { type: 'string', example: 'Hermosa ruta por el eje cafetero' },
              distanceKm: { type: 'number', example: 150.5 },
              difficulty: { 
                type: 'string', 
                enum: ['Fácil', 'Media', 'Difícil'],
                example: 'Media' 
              },
              startPoint: { type: 'string', example: 'Medellín' },
              endPoint: { type: 'string', example: 'Jardín' },
              mapUrl: { type: 'string', format: 'uri', example: 'https://maps.google.com/...' },
              image: { type: 'string', format: 'uri', example: 'https://example.com/image.jpg' },
              createdAt: { type: 'string', format: 'date-time' },
              creatorId: { type: 'string' },
              creator: { $ref: '#/components/schemas/User' },
              reviews: { 
                type: 'array',
                items: { $ref: '#/components/schemas/RouteReview' }
              },
              averageRating: { type: 'number', example: 4.5 },
              reviewCount: { type: 'number', example: 10 },
            },
          },
          User: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string', example: 'Carlos Motero' },
              email: { type: 'string', format: 'email', example: 'carlos@example.com' },
            },
          },
          RouteReview: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              rating: { type: 'integer', minimum: 1, maximum: 5, example: 5 },
              comment: { type: 'string', example: 'Excelente ruta!' },
              userId: { type: 'string' },
              routeId: { type: 'string' },
              createdAt: { type: 'string', format: 'date-time' },
            },
          },
          Error: {
            type: 'object',
            properties: {
              success: { type: 'boolean', example: false },
              error: { type: 'string', example: 'Error message' },
              details: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    field: { type: 'string' },
                    message: { type: 'string' },
                  },
                },
              },
            },
          },
        },
      },
      tags: [
        {
          name: 'Routes',
          description: 'Endpoints para gestión de rutas moteras',
        },
        {
          name: 'Communities',
          description: 'Endpoints para comunidades',
        },
        {
          name: 'Workshops',
          description: 'Endpoints para talleres mecánicos',
        },
      ],
    },
  });

  return spec;
};