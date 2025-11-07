// src/app/page.tsx
// NO USAR 'use client' AQUÍ. Debe ser un Server Component.

import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function HomePage() {
  // 1. Obtiene el estado de autenticación en el SERVIDOR.
  const { userId } = await auth();

  if (userId) {
    // Si está logueado, redirige instantáneamente al feed de rutas.
    redirect('/routes');
  } else {
    // Si no está logueado, redirige al login.
    redirect('/login'); 
  }

  // Esto es para que el componente devuelva algo.
  return null; 
}