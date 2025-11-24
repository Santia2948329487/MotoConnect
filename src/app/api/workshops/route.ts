// src/app/api/workshops/route.ts
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";
import { applyRateLimit, rateLimiters } from "@/lib/rateLimiter";

const prisma = new PrismaClient();

// Schema de validación
const WorkshopSchema = z.object({
  name: z.string().min(3).max(100),
  description: z.string().optional(),
  address: z.string().min(5),
  phone: z.string().optional(),
  services: z.string().optional(),
  image: z.union([z.string().url(), z.literal("")]).optional(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

// GET /api/workshops - Obtener todos los talleres
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    // Filtros opcionales por coordenadas (para buscar talleres cercanos)
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");
    const radius = parseFloat(searchParams.get("radius") || "50"); // km

    const workshops = await prisma.workshop.findMany({
      take: limit,
      skip: offset,
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        reviews: {
          select: {
            rating: true,
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    // Calcular rating promedio
    let workshopsWithRating = workshops.map(workshop => ({
      ...workshop,
      averageRating: workshop.reviews.length > 0
        ? workshop.reviews.reduce((acc, r) => acc + r.rating, 0) / workshop.reviews.length
        : 0,
      reviewCount: workshop.reviews.length
    }));

    // Si se proporcionan coordenadas, filtrar por distancia
    if (lat && lng) {
      const userLat = parseFloat(lat);
      const userLng = parseFloat(lng);

      workshopsWithRating = workshopsWithRating
        .map(workshop => ({
          ...workshop,
          distance: calculateDistance(
            userLat,
            userLng,
            workshop.latitude || 0,
            workshop.longitude || 0
          )
        }))
        .filter(workshop => workshop.distance <= radius)
        .sort((a, b) => a.distance - b.distance);
    }

    const total = await prisma.workshop.count();

    return NextResponse.json({
      success: true,
      data: workshopsWithRating,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    });

  } catch (error: unknown) {
    console.error("Error fetching workshops:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Error al obtener los talleres"
      },
      { status: 500 }
    );
  }
}

// POST /api/workshops - Crear un nuevo taller
export async function POST(req: Request) {
  // 🔒 APLICAR RATE LIMITING
  const rateLimitResult = applyRateLimit(req, rateLimiters.create);
  if (rateLimitResult) return rateLimitResult;

  try {
    // 1. Verificar autenticación
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: "No autorizado. Debes iniciar sesión."
        },
        { status: 401 }
      );
    }

    // 2. Obtener el usuario de la BD
    const user = await prisma.user.findUnique({
      where: { clerkId: userId }
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "Usuario no encontrado en la base de datos"
        },
        { status: 404 }
      );
    }

    // 3. Validar el body
    const body = await req.json();
    const validated = WorkshopSchema.parse(body);

    // 4. Crear el taller
    const workshop = await prisma.workshop.create({
      data: {
        name: validated.name,
        description: validated.description,
        address: validated.address,
        phone: validated.phone,
        services: validated.services,
        image: validated.image,
        latitude: validated.latitude,
        longitude: validated.longitude,
        creatorId: user.id
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    return NextResponse.json(
      {
        success: true,
        data: workshop,
        message: "Taller creado exitosamente"
      },
      { status: 201 }
    );

  } catch (error: unknown) {
    // Errores de validación de Zod
    if (error instanceof z.ZodError) {
      const errorDetails = error.issues.map((err: z.ZodIssue) => ({
        field: err.path.join("."),
        message: err.message
      }));
      
      return NextResponse.json(
        {
          success: false,
          error: "Datos inválidos",
          details: errorDetails
        },
        { status: 400 }
      );
    }

    console.error("Error creating workshop:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Error al crear el taller"
      },
      { status: 500 }
    );
  }
}

// Función auxiliar para calcular distancia entre dos puntos (fórmula de Haversine)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radio de la Tierra en km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}