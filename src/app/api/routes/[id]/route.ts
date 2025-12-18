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
  waypoints: z.array(z.object({ 
    lat: z.number(), 
    lng: z.number(), 
    name: z.string().optional() 
  })).optional(),
});

// GET /api/routes/[id] - Obtener una ruta específica
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const route = await prisma.route.findUnique({
      where: { id },
      include: {
        creator: {
          select: {
            id: true,
            clerkId: true,
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

    return NextResponse.json({
      success: true,
      data: route
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
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

    // 2. Obtener el usuario
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

    // 3. Verificar que la ruta existe y pertenece al usuario
    const existingRoute = await prisma.route.findUnique({
      where: { id }
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

    if (existingRoute.creatorId !== user.id) {
      return NextResponse.json(
        {
          success: false,
          error: "No tienes permiso para editar esta ruta"
        },
        { status: 403 }
      );
    }

    // 4. Parsear y validar el body
    const body = await req.json();
    const validated = RouteUpdateSchema.parse(body);

    console.log('📝 Actualizando ruta:', id);
    console.log('📝 Datos nuevos:', validated);

    // 5. Actualizar la ruta
    const updatedRoute = await prisma.route.update({
      where: { id },
      data: {
        ...(validated.name && { name: validated.name }),
        ...(validated.description !== undefined && { description: validated.description || null }),
        ...(validated.distanceKm && { distanceKm: validated.distanceKm }),
        ...(validated.difficulty && { difficulty: validated.difficulty }),
        ...(validated.startPoint !== undefined && { startPoint: validated.startPoint || null }),
        ...(validated.endPoint !== undefined && { endPoint: validated.endPoint || null }),
        ...(validated.mapUrl !== undefined && { mapUrl: validated.mapUrl || null }),
        ...(validated.image !== undefined && { image: validated.image || null }),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ...(validated.waypoints && { waypoints: validated.waypoints as any }),
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

    console.log('✅ Ruta actualizada:', updatedRoute);

    return NextResponse.json({
      success: true,
      data: updatedRoute,
      message: "Ruta actualizada exitosamente"
    });

  } catch (error: unknown) {
    console.error('❌ Error actualizando ruta:', error);

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

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Error al actualizar la ruta"
      },
      { status: 500 }
    );
  }
}

// DELETE /api/routes/[id] - Eliminar una ruta
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
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

    // 2. Obtener el usuario
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

    // 3. Verificar que la ruta existe y pertenece al usuario
    const route = await prisma.route.findUnique({
      where: { id }
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

    if (route.creatorId !== user.id) {
      return NextResponse.json(
        {
          success: false,
          error: "No tienes permiso para eliminar esta ruta"
        },
        { status: 403 }
      );
    }

    // 4. Eliminar la ruta
    await prisma.route.delete({
      where: { id }
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