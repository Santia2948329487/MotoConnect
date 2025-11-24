// prisma/seedRoutes.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de rutas...');

  // 1. Crear o encontrar usuarios (necesitas tener usuarios primero)
  const user1 = await prisma.user.upsert({
    where: { email: 'rider1@motoconnect.com' },
    update: {},
    create: {
      clerkId: 'seed_user_1',
      name: 'Carlos Motero',
      email: 'rider1@motoconnect.com',
      role: 'USER',
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'rider2@motoconnect.com' },
    update: {},
    create: {
      clerkId: 'seed_user_2',
      name: 'Ana Aventurera',
      email: 'rider2@motoconnect.com',
      role: 'USER',
    },
  });

  const admin = await prisma.user.upsert({
    where: { email: 'admin@motoconnect.com' },
    update: {},
    create: {
      clerkId: 'seed_admin',
      name: 'Admin MotoConnect',
      email: 'admin@motoconnect.com',
      role: 'ADMIN',
    },
  });

  console.log('✅ Usuarios creados');

  // 2. Crear rutas realistas
  const ruta1 = await prisma.route.create({
    data: {
      name: 'Ruta del Café: Medellín - Jardín',
      description: 'Una de las rutas más hermosas de Antioquia. Atraviesa el paisaje cafetero con vistas espectaculares. Carretera en buen estado con curvas técnicas. Ideal para hacer el recorrido en un día. Paradas recomendadas: Pueblo Rico para almorzar y Andes para café.',
      distanceKm: 134,
      difficulty: 'Media',
      startPoint: 'Medellín, Antioquia',
      endPoint: 'Jardín, Antioquia',
      mapUrl: 'https://maps.google.com/?q=Medellin+to+Jardin',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
      creatorId: user1.id,
    },
  });

  const ruta2 = await prisma.route.create({
    data: {
      name: 'Laguna de Guatavita - Ruta Muisca',
      description: 'Ruta histórica que te lleva a la legendaria Laguna de Guatavita. Combina historia precolombina con paisajes de páramo. Carretera empinada con algunos tramos sin pavimentar. Lleva ropa abrigada. Duración: 4-5 horas ida y vuelta desde Bogotá.',
      distanceKm: 75,
      difficulty: 'Media',
      startPoint: 'Bogotá',
      endPoint: 'Guatavita, Cundinamarca',
      mapUrl: 'https://maps.google.com/?q=Bogota+to+Guatavita',
      image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800',
      creatorId: user2.id,
    },
  });

  const ruta3 = await prisma.route.create({
    data: {
      name: 'Vuelta al Oriente Antioqueño',
      description: 'Circuito completo por los pueblos patrimonio del oriente. Pasas por El Retiro, La Ceja, Rionegro, Marinilla y Guarne. Excelente para un fin de semana. Carretera en perfecto estado. Muchas opciones gastronómicas en el camino.',
      distanceKm: 156,
      difficulty: 'Fácil',
      startPoint: 'Medellín, Antioquia',
      endPoint: 'Medellín, Antioquia',
      mapUrl: 'https://maps.google.com/?q=Medellin+eastern+route',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
      creatorId: user1.id,
    },
  });

  const ruta4 = await prisma.route.create({
    data: {
      name: 'Desierto de la Tatacoa - Expedición',
      description: 'Ruta épica para los más aventureros. Atraviesas desde el páramo hasta el desierto. Cambios extremos de clima. Recomendado solo para motos trail o enduro. Lleva equipo de camping. Mínimo 3 días para disfrutarla bien.',
      distanceKm: 420,
      difficulty: 'Difícil',
      startPoint: 'Bogotá',
      endPoint: 'Villavieja, Huila',
      mapUrl: 'https://maps.google.com/?q=Bogota+to+Tatacoa+Desert',
      image: 'https://images.unsplash.com/photo-1504150558990-215a40e07b2e?w=800',
      creatorId: user2.id,
    },
  });

  const ruta5 = await prisma.route.create({
    data: {
      name: 'Costa Caribe: Santa Marta - Palomino',
      description: 'Ruta costera con vistas al mar. Carretera principalmente en buen estado. Calor intenso, lleva mucha agua. Paradas obligatorias: Playa Grande, Buritaca. Perfecto para combinar con días de playa. Duración: 2-3 horas.',
      distanceKm: 85,
      difficulty: 'Fácil',
      startPoint: 'Santa Marta, Magdalena',
      endPoint: 'Palomino, La Guajira',
      mapUrl: 'https://maps.google.com/?q=Santa+Marta+to+Palomino',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      creatorId: admin.id,
    },
  });

  console.log('✅ Rutas creadas');

  // 3. Crear reviews para las rutas
  await prisma.routeReview.createMany({
    data: [
      { routeId: ruta1.id, userId: user2.id, rating: 5, comment: 'Increíble ruta! Los paisajes son espectaculares. La carretera está en excelente estado.' },
      { routeId: ruta1.id, userId: admin.id, rating: 4, comment: 'Muy recomendada. Solo ten cuidado con la neblina en la mañana.' },
      { routeId: ruta2.id, userId: user1.id, rating: 4, comment: 'Hermosa pero exigente. Vale totalmente la pena.' },
      { routeId: ruta3.id, userId: user2.id, rating: 5, comment: 'Perfecta para principiantes. Pueblos hermosos y comida deliciosa.' },
      { routeId: ruta4.id, userId: user1.id, rating: 5, comment: 'La mejor aventura que he hecho en moto. No apta para todos.' },
      { routeId: ruta5.id, userId: user1.id, rating: 5, comment: 'Ruta relajada con vistas al mar. Ideal para desconectar.' },
    ],
  });

  console.log('✅ Reviews creadas');

  // 4. Crear talleres
  const taller1 = await prisma.workshop.create({
    data: {
      name: 'MotoTaller Medellín Centro',
      description: 'Taller especializado en motos deportivas y de alta cilindrada. 15 años de experiencia.',
      address: 'Cra. 43A #1-50, Medellín, Antioquia',
      phone: '+57 300 1234567',
      services: 'Mecánica general, pintura, eléctricos, repuestos originales',
      latitude: 6.25184,
      longitude: -75.56359,
      image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800',
      creatorId: admin.id,
    },
  });

  const taller2 = await prisma.workshop.create({
    data: {
      name: 'Serviteca La 33',
      description: 'Servicio rápido y confiable. Especialistas en mantenimiento preventivo.',
      address: 'Av. 33 #65-123, Medellín, Antioquia',
      phone: '+57 302 9876543',
      services: 'Cambio de aceite, frenos, suspensión, diagnóstico electrónico',
      latitude: 6.2442,
      longitude: -75.5812,
      image: 'https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=800',
      creatorId: admin.id,
    },
  });

  console.log('✅ Talleres creados');

  // 5. Crear comunidades
  const comunidad1 = await prisma.community.create({
    data: {
      name: 'Riders Antioquia',
      description: 'Comunidad de moteros paisas. Salidas semanales, eventos y rodadas organizadas.',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
      creatorId: user1.id,
    },
  });

  const comunidad2 = await prisma.community.create({
    data: {
      name: 'Aventureros Off-Road Colombia',
      description: 'Para los que aman el barro y la adrenalina. Rutas extremas cada mes.',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
      creatorId: user2.id,
    },
  });

  console.log('✅ Comunidades creadas');

  // 6. Crear posts en comunidades
  const post1 = await prisma.post.create({
    data: {
      title: 'Rodada a Guatapé este Domingo',
      content: 'Salimos 8 AM desde el Éxito de San Diego. Ruta: Medellín - Marinilla - El Peñol - Guatapé. Regreso 5 PM. Lleven documento, SOAT y gasolina. ¡Confirmen asistencia!',
      communityId: comunidad1.id,
      authorId: user1.id,
    },
  });

  await prisma.comment.createMany({
    data: [
      { postId: post1.id, authorId: user2.id, content: '¡Voy! ¿Hay parada para desayuno?' },
      { postId: post1.id, authorId: admin.id, content: 'Cuenta conmigo. Nos vemos allá.' },
    ],
  });

  console.log('✅ Posts y comentarios creados');

  console.log('🎉 Seed completado exitosamente!');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });