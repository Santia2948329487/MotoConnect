/* eslint-disable @typescript-eslint/no-explicit-any */
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}
const prisma = global.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== "production") global.prisma = prisma;

function internalError(err: unknown) {
  const isProd = process.env.NODE_ENV === "production";
  const msg = isProd ? "Error interno del servidor" : err instanceof Error ? err.message : String(err);
  return NextResponse.json({ error: msg }, { status: 500 });
}

export async function POST(
  _req: Request,
  context: { params: { id: string } | Promise<{ id: string }> }
) {
  try {
    const params = await (context.params as any);
    if (!params?.id) return NextResponse.json({ error: "Id de comunidad faltante" }, { status: 400 });

    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { clerkId: userId } });
    if (!user) return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });

    const community = await prisma.community.findUnique({ where: { id: params.id } });
    if (!community) return NextResponse.json({ error: "Comunidad no encontrada" }, { status: 404 });

    const existing = await prisma.communityMember.findFirst({
      where: { userId: user.id, communityId: params.id },
    });
    if (existing) return NextResponse.json({ success: true });

    await prisma.communityMember.create({
      data: { userId: user.id, communityId: params.id },
    });

    // Incrementar XP por unirse a una comunidad
    await prisma.user.update({ where: { id: user.id }, data: { xp: { increment: 3 } } });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("POST /api/communities/[id]/join error:", err);
    return internalError(err);
  }
}

export async function DELETE(
  _req: Request,
  context: { params: { id: string } | Promise<{ id: string }> }
) {
  try {
    const params = await (context.params as any);
    if (!params?.id) return NextResponse.json({ error: "Id de comunidad faltante" }, { status: 400 });

    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { clerkId: userId } });
    if (!user) return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });

    await prisma.communityMember.deleteMany({
      where: { userId: user.id, communityId: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/communities/[id]/join error:", err);
    return internalError(err);
  }
}