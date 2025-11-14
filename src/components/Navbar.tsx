"use client";

import { useState } from "react";
import Link from "next/link";
import { useUser, useClerk } from "@clerk/nextjs";
import { Menu, X, Zap, LogOut, User } from "lucide-react";
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
    <nav className="fixed top-0 w-full bg-slate-900/95 backdrop-blur-xl border-b border-slate-700/50 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="hidden sm:inline text-xl font-bold text-white">MotoConnect</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-slate-300 hover:text-white transition"
            >
              Dashboard
            </Link>
            <Link
              href="/communities"
              className="text-slate-300 hover:text-white transition"
            >
              Comunidades
            </Link>
            <Link
              href="/routes"
              className="text-slate-300 hover:text-white transition"
            >
              Rutas
            </Link>
            <Link
              href="/workshops"
              className="text-slate-300 hover:text-white transition"
            >
              Talleres
            </Link>
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">
                  {user?.firstName?.[0]?.toUpperCase()}
                </span>
              </div>
              <span className="text-sm text-slate-300">{user?.firstName}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600/20 hover:bg-red-600/30 border border-red-500/50 text-red-400 hover:text-red-300 transition text-sm"
            >
              <LogOut className="w-4 h-4" />
              Salir
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 hover:bg-slate-800 rounded-lg transition"
          >
            {isOpen ? (
              <X className="w-6 h-6 text-white" />
            ) : (
              <Menu className="w-6 h-6 text-white" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-3 border-t border-slate-700/50 pt-4">
            <Link
              href="/"
              className="block px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition"
              onClick={() => setIsOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              href="/communities"
              className="block px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition"
              onClick={() => setIsOpen(false)}
            >
              Comunidades
            </Link>
            <Link
              href="/routes"
              className="block px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition"
              onClick={() => setIsOpen(false)}
            >
              Rutas
            </Link>
            <Link
              href="/workshops"
              className="block px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition"
              onClick={() => setIsOpen(false)}
            >
              Talleres
            </Link>
            <button
              onClick={() => {
                handleLogout();
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-red-600/20 rounded-lg transition"
            >
              <LogOut className="w-4 h-4" />
              Salir
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}