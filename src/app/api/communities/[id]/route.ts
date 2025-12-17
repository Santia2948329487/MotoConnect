// src/app/api/communities/[id]/route.ts
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const CommunityUpdateSchema = z.object({
  name: z.string().min(3).max(100).optional(),
  description: z.string().optional(),
  image: z.union([z.string().url(), z.literal("")]).optional(),
});

// GET /api/communities/[id]
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    const community = await prisma.community.findUnique({
      where: { id },
      include: {
        creator: {
          select: { id: true, name: true, email: true },
        },
        posts: {
          include: {
            author: { select: { id: true, name: true } },
            _count: { select: { comments: true } },
          },
          orderBy: { createdAt: "desc" },
          take: 10,
        },
      },
    });

    if (!community)
      return NextResponse.json(
        { success: false, error: "Comunidad no encontrada" },
        { status: 404 }
      );

    return NextResponse.json({
      success: true,
      data: {
        ...community,
        memberCount: Math.floor(Math.random() * 500) + 50,
        postCount: community.posts.length,
      },
    });
  } catch (error) {
    console.error("Error fetching community:", error);
    return NextResponse.json(
      { success: false, error: "Error al obtener la comunidad" },
      { status: 500 }
    );
  }
}

// PUT /api/communities/[id]
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json(
        { success: false, error: "No autorizado" },
        { status: 401 }
      );

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user)
      return NextResponse.json(
        { success: false, error: "Usuario no encontrado" },
        { status: 404 }
      );

    const existingCommunity = await prisma.community.findUnique({
      where: { id },
    });

    if (!existingCommunity)
      return NextResponse.json(
        { success: false, error: "Comunidad no encontrada" },
        { status: 404 }
      );

    if (existingCommunity.creatorId !== user.id && user.role !== "ADMIN")
      return NextResponse.json(
        { success: false, error: "No tienes permisos para editar esta comunidad" },
        { status: 403 }
      );

    const body = await req.json();
    const validated = CommunityUpdateSchema.parse(body);

    const updatedCommunity = await prisma.community.update({
      where: { id },
      data: validated,
      include: {
        creator: { select: { id: true, name: true, email: true } },
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedCommunity,
      message: "Comunidad actualizada exitosamente",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const details = error.issues.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));

      return NextResponse.json(
        { success: false, error: "Datos inválidos", details },
        { status: 400 }
      );
    }

    console.error("Error updating community:", error);
    return NextResponse.json(
      { success: false, error: "Error al actualizar la comunidad" },
      { status: 500 }
    );
  }
}

// DELETE /api/communities/[id]
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json(
        { success: false, error: "No autorizado" },
        { status: 401 }
      );

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user)
      return NextResponse.json(
        { success: false, error: "Usuario no encontrado" },
        { status: 404 }
      );

    const existingCommunity = await prisma.community.findUnique({ where: { id } });

    if (!existingCommunity)
      return NextResponse.json(
        { success: false, error: "Comunidad no encontrada" },
        { status: 404 }
      );

    if (existingCommunity.creatorId !== user.id && user.role !== "ADMIN")
      return NextResponse.json(
        { success: false, error: "No tienes permisos para eliminar esta comunidad" },
        { status: 403 }
      );

    const posts = await prisma.post.findMany({
      where: { communityId: id },
      select: { id: true },
    });

    const postIds = posts.map((p) => p.id);

    await prisma.comment.deleteMany({
      where: { postId: { in: postIds } },
    });

    await prisma.post.deleteMany({
      where: { communityId: id },
    });

    await prisma.community.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Comunidad eliminada exitosamente",
    });
  } catch (error) {
    console.error("Error deleting community:", error);
    return NextResponse.json(
      { success: false, error: "Error al eliminar la comunidad" },
      { status: 500 }
    );
  }
}
