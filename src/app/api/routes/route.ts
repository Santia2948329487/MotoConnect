// src/app/api/routes/route.ts
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";
import { applyRateLimit, rateLimiters } from "@/lib/rateLimiter";

const prisma = new PrismaClient();

// Schema de validación con Zod
const RouteSchema = z.object({
  name: z.string().min(3).max(100),
  description: z.string().optional(),
  distanceKm: z.number().positive(),
  difficulty: z.enum(["Fácil", "Media", "Difícil"]),
  startPoint: z.string().optional(),
  endPoint: z.string().optional(),
  mapUrl: z.union([z.string().url(), z.literal("")]).optional(),
  image: z.union([z.string().url(), z.literal("")]).optional(),
  waypoints: z.array(z.object({ lat: z.number(), lng: z.number(), name: z.string().optional() })).optional(),
});

// GET /api/routes - Obtener todas las rutas
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const difficulty = searchParams.get("difficulty");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    const where = difficulty ? { difficulty } : {};

    const routes = await prisma.route.findMany({
      where,
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
    const routesWithRating = routes.map(route => ({
      ...route,
      averageRating: route.reviews.length > 0
        ? route.reviews.reduce((acc, r) => acc + r.rating, 0) / route.reviews.length
        : 0,
      reviewCount: route.reviews.length
    }));

    const total = await prisma.route.count({ where });

    return NextResponse.json({
      success: true,
      data: routesWithRating,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    });

  } catch (error) {
    console.error("Error fetching routes:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Error al obtener las rutas"
      },
      { status: 500 }
    );
  }
}

// POST /api/routes - Crear una nueva ruta
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

    // 2. Parsear el body
    const body = await req.json();
    
    // 3. TODO: Verificar reCAPTCHA (opcional, ya que Clerk maneja la seguridad)
    // if (body.recaptchaToken) {
    //   const isValid = await verifyRecaptcha(body.recaptchaToken);
    //   if (!isValid) {
    //     return NextResponse.json(
    //       { success: false, error: "Verificación de reCAPTCHA falló" },
    //       { status: 400 }
    //     );
    //   }
    // }

    // 4. Obtener el usuario de la BD
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

    // 5. Validar el body
    const validated = RouteSchema.parse(body);

    // 6. Crear la ruta
    const route = await prisma.route.create({
      data: {
        name: validated.name,
        description: validated.description,
        distanceKm: validated.distanceKm,
        difficulty: validated.difficulty,
        startPoint: validated.startPoint,
        endPoint: validated.endPoint,
        mapUrl: validated.mapUrl,
        image: validated.image,
        waypoints: validated.waypoints || undefined,
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

    // Incrementar XP por crear una ruta
    await prisma.user.update({ where: { id: user.id }, data: { xp: { increment: 20 } } });

    return NextResponse.json(
      {
        success: true,
        data: route,
        message: "Ruta creada exitosamente"
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

    // Errores de Prisma (duplicados, constraints, etc)
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return NextResponse.json(
        {
          success: false,
          error: "Ya existe una ruta con ese nombre"
        },
        { status: 409 }
      );
    }

    console.error("Error creating route:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Error al crear la ruta"
      },
      { status: 500 }
    );
  }
}