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
  const msg = isProd ? "Error interno del servidor" : err instanceof Error ? `${err.message}\n${err.stack}` : String(err);
  return NextResponse.json({ error: msg }, { status: 500 });
}

export async function GET(
  _req: Request,
  { params }: { params: { id: string } | Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) return NextResponse.json({ error: "Id de comunidad faltante" }, { status: 400 });

    const posts = await prisma.post.findMany({
      where: { communityId: id },
      orderBy: { createdAt: "desc" },
      include: { author: { select: { name: true } } },
      take: 50,
    });

    const data = posts.map((p) => ({
      id: p.id,
      title: p.title ?? null,
      content: p.content,
      image: p.image ?? null,
      createdAt: p.createdAt,
      author: { name: p.author?.name ?? "Anónimo" },
    }));

    return NextResponse.json(data);
  } catch (err) {
    console.error("GET /api/communities/[id]/posts error:", err);
    return internalError(err);
  }
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } | Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) return NextResponse.json({ error: "Id de comunidad faltante" }, { status: 400 });

    const body = await req.json().catch(() => ({}));
    const content = (body?.content ?? "").toString().trim();
    if (!content) return NextResponse.json({ error: "Contenido vacío" }, { status: 400 });

    const titleRaw = (body?.title ?? "").toString().trim();
    const title = titleRaw || (content.length > 60 ? content.slice(0, 57).trim() + "..." : content);

    const image = (body?.image ?? body?.imageUrl ?? null) as string | null;

    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { clerkId: userId } });
    if (!user) return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });

    const community = await prisma.community.findUnique({ where: { id } });
    if (!community) return NextResponse.json({ error: "Comunidad no encontrada" }, { status: 404 });

    const post = await prisma.post.create({
      data: {
        title,
        content,
        image,
        communityId: id,
        authorId: user.id,
      },
      include: { author: { select: { name: true } } },
    });

    // Incrementar XP por crear un post
    await prisma.user.update({ where: { id: user.id }, data: { xp: { increment: 5 } } });

    const result = {
      id: post.id,
      title: post.title ?? null,
      content: post.content,
      image: post.image ?? null,
      createdAt: post.createdAt,
      author: { name: post.author?.name ?? "Anónimo" },
    };

    return NextResponse.json({ success: true, data: result }, { status: 201 });
  } catch (err) {
    console.error("POST /api/communities/[id]/posts error:", err);
    return internalError(err);
  }
}