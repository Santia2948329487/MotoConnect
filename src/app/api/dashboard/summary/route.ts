import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ success: false, error: "No autorizado" }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { clerkId: userId } });
    if (!user) return NextResponse.json({ success: false, data: {} });

    // Totales generales (para tarjetas)
    const [totalCommunities, totalRoutes, totalWorkshops] = await Promise.all([
      prisma.community.count(),
      prisma.route.count(),
      prisma.workshop.count(),
    ]);

    // Actividad reciente del usuario: posts, rutas creadas, talleres creados, joins
    const [posts, routes, workshops, joins, comments, communitiesCreated] = await Promise.all([
      prisma.post.findMany({ where: { authorId: user.id }, orderBy: { createdAt: 'desc' }, take: 5 }),
      prisma.route.findMany({ where: { creatorId: user.id }, orderBy: { createdAt: 'desc' }, take: 5 }),
      prisma.workshop.findMany({ where: { creatorId: user.id }, orderBy: { createdAt: 'desc' }, take: 5 }),
      prisma.communityMember.findMany({ where: { userId: user.id }, include: { community: true }, orderBy: { joinedAt: 'desc' }, take: 5 }),
      prisma.comment.findMany({ where: { authorId: user.id }, orderBy: { createdAt: 'desc' }, take: 5 }),
      prisma.community.findMany({ where: { creatorId: user.id }, orderBy: { createdAt: 'desc' }, take: 5 }),
    ]);

    // Contadores totales por tipo del usuario (para logros y XP real)
    const [postsCount, routesCount, workshopsCount, joinsCount, commentsCount, communitiesCreatedCount] = await Promise.all([
      prisma.post.count({ where: { authorId: user.id } }),
      prisma.route.count({ where: { creatorId: user.id } }),
      prisma.workshop.count({ where: { creatorId: user.id } }),
      prisma.communityMember.count({ where: { userId: user.id } }),
      prisma.comment.count({ where: { authorId: user.id } }),
      prisma.community.count({ where: { creatorId: user.id } }),
    ]);

    // Normalize activity entries and merge by date
    type Activity = { type: string; title: string; description?: string; createdAt: Date };
    const activities: Activity[] = [];

    posts.forEach(p => activities.push({ type: 'post', title: `Publicaste en ${p.communityId || 'una comunidad'}`, description: p.title || p.content?.slice(0, 80) || '', createdAt: p.createdAt } as Activity));
    routes.forEach(r => activities.push({ type: 'route', title: `Creaste una ruta: ${r.name}`, createdAt: r.createdAt } as Activity));
    workshops.forEach(w => activities.push({ type: 'workshop', title: `Creaste un taller: ${w.name}`, createdAt: w.createdAt } as Activity));
    joins.forEach(j => activities.push({ type: 'joined', title: `Te uniste a ${j.community.name}`, createdAt: j.joinedAt } as Activity));
    comments.forEach(c => activities.push({ type: 'comment', title: `Comentaste: ${c.content?.slice(0,60)}`, createdAt: c.createdAt } as Activity));

    activities.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    const recentActivity = activities.slice(0, 6).map(a => ({ type: a.type, title: a.title, description: a.description || '', createdAt: a.createdAt }));

    // Calcular XP real a partir de contadores totales (weights)
    const xp = (postsCount * 5) + (routesCount * 20) + (workshopsCount * 15) + (joinsCount * 3) + (commentsCount * 2) + (communitiesCreatedCount * 10);

    // Definir niveles, nombres y logros
    const levels = [0, 50, 150, 400, 1000]; // XP thresholds
    const levelNames = ['Principiante', 'Motero', 'Motero Experimentado', 'Veterano', 'Leyenda'];
    let level = 0;
    for (let i = 0; i < levels.length; i++) if (xp >= levels[i]) level = i;

    const achievements = [
      { key: 'first_route', label: 'Primera Ruta', earned: routesCount > 0 },
      { key: 'first_post', label: 'Primer Post', earned: postsCount > 0 },
      { key: 'first_comment', label: 'Primer Comentario', earned: commentsCount > 0 },
      { key: 'social', label: 'Social', earned: joinsCount >= 1 },
      { key: 'joined_3', label: 'Social Plus (3 comunidades)', earned: joinsCount >= 3 },
      { key: 'first_workshop', label: 'Creador de Taller', earned: workshopsCount > 0 },
    ];

    return NextResponse.json({
      success: true,
      data: {
        totals: { communities: totalCommunities, routes: totalRoutes, workshops: totalWorkshops },
        recentActivity,
        xp,
        level,
        levels,
        achievements,
      }
    });

  } catch (err) {
    console.error('GET /api/dashboard/summary error:', err);
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 });
  }
}
