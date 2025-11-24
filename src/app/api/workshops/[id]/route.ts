// src/app/api/workshops/[id]/route.ts
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const WorkshopUpdateSchema = z.object({
  name: z.string().min(3).max(100).optional(),
  description: z.string().optional(),
  address: z.string().min(5).optional(),
  phone: z.string().optional(),
  services: z.string().optional(),
  image: z.union([z.string().url(), z.literal("")]).optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
});

// GET /api/workshops/[id] - Obtener un taller específico
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const workshop = await prisma.workshop.findUnique({
      where: { id: params.id },
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

    if (!workshop) {
      return NextResponse.json(
        {
          success: false,
          error: "Taller no encontrado"
        },
        { status: 404 }
      );
    }

    // Calcular rating promedio
    const averageRating = workshop.reviews.length > 0
      ? workshop.reviews.reduce((acc, r) => acc + r.rating, 0) / workshop.reviews.length
      : 0;

    return NextResponse.json({
      success: true,
      data: {
        ...workshop,
        averageRating,
        reviewCount: workshop.reviews.length
      }
    });

  } catch (error: unknown) {
    console.error("Error fetching workshop:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Error al obtener el taller"
      },
      { status: 500 }
    );
  }
}

// PUT /api/workshops/[id] - Actualizar un taller
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

    // 3. Verificar que el taller existe
    const existingWorkshop = await prisma.workshop.findUnique({
      where: { id: params.id }
    });

    if (!existingWorkshop) {
      return NextResponse.json(
        {
          success: false,
          error: "Taller no encontrado"
        },
        { status: 404 }
      );
    }

    // 4. Verificar permisos (solo el creador o admin puede editar)
    if (existingWorkshop.creatorId !== user.id && user.role !== "ADMIN") {
      return NextResponse.json(
        {
          success: false,
          error: "No tienes permisos para editar este taller"
        },
        { status: 403 }
      );
    }

    // 5. Validar y actualizar
    const body = await req.json();
    const validated = WorkshopUpdateSchema.parse(body);

    const updatedWorkshop = await prisma.workshop.update({
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
      data: updatedWorkshop,
      message: "Taller actualizado exitosamente"
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

    console.error("Error updating workshop:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Error al actualizar el taller"
      },
      { status: 500 }
    );
  }
}

// DELETE /api/workshops/[id] - Eliminar un taller
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

    // 3. Verificar que el taller existe
    const existingWorkshop = await prisma.workshop.findUnique({
      where: { id: params.id }
    });

    if (!existingWorkshop) {
      return NextResponse.json(
        {
          success: false,
          error: "Taller no encontrado"
        },
        { status: 404 }
      );
    }

    // 4. Verificar permisos
    if (existingWorkshop.creatorId !== user.id && user.role !== "ADMIN") {
      return NextResponse.json(
        {
          success: false,
          error: "No tienes permisos para eliminar este taller"
        },
        { status: 403 }
      );
    }

    // 5. Eliminar reviews asociadas
    await prisma.workshopReview.deleteMany({
      where: { workshopId: params.id }
    });

    // 6. Eliminar el taller
    await prisma.workshop.delete({
      where: { id: params.id }
    });

    return NextResponse.json({
      success: true,
      message: "Taller eliminado exitosamente"
    });

  } catch (error: unknown) {
    console.error("Error deleting workshop:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Error al eliminar el taller"
      },
      { status: 500 }
    );
  }
}