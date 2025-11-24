// src/app/api/communities/route.ts
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";
import { applyRateLimit, rateLimiters } from "@/lib/rateLimiter";

const prisma = new PrismaClient();

// Schema de validación
const CommunitySchema = z.object({
  name: z.string().min(3).max(100),
  description: z.string().optional(),
  image: z.union([z.string().url(), z.literal("")]).optional(),
});

// GET /api/communities - Obtener todas las comunidades
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    const communities = await prisma.community.findMany({
      take: limit,
      skip: offset,
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        posts: {
          select: {
            id: true,
          }
        },
        _count: {
          select: {
            posts: true,
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    const total = await prisma.community.count();

    // Calcular número de miembros (por ahora, usaremos el creador + posts únicos)
    const communitiesWithStats = communities.map(community => ({
      ...community,
      memberCount: Math.floor(Math.random() * 500) + 50, // Simulado por ahora
      postCount: community._count.posts,
    }));

    return NextResponse.json({
      success: true,
      data: communitiesWithStats,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    });

  } catch (error: unknown) {
    console.error("Error fetching communities:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Error al obtener las comunidades"
      },
      { status: 500 }
    );
  }
}

// POST /api/communities - Crear una nueva comunidad
export async function POST(req: Request) {
  // 🔒 APLICAR RATE LIMITING
  const rateLimitResult = applyRateLimit(req, rateLimiters.create);
  if (rateLimitResult) return rateLimitResult;

  try {
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

    // 2. Obtener el usuario de la BD
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

    // 3. Validar el body
    const body = await req.json();
    const validated = CommunitySchema.parse(body);

    // 4. Crear la comunidad
    const community = await prisma.community.create({
      data: {
        name: validated.name,
        description: validated.description,
        image: validated.image,
        creatorId: user.id
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

    return NextResponse.json(
      {
        success: true,
        data: community,
        message: "Comunidad creada exitosamente"
      },
      { status: 201 }
    );

  } catch (error: unknown) {
    // Errores de validación de Zod
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

    // Errores de Prisma
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return NextResponse.json(
        {
          success: false,
          error: "Ya existe una comunidad con ese nombre"
        },
        { status: 409 }
      );
    }

    console.error("Error creating community:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Error al crear la comunidad"
      },
      { status: 500 }
    );
  }
}