// scripts/test-db.js
// Ejecuta: node scripts/test-db.js

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Verificando conexión a la base de datos...\n');

  try {
    // 1. Verificar conexión
    await prisma.$connect();
    console.log('✅ Conexión exitosa a PostgreSQL');
    console.log(`📍 Database: ${process.env.DATABASE_URL?.split('@')[1]?.split('/')[1] || 'unknown'}\n`);

    // 2. Contar usuarios
    const userCount = await prisma.user.count();
    console.log(`👥 Usuarios en DB: ${userCount}`);

    // 3. Listar usuarios
    if (userCount > 0) {
      const users = await prisma.user.findMany({
        take: 5,
        select: {
          id: true,
          clerkId: true,
          name: true,
          email: true,  
        }
      });
      console.log('\n📋 Primeros usuarios:');
      users.forEach(u => {
        console.log(`  - ${u.name} (${u.email}) [clerkId: ${u.clerkId}]`);
      });
    }

    // 4. Contar rutas
    const routeCount = await prisma.route.count();
    console.log(`\n🗺️  Rutas en DB: ${routeCount}`);

    // 5. Contar comunidades
    const communityCount = await prisma.community.count();
    console.log(`🏘️  Comunidades en DB: ${communityCount}`);

    // 6. Contar talleres
    const workshopCount = await prisma.workshop.count();
    console.log(`🔧 Talleres en DB: ${workshopCount}\n`);

    if (userCount === 0) {
      console.log('⚠️  No hay usuarios. Ejecuta: npm run seed:routes');
    } else {
      console.log('✅ Base de datos poblada correctamente');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();