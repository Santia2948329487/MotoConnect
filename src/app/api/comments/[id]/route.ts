// src/app/api/comments/[id]/route.ts
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const CommentUpdateSchema = z.object({
  content: z.string().min(1).max(500),
});

// PUT /api/comments/[id] - Actualizar un comentario
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

    // 3. Verificar que el comentario existe
    const existingComment = await prisma.comment.findUnique({
      where: { id: params.id }
    });

    if (!existingComment) {
      return NextResponse.json(
        {
          success: false,
          error: "Comentario no encontrado"
        },
        { status: 404 }
      );
    }

    // 4. Verificar permisos
    if (existingComment.authorId !== user.id && user.role !== "ADMIN") {
      return NextResponse.json(
        {
          success: false,
          error: "No tienes permisos para editar este comentario"
        },
        { status: 403 }
      );
    }

    // 5. Validar y actualizar
    const body = await req.json();
    const validated = CommentUpdateSchema.parse(body);

    const updatedComment = await prisma.comment.update({
      where: { id: params.id },
      data: { content: validated.content },
      include: {
        author: {
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
      data: updatedComment,
      message: "Comentario actualizado exitosamente"
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

    console.error("Error updating comment:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Error al actualizar el comentario"
      },
      { status: 500 }
    );
  }
}

// DELETE /api/comments/[id] - Eliminar un comentario
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

    // 3. Verificar que el comentario existe
    const existingComment = await prisma.comment.findUnique({
      where: { id: params.id }
    });

    if (!existingComment) {
      return NextResponse.json(
        {
          success: false,
          error: "Comentario no encontrado"
        },
        { status: 404 }
      );
    }

    // 4. Verificar permisos
    if (existingComment.authorId !== user.id && user.role !== "ADMIN") {
      return NextResponse.json(
        {
          success: false,
          error: "No tienes permisos para eliminar este comentario"
        },
        { status: 403 }
      );
    }

    // 5. Eliminar
    await prisma.comment.delete({
      where: { id: params.id }
    });

    return NextResponse.json({
      success: true,
      message: "Comentario eliminado exitosamente"
    });

  } catch (error: unknown) {
    console.error("Error deleting comment:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Error al eliminar el comentario"
      },
      { status: 500 }
    );
  }
}