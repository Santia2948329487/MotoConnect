# 🏍️ MotoConnect - Red Social de Moteros

**MotoConnect** es una plataforma web full-stack que conecta a motociclistas, permitiéndoles compartir rutas, encontrar talleres mecánicos, crear comunidades y calificar experiencias.

## 🎯 Características Principales

### 🗺️ Rutas Interactivas
- **Mapa interactivo** con Leaflet para diseñar rutas personalizadas
- Click en el mapa para añadir waypoints
- Cálculo automático de distancia con fórmula de Haversine
- Sistema de calificaciones con estrellas (⭐)
- Filtros por dificultad (Fácil, Media, Difícil)

### 🛠️ Talleres Mecánicos
- Mapa de talleres con geolocalización
- Búsqueda por coordenadas y radio
- Información detallada: servicios, teléfono, dirección
- Integración con Google Maps para navegación

### 👥 Comunidades
- Creación y gestión de comunidades moteras
- Sistema de posts y comentarios
- Roles y permisos (Admin, Usuario)

### 🔐 Seguridad
- Autenticación con **Clerk** (Email, Google, GitHub OAuth)
- **Rate Limiting** anti-spam
- Validación de datos con **Zod**
- Control de permisos (RBAC)
- Variables sensibles en `.env`
- CORS configurado

## 🛠️ Stack Tecnológico

### Frontend
- **Next.js 16** (App Router, React 19, Turbopack)
- **TypeScript** para type-safety
- **Tailwind CSS** para estilos
- **Leaflet & React-Leaflet** para mapas interactivos
- **Lucide React** para iconos

### Backend
- **Next.js API Routes** (Serverless)
- **Prisma ORM** con PostgreSQL (Neon)
- **Zod** para validación de datos
- **JWT** manejado por Clerk

### Base de Datos
- **PostgreSQL** (Neon - serverless)
- Modelos: User, Route, Community, Workshop, Review, Post, Comment

### Autenticación & Autorización
- **Clerk** para autenticación
- OAuth (Google, GitHub)
- Roles: ADMIN, USER
- Recuperación de contraseña

## 📦 Instalación

### Prerrequisitos
- Node.js 18+
- npm o yarn
- Cuenta en Neon (PostgreSQL)
- Cuenta en Clerk

### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/motoconnect.git
cd motoconnect
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env` en la raíz:

```env
# Base de datos (Neon PostgreSQL)
DATABASE_URL="postgresql://..."

# Clerk (Autenticación)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/auth/login
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/auth/register
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/auth/login
CLERK_WEBHOOK_SECRET=whsec_...
```

### 4. Configurar Prisma y poblar la base de datos

```bash
# Generar el cliente de Prisma
npx prisma generate

# Aplicar migraciones
npx prisma db push

# Poblar con datos de prueba
node prisma/seedRoutes.js
```

### 5. Iniciar el servidor de desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 🧪 Usuario Demo

Después de ejecutar el seed, puedes usar estos usuarios de prueba:

- **Email:** rider1@motoconnect.com
- **Email:** rider2@motoconnect.com
- **Email:** admin@motoconnect.com

**Nota:** Necesitarás registrarte con Clerk para crear tu propia cuenta.

## 📁 Estructura del Proyecto

```
motoconnect/
├── prisma/
│   ├── schema.prisma          # Modelos de base de datos
│   ├── seedRoutes.js          # Datos de prueba
│   └── migrations/
├── src/
│   ├── app/
│   │   ├── api/               # API Routes
│   │   │   ├── routes/        # CRUD de rutas
│   │   │   ├── communities/   # CRUD de comunidades
│   │   │   └── workshops/     # CRUD de talleres
│   │   ├── auth/              # Páginas de autenticación
│   │   ├── routes/            # Páginas de rutas
│   │   ├── communities/       # Páginas de comunidades
│   │   └── workshops/         # Páginas de talleres
│   ├── components/
│   │   ├── InteractiveRouteMap.tsx
│   │   ├── WorkshopsMap.tsx
│   │   ├── RouteReviews.tsx
│   │   └── ...
│   ├── lib/
│   │   ├── rateLimiter.ts     # Rate limiting
│   │   ├── recaptcha.ts       # Utilidades de reCAPTCHA
│   │   └── mockData.ts        # Datos mock
│   ├── services/
│   │   └── routeService.ts    # Service layer
│   └── types/                 # TypeScript types
└── package.json
```

## 🔒 Seguridad Implementada

✅ **Autenticación JWT** con Clerk  
✅ **OAuth** (Google, GitHub)  
✅ **Rate Limiting** (100 req/min general, 10 req/hora para creación)  
✅ **Validación** con Zod en todas las APIs  
✅ **RBAC** (Control basado en roles)  
✅ **Hash de contraseñas** (bcrypt via Clerk)  
✅ **Variables sensibles** en `.env`  
✅ **CORS** configurado  
✅ **Recuperación de contraseña** funcional  

## 🚀 Despliegue

### Vercel (Recomendado)

1. Sube tu código a GitHub
2. Conecta tu repo en [Vercel](https://vercel.com)
3. Configura las variables de entorno
4. Deploy automático

### Variables de entorno en Vercel

Añade todas las variables del `.env` en la sección de Environment Variables.

## 📚 API Endpoints

### Rutas
- `GET /api/routes` - Listar todas las rutas
- `POST /api/routes` - Crear ruta (requiere auth)
- `GET /api/routes/[id]` - Ver ruta específica
- `PUT /api/routes/[id]` - Actualizar ruta (requiere permisos)
- `DELETE /api/routes/[id]` - Eliminar ruta (requiere permisos)
- `GET /api/routes/[id]/reviews` - Ver reseñas
- `POST /api/routes/[id]/reviews` - Crear reseña (requiere auth)

### Communities
- `GET /api/communities`
- `POST /api/communities` (requiere auth)
- `GET /api/communities/[id]`
- `PUT /api/communities/[id]` (requiere permisos)
- `DELETE /api/communities/[id]` (requiere permisos)

### Workshops
- `GET /api/workshops`
- `GET /api/workshops?lat=6.2442&lng=-75.5812&radius=50` (búsqueda geolocalizada)
- `POST /api/workshops` (requiere auth)
- `GET /api/workshops/[id]`
- `PUT /api/workshops/[id]` (requiere permisos)
- `DELETE /api/workshops/[id]` (requiere permisos)

## 🎓 Proyecto Académico

Este proyecto fue desarrollado como trabajo final para el programa de **Tecnología en Desarrollo de Software** del SENA, cumpliendo con todos los requerimientos establecidos.

### Cumplimiento de Requerimientos

✅ Problema real resuelto  
✅ Diseño responsive  
✅ Autenticación con JWT  
✅ 2+ formas de inicio de sesión  
✅ Rate Limiting  
✅ CORS configurado  
✅ Recuperación de contraseña  
✅ Roles y permisos (RBAC)  
✅ Backend documentado  
✅ Base de datos con datos reales  
✅ CRUD completo de entidades  
✅ Arquitectura por capas  

## 👥 Equipo

- **Santiago Castaño** - Full Stack Developer
- **Emmanuel Torres** - Backend Developer

## 📄 Licencia

Este proyecto es de uso académico y educativo.

## 🙏 Agradecimientos

- SENA por la formación
- Comunidad de motociclistas por la inspiración
- Todas las librerías open-source utilizadas

---

**¿Preguntas?** Abre un issue en GitHub o contáctanos por email.