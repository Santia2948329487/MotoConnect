import { PrismaClient, Role } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // --- USERS ---
  const admin = await prisma.user.create({
    data: {
      clerkId: "clerk_admin_001",
      name: "Admin User",
      email: "admin@example.com",
      role: Role.ADMIN,
    },
  });

  const user = await prisma.user.create({
    data: {
      clerkId: "clerk_user_001",
      name: "Juan Pérez",
      email: "juan@example.com",
    },
  });

  // --- COMMUNITY ---
  const community = await prisma.community.create({
    data: {
      name: "Moteros Medellín",
      description: "Comunidad para amantes de las motos en Medellín",
      image: "https://example.com/community.jpg",
      creatorId: admin.id,
    },
  });

  // --- POST ---
  const post = await prisma.post.create({
    data: {
      title: "Nueva rodada este domingo",
      content: "Nos reunimos en el Pueblito Paisa a las 10 am.",
      image: "https://example.com/post.jpg",
      communityId: community.id,
      authorId: admin.id,
    },
  });

  // --- COMMENT ---
  await prisma.comment.createMany({
    data: [
      {
        content: "¡De una! Allá estaré 🔥",
        postId: post.id,
        authorId: user.id,
      },
      {
        content: "Perfecto, llevo la GoPro 😎",
        postId: post.id,
        authorId: admin.id,
      },
    ],
  });

  // --- ROUTE ---
  const route = await prisma.route.create({
    data: {
      name: "Medellín → Guatapé",
      description: "Ruta perfecta para disfrutar paisajes.",
      difficulty: "media",
      distanceKm: 82.5,
      startPoint: "Medellín",
      endPoint: "Guatapé",
      image: "https://example.com/route.jpg",
      mapUrl: "https://maps.google.com/...",
      creatorId: admin.id,
    },
  });

  // --- ROUTE REVIEWS ---
  await prisma.routeReview.createMany({
    data: [
      {
        rating: 5,
        comment: "Una chimba de ruta!",
        routeId: route.id,
        userId: user.id,
      },
      {
        rating: 4,
        comment: "Muy buena pero tráfico pesado.",
        routeId: route.id,
        userId: admin.id,
      },
    ],
  });

  // --- ROUTE COMMENTS ---
  await prisma.routeComment.createMany({
    data: [
      {
        content: "¿A qué hora salen normalmente?",
        routeId: route.id,
        authorId: user.id,
      },
      {
        content: "Generalmente 8am, parce.",
        routeId: route.id,
        authorId: admin.id,
      },
    ],
  });

  // --- WORKSHOP ---
  const workshop = await prisma.workshop.create({
    data: {
      name: "Moto Taller El Rápido",
      description: "Servicios de mecánica general",
      address: "Cra 45 #30-21 Medellín",
      phone: "3011234567",
      services: "Mecánica, eléctricos, pintura",
      image: "https://example.com/workshop.jpg",
      latitude: 6.2442,
      longitude: -75.5812,
      creatorId: admin.id,
    },
  });

  // --- WORKSHOP REVIEWS ---
  await prisma.workshopReview.createMany({
    data: [
      {
        rating: 5,
        comment: "Excelente servicio, muy recomendado!",
        workshopId: workshop.id,
        userId: user.id,
      },
      {
        rating: 4,
        comment: "Buen trabajo pero se demoraron.",
        workshopId: workshop.id,
        userId: admin.id,
      },
    ],
  });

  console.log("🌱 Seed completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
