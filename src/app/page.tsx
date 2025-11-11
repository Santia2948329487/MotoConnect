"use client";

import { useUser, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function HomePage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const { signOut } = useClerk();

  useEffect(() => {
    if (isLoaded && !user) {
      router.push("/auth/login");
    }
  }, [isLoaded, user, router]);

  if (!isLoaded) return <div>Cargando...</div>;

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Navbar */}
      <nav className="bg-slate-800 p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">MotoConnect</h1>
        <div className="flex gap-4 items-center">
          <span className="text-slate-300">Bienvenido, {user?.firstName}</span>
          <button
            onClick={() => signOut(() => router.push("/auth/login"))}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
          >
            Cerrar sesión
          </button>
        </div>
      </nav>

      {/* Contenido principal */}
      <div className="p-8">
        <h2 className="text-3xl font-bold text-white mb-8">Feed Principal</h2>
        <p className="text-slate-400">Aquí irá el feed de la red social...</p>
      </div>
    </div>
  );
}