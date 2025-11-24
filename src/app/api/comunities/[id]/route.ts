// src/app/api/communities/[id]/route.ts
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const CommunityUpdateSchema = z.object({
  name: z.string().min(3).max(100).optional(),
  description: z.string().optional(),
  image: z.union([z.string().url(), z.literal("")]).optional(),
});

// GET /api/communities/[id] - Obtener una comunidad específica
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const community = await prisma.community.findUnique({
      where: { id: params.id },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        posts: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
              }
            },
            _count: {
              select: {
                comments: true,
              }
            }
          },
          orderBy: {
            createdAt: "desc"
          },
          take: 10 // Solo los últimos 10 posts
        }
      }
    });

    if (!community) {
      return NextResponse.json(
        {
          success: false,
          error: "Comunidad no encontrada"
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        ...community,
        memberCount: Math.floor(Math.random() * 500) + 50, // Simulado
        postCount: community.posts.length
      }
    });

  } catch (error: unknown) {
    console.error("Error fetching community:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Error al obtener la comunidad"
      },
      { status: 500 }
    );
  }
}

// PUT /api/communities/[id] - Actualizar una comunidad
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

    // 3. Verificar que la comunidad existe
    const existingCommunity = await prisma.community.findUnique({
      where: { id: params.id }
    });

    if (!existingCommunity) {
      return NextResponse.json(
        {
          success: false,
          error: "Comunidad no encontrada"
        },
        { status: 404 }
      );
    }

    // 4. Verificar permisos (solo el creador o admin puede editar)
    if (existingCommunity.creatorId !== user.id && user.role !== "ADMIN") {
      return NextResponse.json(
        {
          success: false,
          error: "No tienes permisos para editar esta comunidad"
        },
        { status: 403 }
      );
    }

    // 5. Validar y actualizar
    const body = await req.json();
    const validated = CommunityUpdateSchema.parse(body);

    const updatedCommunity = await prisma.community.update({
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
      data: updatedCommunity,
      message: "Comunidad actualizada exitosamente"
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

    console.error("Error updating community:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Error al actualizar la comunidad"
      },
      { status: 500 }
    );
  }
}

// DELETE /api/communities/[id] - Eliminar una comunidad
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

    // 3. Verificar que la comunidad existe
    const existingCommunity = await prisma.community.findUnique({
      where: { id: params.id }
    });

    if (!existingCommunity) {
      return NextResponse.json(
        {
          success: false,
          error: "Comunidad no encontrada"
        },
        { status: 404 }
      );
    }

    // 4. Verificar permisos
    if (existingCommunity.creatorId !== user.id && user.role !== "ADMIN") {
      return NextResponse.json(
        {
          success: false,
          error: "No tienes permisos para eliminar esta comunidad"
        },
        { status: 403 }
      );
    }

    // 5. Eliminar comentarios de los posts
    const posts = await prisma.post.findMany({
      where: { communityId: params.id },
      select: { id: true }
    });

    const postIds = posts.map(p => p.id);

    await prisma.comment.deleteMany({
      where: { postId: { in: postIds } }
    });

    // 6. Eliminar posts de la comunidad
    await prisma.post.deleteMany({
      where: { communityId: params.id }
    });

    // 7. Eliminar la comunidad
    await prisma.community.delete({
      where: { id: params.id }
    });

    return NextResponse.json({
      success: true,
      message: "Comunidad eliminada exitosamente"
    });

  } catch (error: unknown) {
    console.error("Error deleting community:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Error al eliminar la comunidad"
      },
      { status: 500 }
    );
  }
}