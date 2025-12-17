// src/app/api/routes/[id]/comments/route.ts
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const CommentSchema = z.object({
  content: z.string().min(1).max(1000),
});

// ============================
// GET /api/routes/[id]/comments
// ============================
export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> } // <--- AQUÍ!
) {
  try {
    const { id } = await context.params;  // <--- AQUÍ!!

    const comments = await prisma.routeComment.findMany({
      where: { routeId: id },
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: comments,
    });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { success: false, error: "Error al obtener los comentarios" },
      { status: 500 }
    );
  }
}

// ============================
// POST /api/routes/[id]/comments
// ============================
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> } // <--- AQUÍ!
) {
  try {
    const { id } = await context.params; // <--- AQUÍ!!

    // Verificar usuario con Clerk
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "No autorizado. Debes iniciar sesión." },
        { status: 401 }
      );
    }

    // Usuario en DB
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Usuario no encontrado en la base de datos" },
        { status: 404 }
      );
    }

    // Verificar ruta
    const route = await prisma.route.findUnique({
      where: { id },
    });

    if (!route) {
      return NextResponse.json(
        { success: false, error: "Ruta no encontrada" },
        { status: 404 }
      );
    }

    // Validar body
    const body = await req.json();
    const validated = CommentSchema.parse(body);

    // Crear comentario
    const comment = await prisma.routeComment.create({
      data: {
        content: validated.content,
        routeId: id,
        authorId: user.id,
      },
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    // Incrementar XP por comentar
    await prisma.user.update({ where: { id: user.id }, data: { xp: { increment: 2 } } });

    return NextResponse.json(
      {
        success: true,
        data: comment,
        message: "Comentario publicado exitosamente",
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Datos inválidos", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Error creating comment:", error);
    return NextResponse.json(
      { success: false, error: "Error al crear el comentario" },
      { status: 500 }
    );
  }
}
