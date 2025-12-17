// src/app/api/routes/[id]/route.ts
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const RouteUpdateSchema = z.object({
  name: z.string().min(3).max(100).optional(),
  description: z.string().optional(),
  distanceKm: z.number().positive().optional(),
  difficulty: z.enum(["Fácil", "Media", "Difícil"]).optional(),
  startPoint: z.string().optional(),
  endPoint: z.string().optional(),
  mapUrl: z.union([z.string().url(), z.literal("")]).optional(),
  image: z.union([z.string().url(), z.literal("")]).optional(),
  waypoints: z.array(z.object({ lat: z.number(), lng: z.number(), name: z.string().optional() })).optional(),
});

// GET /api/routes/[id] - Obtener una ruta específica
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params; // ← CORRECTO: await params
    const route = await prisma.route.findUnique({
      where: { id },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              }
            }
          },
          orderBy: {
            createdAt: "desc"
          }
        }
      }
    });

    if (!route) {
      return NextResponse.json(
        {
          success: false,
          error: "Ruta no encontrada"
        },
        { status: 404 }
      );
    }

    // Calcular rating promedio
    const averageRating = route.reviews.length > 0
      ? route.reviews.reduce((acc, r) => acc + r.rating, 0) / route.reviews.length
      : 0;

    return NextResponse.json({
      success: true,
      data: {
        ...route,
        averageRating,
        reviewCount: route.reviews.length
      }
    });

  } catch (error) {
    console.error("Error fetching route:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Error al obtener la ruta"
      },
      { status: 500 }
    );
  }
}

// PUT /api/routes/[id] - Actualizar una ruta
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // 1. Verificar autenticación
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: "No autorizado"
        },
        { status: 401 }
      );
    }

    // 2. Obtener usuario
    const user = await prisma.user.findUnique({
      where: { clerkId: userId }
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "Usuario no encontrado"
        },
        { status: 404 }
      );
    }

    // 3. Verificar que la ruta existe
    const existingRoute = await prisma.route.findUnique({
      where: { id: params.id }
    });

    if (!existingRoute) {
      return NextResponse.json(
        {
          success: false,
          error: "Ruta no encontrada"
        },
        { status: 404 }
      );
    }

    // 4. Verificar permisos (solo el creador o admin puede editar)
    if (existingRoute.creatorId !== user.id && user.role !== "ADMIN") {
      return NextResponse.json(
        {
          success: false,
          error: "No tienes permisos para editar esta ruta"
        },
        { status: 403 }
      );
    }

    // 5. Validar y actualizar
    const body = await req.json();
    const validated = RouteUpdateSchema.parse(body);

    const updatedRoute = await prisma.route.update({
      where: { id: params.id },
      data: validated,
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

    return NextResponse.json({
      success: true,
      data: updatedRoute,
      message: "Ruta actualizada exitosamente"
    });

  } catch (error: unknown) {
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

    console.error("Error updating route:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Error al actualizar la ruta"
      },
      { status: 500 }
    );
  }
}

// DELETE /api/routes/[id] - Eliminar una ruta
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // 1. Verificar autenticación
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: "No autorizado"
        },
        { status: 401 }
      );
    }

    // 2. Obtener usuario
    const user = await prisma.user.findUnique({
      where: { clerkId: userId }
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "Usuario no encontrado"
        },
        { status: 404 }
      );
    }

    // 3. Verificar que la ruta existe
    const existingRoute = await prisma.route.findUnique({
      where: { id: params.id }
    });

    if (!existingRoute) {
      return NextResponse.json(
        {
          success: false,
          error: "Ruta no encontrada"
        },
        { status: 404 }
      );
    }

    // 4. Verificar permisos
    if (existingRoute.creatorId !== user.id && user.role !== "ADMIN") {
      return NextResponse.json(
        {
          success: false,
          error: "No tienes permisos para eliminar esta ruta"
        },
        { status: 403 }
      );
    }

    // 5. Eliminar reviews asociadas primero (cascade)
    await prisma.routeReview.deleteMany({
      where: { routeId: params.id }
    });

    // 6. Eliminar la ruta
    await prisma.route.delete({
      where: { id: params.id }
    });

    return NextResponse.json({
      success: true,
      message: "Ruta eliminada exitosamente"
    });

  } catch (error) {
    console.error("Error deleting route:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Error al eliminar la ruta"
      },
      { status: 500 }
    );
  }
}