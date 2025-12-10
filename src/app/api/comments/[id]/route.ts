// src/app/api/comments/[id]/route.ts
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const CommentUpdateSchema = z.object({
  content: z.string().min(1).max(500),
});


// ✅ Next.js 16: params es una PROMESA
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ success: false, error: "No autorizado" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json({ success: false, error: "Usuario no encontrado" }, { status: 404 });
    }

    const existingComment = await prisma.comment.findUnique({
      where: { id },
    });

    if (!existingComment) {
      return NextResponse.json({ success: false, error: "Comentario no encontrado" }, { status: 404 });
    }

    if (existingComment.authorId !== user.id && user.role !== "ADMIN") {
      return NextResponse.json({ success: false, error: "No tienes permisos" }, { status: 403 });
    }

    const body = await req.json();
    const validated = CommentUpdateSchema.parse(body);

    const updatedComment = await prisma.comment.update({
      where: { id },
      data: { content: validated.content },
      include: { author: true },
    });

    return NextResponse.json({
      success: true,
      data: updatedComment,
      message: "Comentario actualizado exitosamente",
    });

  } catch (error: unknown) {
    console.error("Error updating comment:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Datos inválidos", details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Error al actualizar el comentario" },
      { status: 500 }
    );
  }
}


// DELETE — también corregido
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ success: false, error: "No autorizado" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json({ success: false, error: "Usuario no encontrado" }, { status: 404 });
    }

    const existingComment = await prisma.comment.findUnique({
      where: { id },
    });

    if (!existingComment) {
      return NextResponse.json({ success: false, error: "Comentario no encontrado" }, { status: 404 });
    }

    if (existingComment.authorId !== user.id && user.role !== "ADMIN") {
      return NextResponse.json({ success: false, error: "No tienes permisos" }, { status: 403 });
    }

    await prisma.comment.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Comentario eliminado exitosamente",
    });

  } catch (error) {
    console.error("Error deleting comment:", error);
    return NextResponse.json(
      { success: false, error: "Error al eliminar el comentario" },
      { status: 500 }
    );
  }
}
