// prisma/seed.js
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed...')

  // Usuarios
  const santiago = await prisma.user.create({
    data: {
      name: 'Santiago Castaño',
      email: 'santiago@motoconnect.com',
      image: 'https://randomuser.me/api/portraits/men/1.jpg',
    },
  })

  const emmanuel = await prisma.user.create({
    data: {
      name: 'Emmanuel Torres',
      email: 'emmanuel@motoconnect.com',
      image: 'https://randomuser.me/api/portraits/men/2.jpg',
    },
  })

  const david = await prisma.user.create({
    data: {
      name: 'David Gómez',
      email: 'david@motoconnect.com',
      image: 'https://randomuser.me/api/portraits/men/3.jpg',
    },
  })

  // Comunidades
  const comunidad1 = await prisma.community.create({
    data: {
      name: 'Riders Medellín',
      description: 'Comunidad de moteros paisas que disfrutan las rutas de montaña 🏍️',
      image: 'https://images.unsplash.com/photo-1504215680853-026ed2a45def',
      creatorId: santiago.id,
    },
  })

  const comunidad2 = await prisma.community.create({
    data: {
      name: 'Speed Lovers Bogotá',
      description: 'Amantes de la velocidad y las buenas rodadas 🏁',
      image: 'https://images.unsplash.com/photo-1516117172878-fd2c41f4a759',
      creatorId: emmanuel.id,
    },
  })

  // Posts
  const post1 = await prisma.post.create({
    data: {
      title: 'Ruta a Guatapé este domingo',
      content: 'Nos reunimos a las 8 a.m. en el Éxito de San Diego. ¡Lleven gasolina y buena energía!',
      image: 'https://images.unsplash.com/photo-1535914254981-b5012eebbd15',
      authorId: santiago.id,
      communityId: comunidad1.id,
    },
  })

  const post2 = await prisma.post.create({
    data: {
      title: 'Rodada nocturna por la 26',
      content: 'Salida a las 9 p.m. desde el Parque Simón Bolívar. Casco reflectivo obligatorio.',
      image: 'https://images.unsplash.com/photo-1504215680853-026ed2a45def',
      authorId: emmanuel.id,
      communityId: comunidad2.id,
    },
  })

  // Comentarios
  await prisma.comment.createMany({
    data: [
      {
        content: '¡Allá estaré, hermano! 🔥',
        postId: post1.id,
        authorId: david.id,
      },
      {
        content: 'Buena esa, ¡no me lo pierdo!',
        postId: post2.id,
        authorId: santiago.id,
      },
    ],
  })

  console.log('✅ Seed completado exitosamente')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
