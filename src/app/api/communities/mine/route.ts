import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ success: false, error: "No autorizado" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { clerkId: userId } });
    if (!user) return NextResponse.json({ success: true, data: [] });

    const memberships = await prisma.communityMember.findMany({
      where: { userId: user.id },
      include: { community: { include: { creator: true } } },
      orderBy: { joinedAt: "desc" },
    });

    const data = memberships.map((m) => ({
      id: m.community.id,
      name: m.community.name,
      description: m.community.description || "",
      image: m.community.image || "",
      creatorName: m.community.creator?.name || "Anónimo",
      joinedAt: m.joinedAt,
    }));

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("GET /api/communities/mine error:", err);
    return NextResponse.json({ success: false, error: "Error interno" }, { status: 500 });
  }
}
