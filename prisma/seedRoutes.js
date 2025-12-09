import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed for Routes...");

  // Obtener usuario para asignar como creador
  let user = await prisma.user.findFirst();

  if (!user) {
    user = await prisma.user.create({
      data: {
        clerkId: "seed_user_001",
        name: "Usuario Seed",
        email: "seed@example.com",
      },
    });
  }

  const routesData = [
    {
      name: "Medellín → Guatapé",
      description: "Ruta turística pasando por el Peñol.",
      distanceKm: 82,
      difficulty: "media",
      startPoint: "Medellín",
      endPoint: "Guatapé",
      image: "https://example.com/r1.jpg",
      mapUrl: "https://maps.google.com/...",
    },
    {
      name: "Medellín → Santa Fe de Antioquia",
      description: "Ruta rápida por el túnel de Occidente.",
      distanceKm: 56,
      difficulty: "fácil",
      startPoint: "Medellín",
      endPoint: "Santa Fe de Antioquia",
      image: "https://example.com/r2.jpg",
      mapUrl: "https://maps.google.com/...",
    },
    {
      name: "Rionegro → Llanogrande",
      description: "Ruta corta y tranquila.",
      distanceKm: 14,
      difficulty: "fácil",
      startPoint: "Rionegro",
      endPoint: "Llanogrande",
      image: "https://example.com/r3.jpg",
      mapUrl: "https://maps.google.com/...",
    },
    {
      name: "Medellín → Jardín",
      description: "Ruta larga con paisajes brutales.",
      distanceKm: 134,
      difficulty: "difícil",
      startPoint: "Medellín",
      endPoint: "Jardín",
      image: "https://example.com/r4.jpg",
      mapUrl: "https://maps.google.com/...",
    },
    {
      name: "Medellín → San Pedro de los Milagros",
      description: "Clima frío y ruta relajada.",
      distanceKm: 25,
      difficulty: "fácil",
      startPoint: "Medellín",
      endPoint: "San Pedro",
      image: "https://example.com/r5.jpg",
      mapUrl: "https://maps.google.com/...",
    },
    {
      name: "Envigado → El Retiro",
      description: "Ruta muy popular los fines de semana.",
      distanceKm: 28,
      difficulty: "media",
      startPoint: "Envigado",
      endPoint: "El Retiro",
      image: "https://example.com/r6.jpg",
      mapUrl: "https://maps.google.com/...",
    },
    {
      name: "Bello → San Félix",
      description: "Ideal para ver parapentes.",
      distanceKm: 18,
      difficulty: "media",
      startPoint: "Bello",
      endPoint: "San Félix",
      image: "https://example.com/r7.jpg",
      mapUrl: "https://maps.google.com/...",
    },
    {
      name: "Itagüí → La Catedral",
      description: "Subida exigente pero corta.",
      distanceKm: 12,
      difficulty: "difícil",
      startPoint: "Itagüí",
      endPoint: "La Catedral",
      image: "https://example.com/r8.jpg",
      mapUrl: "https://maps.google.com/...",
    },
    {
      name: "Medellín → Copacabana",
      description: "Ruta rápida, carretera principal.",
      distanceKm: 15,
      difficulty: "fácil",
      startPoint: "Medellín",
      endPoint: "Copacabana",
      image: "https://example.com/r9.jpg",
      mapUrl: "https://maps.google.com/...",
    },
    {
      name: "San Antonio de Prado → Heliconia",
      description: "Curvas y montaña pura.",
      distanceKm: 32,
      difficulty: "difícil",
      startPoint: "San Antonio de Prado",
      endPoint: "Heliconia",
      image: "https://example.com/r10.jpg",
      mapUrl: "https://maps.google.com/...",
    },
  ];

  for (const routeData of routesData) {
    const route = await prisma.route.create({
      data: {
        ...routeData,
        creatorId: user.id,
      },
    });

    // Añadir reviews
    await prisma.routeReview.createMany({
      data: [
        {
          rating: 5,
          comment: "Excelente ruta, recomendada!",
          routeId: route.id,
          userId: user.id,
        },
        {
          rating: 4,
          comment: "Muy buena pero con tráfico en algunos tramos.",
          routeId: route.id,
          userId: user.id,
        },
      ],
    });

    // Añadir comentarios
    await prisma.routeComment.createMany({
      data: [
        {
          content: "¿A qué hora recomiendan salir?",
          routeId: route.id,
          authorId: user.id,
        },
        {
          content: "Muy buena para ir los domingos.",
          routeId: route.id,
          authorId: user.id,
        },
      ],
    });
  }

  console.log("🌱 Routes seeding completed!");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
