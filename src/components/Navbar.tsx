// src/components/Navbar.tsx - Actualizar con estilo rojo
"use client";

import { useState } from "react";
import Link from "next/link";
import { useUser, useClerk } from "@clerk/nextjs";
import { Menu, X, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await signOut(() => router.push("/auth/login"));
  };

  return (
    <nav className="fixed top-0 w-full bg-neutral-950/95 backdrop-blur-xl border-b border-neutral-800 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition">
            <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L4 7v10l8 5 8-5V7l-8-5z"/>
              </svg>
            </div>
            <span className="hidden sm:inline text-xl font-bold text-white">MotoConnect</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/dashboard" className="text-neutral-300 hover:text-white transition">
              Dashboard
            </Link>
            <Link href="/communities" className="text-neutral-300 hover:text-white transition">
              Comunidades
            </Link>
            <Link href="/routes" className="text-neutral-300 hover:text-white transition">
              Rutas
            </Link>
            <Link href="/workshops" className="text-neutral-300 hover:text-white transition">
              Talleres
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-800/50 border border-neutral-700/50">
              <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">
                  {user?.firstName?.[0]?.toUpperCase()}
                </span>
              </div>
              <span className="text-sm text-neutral-300">{user?.firstName}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600/20 hover:bg-red-600/30 border border-red-500/50 text-red-400 hover:text-red-300 transition text-sm"
            >
              <LogOut className="w-4 h-4" />
              Salir
            </button>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 hover:bg-neutral-800 rounded-lg transition"
          >
            {isOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden pb-4 space-y-3 border-t border-neutral-700/50 pt-4">
            <Link href="/dashboard" className="block px-4 py-2 text-neutral-300 hover:text-white hover:bg-neutral-800 rounded-lg transition" onClick={() => setIsOpen(false)}>
              Dashboard
            </Link>
            <Link href="/communities" className="block px-4 py-2 text-neutral-300 hover:text-white hover:bg-neutral-800 rounded-lg transition" onClick={() => setIsOpen(false)}>
              Comunidades
            </Link>
            <Link href="/routes" className="block px-4 py-2 text-neutral-300 hover:text-white hover:bg-neutral-800 rounded-lg transition" onClick={() => setIsOpen(false)}>
              Rutas
            </Link>
            <Link href="/workshops" className="block px-4 py-2 text-neutral-300 hover:text-white hover:bg-neutral-800 rounded-lg transition" onClick={() => setIsOpen(false)}>
              Talleres
            </Link>
            <button onClick={() => { handleLogout(); setIsOpen(false); }} className="w-full flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-red-600/20 rounded-lg transition">
              <LogOut className="w-4 h-4" />
              Salir
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}