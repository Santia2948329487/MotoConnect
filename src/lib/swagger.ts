// src/lib/swagger.ts
export const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'MotoConnect API',
    version: '1.0.0',
    description: '🏍️ API REST para MotoConnect - Red Social de Moteros',
    contact: {
      name: 'MotoConnect Team',
      email: 'soporte@motoconnect.com',
    },
    license: {
      name: 'SENA - Privado',
    },
  },
  servers: [
    {
      url: 'http://localhost:3000/api',
      description: 'Servidor de Desarrollo',
    },
    {
      url: 'https://motoconnect.vercel.app/api',
      description: 'Servidor de Producción',
    },
  ],
  tags: [
    {
      name: 'Routes',
      description: '🗺️ Gestión de rutas moteras',
    },
    {
      name: 'Communities',
      description: '👥 Gestión de comunidades',
    },
    {
      name: 'Workshops',
      description: '🔧 Gestión de talleres mecánicos',
    },
    {
      name: 'Auth',
      description: '🔐 Autenticación y seguridad',
    },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Token JWT de Clerk Auth',
      },
    },
    schemas: {
      // ========== RUTAS ==========
      Route: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'cm3abc123' },
          name: { type: 'string', example: 'Ruta del Café: Medellín - Jardín' },
          description: { type: 'string', example: 'Hermosa ruta por el paisaje cafetero...' },
          distanceKm: { type: 'number', example: 134 },
          difficulty: {
            type: 'string',
            enum: ['Fácil', 'Media', 'Difícil'],
            example: 'Media',
          },
          startPoint: { type: 'string', example: 'Medellín, Antioquia' },
          endPoint: { type: 'string', example: 'Jardín, Antioquia' },
          mapUrl: { type: 'string', format: 'uri', example: 'https://maps.google.com/...' },
          image: { type: 'string', format: 'uri', example: 'https://images.unsplash.com/...' },
          createdAt: { type: 'string', format: 'date-time' },
          creator: { $ref: '#/components/schemas/UserInfo' },
          averageRating: { type: 'number', example: 4.5 },
          reviewCount: { type: 'number', example: 10 },
        },
      },
      RouteCreate: {
        type: 'object',
        required: ['name', 'distanceKm', 'difficulty'],
        properties: {
          name: { type: 'string', minLength: 3, maxLength: 100, example: 'Mi Nueva Ruta' },
          description: { type: 'string', example: 'Descripción detallada...' },
          distanceKm: { type: 'number', minimum: 0, example: 150 },
          difficulty: { type: 'string', enum: ['Fácil', 'Media', 'Difícil'], example: 'Media' },
          startPoint: { type: 'string', example: 'Medellín' },
          endPoint: { type: 'string', example: 'Jardín' },
          mapUrl: { type: 'string', format: 'uri', example: 'https://maps.google.com/' },
          image: { type: 'string', format: 'uri', example: 'https://example.com/image.jpg' },
        },
      },

      // ========== COMUNIDADES ==========
      Community: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'cm3xyz456' },
          name: { type: 'string', example: 'Riders Antioquia' },
          description: { type: 'string', example: 'Comunidad de moteros paisas...' },
          image: { type: 'string', format: 'uri' },
          createdAt: { type: 'string', format: 'date-time' },
          creator: { $ref: '#/components/schemas/UserInfo' },
          memberCount: { type: 'number', example: 250 },
          postCount: { type: 'number', example: 45 },
        },
      },
      CommunityCreate: {
        type: 'object',
        required: ['name'],
        properties: {
          name: { type: 'string', minLength: 3, maxLength: 100, example: 'Mi Comunidad' },
          description: { type: 'string', example: 'Descripción...' },
          image: { type: 'string', format: 'uri' },
        },
      },

      // ========== TALLERES ==========
      Workshop: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'cm3def789' },
          name: { type: 'string', example: 'MotoTaller Medellín Centro' },
          description: { type: 'string', example: 'Especialistas en motos deportivas...' },
          address: { type: 'string', example: 'Cra. 43A #1-50, Medellín' },
          phone: { type: 'string', example: '+57 300 1234567' },
          services: { type: 'string', example: 'Mecánica general, pintura, eléctricos' },
          latitude: { type: 'number', example: 6.25184 },
          longitude: { type: 'number', example: -75.56359 },
          image: { type: 'string', format: 'uri' },
          createdAt: { type: 'string', format: 'date-time' },
          creator: { $ref: '#/components/schemas/UserInfo' },
          averageRating: { type: 'number', example: 4.7 },
          reviewCount: { type: 'number', example: 23 },
        },
      },
      WorkshopCreate: {
        type: 'object',
        required: ['name', 'address', 'latitude', 'longitude'],
        properties: {
          name: { type: 'string', minLength: 3, maxLength: 100, example: 'Mi Taller' },
          description: { type: 'string', example: 'Descripción...' },
          address: { type: 'string', minLength: 5, example: 'Calle 123 #45-67' },
          phone: { type: 'string', example: '+57 300 1234567' },
          services: { type: 'string', example: 'Mecánica, pintura' },
          latitude: { type: 'number', minimum: -90, maximum: 90, example: 6.2442 },
          longitude: { type: 'number', minimum: -180, maximum: 180, example: -75.5812 },
          image: { type: 'string', format: 'uri' },
        },
      },

      // ========== USUARIO ==========
      UserInfo: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'user_123' },
          name: { type: 'string', example: 'Carlos Motero' },
          email: { type: 'string', format: 'email', example: 'carlos@example.com' },
        },
      },

      // ========== RESPUESTAS ==========
      SuccessResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          data: { type: 'object' },
          message: { type: 'string', example: 'Operación exitosa' },
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          error: { type: 'string', example: 'Mensaje de error' },
          details: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                field: { type: 'string', example: 'email' },
                message: { type: 'string', example: 'Email inválido' },
              },
            },
          },
        },
      },
      PaginationResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          data: { type: 'array', items: { type: 'object' } },
          pagination: {
            type: 'object',
            properties: {
              total: { type: 'number', example: 100 },
              limit: { type: 'number', example: 10 },
              offset: { type: 'number', example: 0 },
              hasMore: { type: 'boolean', example: true },
            },
          },
        },
      },
    },
    parameters: {
      IdParam: {
        name: 'id',
        in: 'path',
        required: true,
        schema: { type: 'string' },
        description: 'ID del recurso',
        example: 'cm3abc123',
      },
      LimitParam: {
        name: 'limit',
        in: 'query',
        schema: { type: 'integer', default: 50, maximum: 100 },
        description: 'Número máximo de resultados',
      },
      OffsetParam: {
        name: 'offset',
        in: 'query',
        schema: { type: 'integer', default: 0 },
        description: 'Número de resultados a saltar',
      },
    },
    responses: {
      Unauthorized: {
        description: '🔒 No autorizado - Token inválido o faltante',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ErrorResponse' },
            example: {
              success: false,
              error: 'No autorizado. Debes iniciar sesión.',
            },
          },
        },
      },
      Forbidden: {
        description: '⛔ Prohibido - No tienes permisos',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ErrorResponse' },
            example: {
              success: false,
              error: 'No tienes permisos para esta acción',
            },
          },
        },
      },
      NotFound: {
        description: '❌ No encontrado',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ErrorResponse' },
            example: {
              success: false,
              error: 'Recurso no encontrado',
            },
          },
        },
      },
      BadRequest: {
        description: '⚠️ Datos inválidos',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ErrorResponse' },
            example: {
              success: false,
              error: 'Datos inválidos',
              details: [
                { field: 'email', message: 'Email inválido' },
              ],
            },
          },
        },
      },
      RateLimit: {
        description: '⏱️ Demasiadas solicitudes',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ErrorResponse' },
            example: {
              success: false,
              error: 'Demasiados intentos. Por favor, intenta más tarde.',
              retryAfter: 60,
            },
          },
        },
      },
    },
  },
  paths: {
    // ==================== RUTAS ====================
    '/routes': {
      get: {
        tags: ['Routes'],
        summary: '📋 Listar todas las rutas',
        description: 'Obtiene un listado paginado de rutas con filtros opcionales',
        parameters: [
          { $ref: '#/components/parameters/LimitParam' },
          { $ref: '#/components/parameters/OffsetParam' },
          {
            name: 'difficulty',
            in: 'query',
            schema: { type: 'string', enum: ['Fácil', 'Media', 'Difícil'] },
            description: 'Filtrar por dificultad',
          },
        ],
        responses: {
          200: {
            description: '✅ Lista de rutas obtenida exitosamente',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/PaginationResponse' },
              },
            },
          },
          500: {
            description: '❌ Error del servidor',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
      post: {
        tags: ['Routes'],
        summary: '➕ Crear nueva ruta',
        description: 'Crea una nueva ruta motera (requiere autenticación)',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/RouteCreate' },
            },
          },
        },
        responses: {
          201: {
            description: '✅ Ruta creada exitosamente',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SuccessResponse' },
              },
            },
          },
          400: { $ref: '#/components/responses/BadRequest' },
          401: { $ref: '#/components/responses/Unauthorized' },
          429: { $ref: '#/components/responses/RateLimit' },
        },
      },
    },
    '/routes/{id}': {
      get: {
        tags: ['Routes'],
        summary: '🔍 Obtener ruta por ID',
        description: 'Obtiene los detalles completos de una ruta específica',
        parameters: [{ $ref: '#/components/parameters/IdParam' }],
        responses: {
          200: {
            description: '✅ Ruta encontrada',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/Route' },
                  },
                },
              },
            },
          },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
      put: {
        tags: ['Routes'],
        summary: '✏️ Actualizar ruta',
        description: 'Actualiza una ruta existente (solo creador o admin)',
        security: [{ BearerAuth: [] }],
        parameters: [{ $ref: '#/components/parameters/IdParam' }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/RouteCreate' },
            },
          },
        },
        responses: {
          200: {
            description: '✅ Ruta actualizada',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SuccessResponse' },
              },
            },
          },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
      delete: {
        tags: ['Routes'],
        summary: '🗑️ Eliminar ruta',
        description: 'Elimina una ruta (solo creador o admin)',
        security: [{ BearerAuth: [] }],
        parameters: [{ $ref: '#/components/parameters/IdParam' }],
        responses: {
          200: {
            description: '✅ Ruta eliminada',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Ruta eliminada exitosamente' },
                  },
                },
              },
            },
          },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
    },

    // ==================== COMUNIDADES ====================
    '/communities': {
      get: {
        tags: ['Communities'],
        summary: '📋 Listar comunidades',
        parameters: [
          { $ref: '#/components/parameters/LimitParam' },
          { $ref: '#/components/parameters/OffsetParam' },
        ],
        responses: {
          200: {
            description: '✅ Lista de comunidades',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/PaginationResponse' },
              },
            },
          },
        },
      },
      post: {
        tags: ['Communities'],
        summary: '➕ Crear comunidad',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CommunityCreate' },
            },
          },
        },
        responses: {
          201: { description: '✅ Comunidad creada' },
          401: { $ref: '#/components/responses/Unauthorized' },
          429: { $ref: '#/components/responses/RateLimit' },
        },
      },
    },
    '/communities/{id}': {
      get: {
        tags: ['Communities'],
        summary: '🔍 Obtener comunidad por ID',
        parameters: [{ $ref: '#/components/parameters/IdParam' }],
        responses: {
          200: { description: '✅ Comunidad encontrada' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
      put: {
        tags: ['Communities'],
        summary: '✏️ Actualizar comunidad',
        security: [{ BearerAuth: [] }],
        parameters: [{ $ref: '#/components/parameters/IdParam' }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CommunityCreate' },
            },
          },
        },
        responses: {
          200: { description: '✅ Comunidad actualizada' },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
      delete: {
        tags: ['Communities'],
        summary: '🗑️ Eliminar comunidad',
        security: [{ BearerAuth: [] }],
        parameters: [{ $ref: '#/components/parameters/IdParam' }],
        responses: {
          200: { description: '✅ Comunidad eliminada' },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
        },
      },
    },

    // ==================== TALLERES ====================
    '/workshops': {
      get: {
        tags: ['Workshops'],
        summary: '📋 Listar talleres',
        parameters: [
          { $ref: '#/components/parameters/LimitParam' },
          { $ref: '#/components/parameters/OffsetParam' },
          {
            name: 'lat',
            in: 'query',
            schema: { type: 'number' },
            description: 'Latitud para búsqueda cercana',
          },
          {
            name: 'lng',
            in: 'query',
            schema: { type: 'number' },
            description: 'Longitud para búsqueda cercana',
          },
          {
            name: 'radius',
            in: 'query',
            schema: { type: 'number', default: 50 },
            description: 'Radio de búsqueda en km',
          },
        ],
        responses: {
          200: { description: '✅ Lista de talleres' },
        },
      },
      post: {
        tags: ['Workshops'],
        summary: '➕ Crear taller',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/WorkshopCreate' },
            },
          },
        },
        responses: {
          201: { description: '✅ Taller creado' },
          401: { $ref: '#/components/responses/Unauthorized' },
          429: { $ref: '#/components/responses/RateLimit' },
        },
      },
    },
    '/workshops/{id}': {
      get: {
        tags: ['Workshops'],
        summary: '🔍 Obtener taller por ID',
        parameters: [{ $ref: '#/components/parameters/IdParam' }],
        responses: {
          200: { description: '✅ Taller encontrado' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
      put: {
        tags: ['Workshops'],
        summary: '✏️ Actualizar taller',
        security: [{ BearerAuth: [] }],
        parameters: [{ $ref: '#/components/parameters/IdParam' }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/WorkshopCreate' },
            },
          },
        },
        responses: {
          200: { description: '✅ Taller actualizado' },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
        },
      },
      delete: {
        tags: ['Workshops'],
        summary: '🗑️ Eliminar taller',
        security: [{ BearerAuth: [] }],
        parameters: [{ $ref: '#/components/parameters/IdParam' }],
        responses: {
          200: { description: '✅ Taller eliminado' },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
        },
      },
    },

    // ==================== AUTH ====================
    '/verify-recaptcha': {
      post: {
        tags: ['Auth'],
        summary: '🔒 Verificar reCAPTCHA',
        description: 'Verifica el token de reCAPTCHA v3',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['token'],
                properties: {
                  token: { type: 'string', example: 'recaptcha_token_here' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: '✅ Token válido',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    score: { type: 'number', example: 0.9 },
                  },
                },
              },
            },
          },
          400: { $ref: '#/components/responses/BadRequest' },
          429: { $ref: '#/components/responses/RateLimit' },
        },
      },
    },
  },
};