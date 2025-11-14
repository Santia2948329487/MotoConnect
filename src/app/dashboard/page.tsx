"use client";

import Navbar from "@/components/Navbar";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { Users, MapPin, Wrench, TrendingUp } from "lucide-react";

export default function DashboardPage() {
  const { user } = useUser();

  const stats = [
    { icon: Users, label: "Comunidades", value: "0", color: "from-blue-500 to-cyan-500" },
    { icon: MapPin, label: "Rutas", value: "0", color: "from-purple-500 to-pink-500" },
    { icon: Wrench, label: "Talleres", value: "0", color: "from-orange-500 to-red-500" },
    { icon: TrendingUp, label: "Actividad", value: "0", color: "from-green-500 to-emerald-500" },
  ];

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              Bienvenido, {user?.firstName}! 🏍️
            </h1>
            <p className="text-slate-400">
              Conecta con moteros, comparte rutas y localiza talleres
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6"
                >
                  <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-slate-400 text-sm">{stat.label}</p>
                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                </div>
              );
            })}
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Acciones Rápidas</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/communities" className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold py-3 px-6 rounded-lg">
                Ver Comunidades
              </Link>
              <Link href="/routes" className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-3 px-6 rounded-lg">
                Explorar Rutas
              </Link>
              <Link href="/workshops" className="bg-gradient-to-r from-orange-600 to-red-600 text-white font-semibold py-3 px-6 rounded-lg">
                Buscar Talleres
              </Link>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Actividad Reciente</h2>
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-8 text-center">
              <p className="text-slate-400">
                Aquí aparecerán las actividades recientes
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}