# 🏍️ MotoConnect - Red Social de Moteros

**MotoConnect** es una plataforma web full-stack que conecta a motociclistas, permitiéndoles compartir rutas interactivas, encontrar talleres mecánicos, crear comunidades y conectar con otros riders.

## 🎯 Características Principales

<div align="center">

| 🗺️ Rutas | 🛠️ Talleres | 👥 Comunidades | 📊 Dashboard |
|:---:|:---:|:---:|:---:|
| Mapas interactivos | Geolocalización | Posts & comentarios | Sistema de XP |
| Waypoints dinámicos | Búsqueda por radio | Unirse/Salir | Logros |
| Cálculo de distancia | Reseñas | Gestión completa | Estadísticas |

</div>

---

### 🗺️ Rutas Interactivas
- **Mapa interactivo con Leaflet** para diseñar rutas personalizadas
- Click en el mapa para añadir waypoints dinámicamente
- Cálculo automático de distancia con fórmula de Haversine
- Sistema de reseñas con estrellas (⭐)
- Filtros por dificultad (Fácil, Media, Difícil)
- Edición completa de rutas existentes
- Sección de comentarios y discusión por ruta

### 🛠️ Talleres Mecánicos
- Mapa interactivo de talleres con geolocalización
- Búsqueda por coordenadas y radio
- Información detallada: servicios, teléfono, dirección
- Integración con Google Maps para navegación
- Sistema de reseñas y valoraciones

### 👥 Comunidades
- Creación y gestión de comunidades moteras
- Sistema de posts con imágenes (base64/data URLs)
- Comentarios en publicaciones
- Unirse/salir de comunidades
- Vista de comunidades seguidas por el usuario

### 📊 Dashboard Personalizado
- Estadísticas de actividad del usuario
- Sistema de XP y niveles gamificados
- Logros desbloqueables
- Historial de actividad reciente
- Tarjetas con totales de comunidades, rutas y talleres

### 🔐 Seguridad
- Autenticación con **Clerk** (Email, Google, Microsoft, Facebook OAuth)
- **Rate Limiting** anti-spam (100 req/min general, 10 req/hora para creación)
- Validación de datos con **Zod**
- Control de permisos basado en roles (RBAC)
- Variables sensibles en `.env`
- CORS configurado
- Webhooks de Clerk para sincronización de usuarios

## 🛠️ Stack Tecnológico

<div align="center">

```mermaid
graph LR
    A[Next.js 16] --> B[React 19]
    A --> C[TypeScript]
    B --> D[Tailwind CSS]
    C --> E[Prisma ORM]
    E --> F[PostgreSQL]
    A --> G[Clerk Auth]
    A --> H[Leaflet Maps]
```

</div>

### Frontend
- **Next.js 16** (App Router, React 19, Turbopack)
- **TypeScript** para type-safety
- **Tailwind CSS** para estilos
- **Leaflet & React-Leaflet** para mapas interactivos
- **Lucide React** para iconos
- **Framer Motion** para animaciones

### Backend
- **Next.js API Routes** (Serverless)
- **Prisma ORM** con PostgreSQL (Neon)
- **Zod** para validación de datos
- **Swagger/OpenAPI** para documentación de API

### Base de Datos
- **PostgreSQL** (Neon - serverless)
- Modelos: User, Route, Community, Workshop, Review, Post, Comment, RouteComment, RouteReview, WorkshopReview, CommunityMember

### Autenticación & Autorización
- **Clerk** para autenticación
- OAuth (Google, Microsoft, Facebook)
- Roles: ADMIN, USER
- Webhooks para sincronización automática

## 📦 Instalación

> [!IMPORTANT]
> Asegúrate de tener Node.js 18+ y cuentas activas en Neon y Clerk antes de comenzar.

<details>
<summary><b>📋 Ver prerrequisitos completos</b></summary>

### Prerrequisitos
- Node.js 18+
- npm o yarn
- Cuenta en [Neon](https://neon.tech) (PostgreSQL)
- Cuenta en [Clerk](https://clerk.com)

</details>

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

> [!WARNING]
> No compartas tu archivo `.env` en repositorios públicos.

Crea un archivo `.env` en la raíz:

```env
# Base de datos (Neon PostgreSQL)
DATABASE_URL="postgresql://user:password@host/database?sslmode=require"

# Clerk (Autenticación)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...

# URLs de redirección
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/auth/login

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Configurar Prisma y poblar la base de datos

```bash
# Generar el cliente de Prisma
npx prisma generate

# Aplicar migraciones
npx prisma db push

# Poblar con datos de prueba
npm run seed:routes
```

### 5. Configurar Webhooks de Clerk

1. Ve a tu Dashboard de Clerk → Webhooks
2. Añade un nuevo endpoint: `https://sierra-unvibrational-alternatively.ngrok-free.dev/api/webhooks/clerk`
3. Selecciona los eventos: `user.created`, `user.updated`, `user.deleted`
4. Copia el `Signing Secret` y añádelo a `.env` como `CLERK_WEBHOOK_SECRET`

### 6. Iniciar el servidor de desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📁 Estructura del Proyecto

```
motoconnect/
├── prisma/
│   ├── schema.prisma          # Modelos de base de datos
│   ├── seed.js                # Datos generales de prueba
│   └── seedRoutes.js          # Datos específicos de rutas
├── src/
│   ├── app/
│   │   ├── api/               # API Routes
│   │   │   ├── routes/        # CRUD de rutas
│   │   │   ├── communities/   # CRUD de comunidades
│   │   │   ├── workshops/     # CRUD de talleres
│   │   │   ├── dashboard/     # Estadísticas del usuario
│   │   │   └── webhooks/      # Webhooks de Clerk
│   │   ├── auth/              # Páginas de autenticación
│   │   ├── routes/            # Páginas de rutas
│   │   ├── communities/       # Páginas de comunidades
│   │   ├── workshops/         # Páginas de talleres
│   │   ├── dashboard/         # Dashboard del usuario
│   │   └── docs/              # Documentación de API
│   ├── components/
│   │   ├── InteractiveRouteMap.tsx  # Mapa para crear rutas
│   │   ├── RouteMapView.tsx         # Mapa para visualizar rutas
│   │   ├── WorkshopsMap.tsx         # Mapa de talleres
│   │   ├── Navbar.tsx               # Navegación principal
│   │   ├── cards/                   # Tarjetas de UI
│   │   ├── landing/                 # Landing page
│   │   └── ui/                      # Componentes reutilizables
│   ├── lib/
│   │   ├── prisma.ts          # Cliente de Prisma
│   │   ├── rateLimiter.ts     # Rate limiting
│   │   ├── swagger.ts         # Documentación de API
│   │   └── getUser.ts         # Utilidades de autenticación
│   ├── services/
│   │   ├── routeService.ts    # Service layer de rutas
│   │   ├── communityService.ts # Service layer de comunidades
│   │   └── dashboardService.ts # Service layer del dashboard
│   ├── types/                 # TypeScript types
│   └── middleware.ts          # Middleware de Next.js
└── package.json
```

## 🔒 Seguridad Implementada

<div align="center">

| Característica | Estado | Descripción |
|:---|:---:|:---|
| Autenticación JWT | ✅ | Clerk Auth con tokens seguros |
| OAuth Social | ✅ | Google, Microsoft, Facebook |
| Rate Limiting | ✅ | 100 req/min general, 10/h creación |
| Validación Zod | ✅ | En todas las APIs |
| RBAC | ✅ | Control basado en roles |
| Webhooks | ✅ | Verificación de firma |
| CORS | ✅ | Configurado para seguridad |
| Middleware | ✅ | Protección de rutas |

</div>

---

## 🚀 Despliegue

### Vercel (Recomendado)

> [!TIP]
> Vercel ofrece despliegue automático con cada push a GitHub.

<details>
<summary><b>📦 Pasos de despliegue</b></summary>

1. Sube tu código a GitHub
2. Conecta tu repo en [Vercel](https://vercel.com)
3. Configura las variables de entorno
4. Añade el webhook de Clerk con la URL de producción
5. Deploy automático

</details>

### Variables de entorno en Vercel

> [!IMPORTANT]
> Actualiza `NEXT_PUBLIC_APP_URL` con tu dominio de producción.

Añade todas las variables del `.env` en la sección de Environment Variables.

---

## 📚 API Endpoints

<details>
<summary><b>🗺️ Rutas</b></summary>

| Método | Endpoint | Auth | Descripción |
|:---|:---|:---:|:---|
| `GET` | `/api/routes` | ❌ | Listar todas las rutas |
| `POST` | `/api/routes` | ✅ | Crear ruta |
| `GET` | `/api/routes/[id]` | ❌ | Ver ruta específica |
| `PUT` | `/api/routes/[id]` | ✅ | Actualizar ruta |
| `DELETE` | `/api/routes/[id]` | ✅ | Eliminar ruta |
| `GET` | `/api/routes/[id]/comments` | ❌ | Ver comentarios |
| `POST` | `/api/routes/[id]/comments` | ✅ | Crear comentario |

</details>

<details>
<summary><b>👥 Comunidades</b></summary>

| Método | Endpoint | Auth | Descripción |
|:---|:---|:---:|:---|
| `GET` | `/api/communities` | ❌ | Listar comunidades |
| `POST` | `/api/communities` | ✅ | Crear comunidad |
| `GET` | `/api/communities/[id]` | ❌ | Ver comunidad |
| `GET` | `/api/communities/[id]/posts` | ❌ | Ver posts |
| `POST` | `/api/communities/[id]/posts` | ✅ | Crear post |
| `POST` | `/api/communities/[id]/join` | ✅ | Unirse |
| `DELETE` | `/api/communities/[id]/join` | ✅ | Salir |
| `GET` | `/api/communities/mine` | ✅ | Comunidades seguidas |

</details>

<details>
<summary><b>🛠️ Talleres</b></summary>

| Método | Endpoint | Auth | Descripción |
|:---|:---|:---:|:---|
| `GET` | `/api/workshops` | ❌ | Listar talleres |
| `GET` | `/api/workshops?lat=...&lng=...&radius=50` | ❌ | Búsqueda geolocalizada |
| `POST` | `/api/workshops` | ✅ | Crear taller |
| `GET` | `/api/workshops/[id]` | ❌ | Ver taller |
| `PUT` | `/api/workshops/[id]` | ✅ | Actualizar taller |
| `DELETE` | `/api/workshops/[id]` | ✅ | Eliminar taller |

</details>

<details>
<summary><b>📊 Dashboard & Webhooks</b></summary>

| Método | Endpoint | Auth | Descripción |
|:---|:---|:---:|:---|
| `GET` | `/api/dashboard/summary` | ✅ | Estadísticas del usuario |
| `POST` | `/api/webhooks/clerk` | 🔒 | Webhook de Clerk |
| `GET` | `/docs` | ❌ | Documentación Swagger |

</details>

---

## 🎓 Proyecto Académico

<div align="center">

**Tecnología en Desarrollo de Software - SENA**

[![SENA](https://img.shields.io/badge/SENA-Aprendiz-green?style=for-the-badge)](https://www.sena.edu.co)
[![Estado](https://img.shields.io/badge/Estado-Completado-success?style=for-the-badge)](https://github.com)
[![Licencia](https://img.shields.io/badge/Licencia-Académico-blue?style=for-the-badge)](LICENSE)

</div>

Este proyecto fue desarrollado como trabajo final para el programa de **Tecnología en Desarrollo de Software** del SENA, cumpliendo con todos los requerimientos establecidos.

### Cumplimiento de Requerimientos

<div align="center">

| Requisito | Estado |
|:---|:---:|
| Problema real resuelto | ✅ |
| Diseño responsive | ✅ |
| Autenticación JWT | ✅ |
| 4+ formas de inicio de sesión | ✅ |
| Rate Limiting | ✅ |
| CORS configurado | ✅ |
| Recuperación de contraseña | ✅ |
| RBAC (Roles y permisos) | ✅ |
| Backend documentado | ✅ |
| Base de datos con datos reales | ✅ |
| CRUD completo | ✅ |
| Arquitectura por capas | ✅ |
| Mapas interactivos | ✅ |
| Sistema de gamificación | ✅ |

</div>

---

## 🎨 Características de UI/UX

> [!NOTE]
> Diseño moderno enfocado en la experiencia del usuario.

<div align="center">

```
🎨 Dark Mode         ⚡ Animaciones        📱 Responsive
🎮 Gamificación      🗺️ Mapas Interactivos  🎯 Feedback Visual
```

</div>

- **Dark Mode** por defecto con tema consistente
- **Animaciones fluidas** con Framer Motion
- **Diseño responsive** optimizado para móviles
- **Landing page moderna** con efectos visuales
- **Dashboard gamificado** con XP y logros
- **Navegación intuitiva** con breadcrumbs
- **Feedback visual** en todas las acciones
- **Skeleton loaders** durante la carga

---

## 👥 Equipo

<div align="center">

| Desarrollador | Rol | GitHub |
|:---|:---:|:---|
| **Santiago Castaño Guerrero** | Full Stack Developer | [@santiago](https://github.com/Santia2948329487) |
| **Emmanuel Galeano Martinez** | Full Stack Developer | [@emmanuel](https://github.com/Emmanuel333333333) |
| **David Andres Herrera** | Documentacion y FrontEnd Developer | [@david](https://github.com/David172082) |

</div>

---

## 📄 Licencia

<div align="center">

Este proyecto es de uso **académico y educativo** para el SENA.

```
MIT License - Uso Académico
Copyright (c) 2025 MotoConnect Team
```

</div>

---

## 🙏 Agradecimientos

<div align="center">

🎓 **SENA** - Por la formación y apoyo  
🏍️ **Comunidad de Motociclistas** - Por la inspiración  
🗺️ **OpenStreetMap & Leaflet** - Por los mapas interactivos  
🔐 **Clerk** - Por la autenticación robusta  
💻 **Open Source Community** - Por todas las librerías

</div>

---

## 🐛 Reportar Issues

> [!TIP]
> ¿Encontraste un bug o tienes una sugerencia?

Si encuentras algún problema o tienes sugerencias de mejora, por favor:

1. Verifica que no exista un issue similar
2. Abre un nuevo issue con una descripción detallada
3. Incluye pasos para reproducir el problema
4. Añade capturas de pantalla si es posible

---

## 📞 Contacto

<div align="center">

[![Email](https://img.shields.io/badge/Email-emmanuelgaleano43@gmail.com-red?style=for-the-badge&logo=gmail)](mailto:motoconnect@sena.edu.co)
[![GitHub](https://img.shields.io/badge/GitHub-MotoConnect-black?style=for-the-badge&logo=github)](https://github.com/Santia2948329487/MotoConnect.git)

</div>

---

<div align="center">

### ⭐ Si te gusta el proyecto, dale una estrella

**Hecho con ❤️ por moteros, para moteros** 🏍️

[![Made with Love](https://img.shields.io/badge/Made%20with-❤️-red?style=for-the-badge)](https://github.com)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org)
[![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com)

</div>