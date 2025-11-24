"use client";

import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { Users, MapPin, Wrench, TrendingUp, ChevronRight, Calendar, Star } from "lucide-react";

export default function DashboardPage() {
  const { user } = useUser();

  const stats = [
    { 
      icon: Users, 
      label: "Comunidades", 
      value: "0", 
      color: "from-blue-600 to-cyan-600",
      bgColor: "bg-blue-600",
      link: "/communities"
    },
    { 
      icon: MapPin, 
      label: "Rutas", 
      value: "0", 
      color: "from-red-600 to-orange-600",
      bgColor: "bg-red-600",
      link: "/routes"
    },
    { 
      icon: Wrench, 
      label: "Talleres", 
      value: "0", 
      color: "from-purple-600 to-pink-600",
      bgColor: "bg-purple-600",
      link: "/workshops"
    },
    { 
      icon: TrendingUp, 
      label: "Actividad", 
      value: "0", 
      color: "from-green-600 to-emerald-600",
      bgColor: "bg-green-600",
      link: "#"
    },
  ];

  const recentActivity = [
    {
      type: 'route',
      title: 'Nueva ruta agregada',
      description: 'Medellín - Guatapé',
      time: 'Hace 2 horas',
      icon: MapPin,
      color: 'text-red-500'
    },
    {
      type: 'community',
      title: 'Te uniste a una comunidad',
      description: 'Riders Antioquia',
      time: 'Hace 5 horas',
      icon: Users,
      color: 'text-blue-500'
    },
    {
      type: 'workshop',
      title: 'Nuevo taller guardado',
      description: 'MotoTaller Centro',
      time: 'Hace 1 día',
      icon: Wrench,
      color: 'text-purple-500'
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-950 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-white mb-2">
            Bienvenido, {user?.firstName}! 🏍️
          </h1>
          <p className="text-neutral-400">
            Conecta con moteros, comparte rutas y localiza talleres
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Link
                key={stat.label}
                href={stat.link}
                className="group relative bg-neutral-900 border-2 border-neutral-800 hover:border-red-600 rounded-xl p-6 transition-all duration-300 hover:scale-105 overflow-hidden"
              >
                {/* Gradient Background on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity`}></div>
                
                <div className="relative">
                  <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-neutral-400 text-sm mb-1">{stat.label}</p>
                  <p className="text-3xl font-black text-white">{stat.value}</p>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-black text-white mb-4">Acciones Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link 
              href="/communities" 
              className="group bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-4 px-6 rounded-lg transition-all hover:scale-105 flex items-center justify-between"
            >
              <span>Ver Comunidades</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href="/routes" 
              className="group bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-semibold py-4 px-6 rounded-lg transition-all hover:scale-105 flex items-center justify-between"
            >
              <span>Explorar Rutas</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href="/workshops" 
              className="group bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-4 px-6 rounded-lg transition-all hover:scale-105 flex items-center justify-between"
            >
              <span>Buscar Talleres</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Activity Feed - 2 columns */}
          <div className="lg:col-span-2">
            <div className="bg-neutral-900 border-2 border-neutral-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black text-white">Actividad Reciente</h2>
                <Calendar className="w-5 h-5 text-neutral-500" />
              </div>

              {recentActivity.length > 0 ? (
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => {
                    const Icon = activity.icon;
                    return (
                      <div
                        key={index}
                        className="flex items-start gap-4 p-4 bg-neutral-800/50 border border-neutral-700 rounded-lg hover:border-red-600/50 transition-colors"
                      >
                        <div className={`w-10 h-10 bg-neutral-800 rounded-lg flex items-center justify-center flex-shrink-0 ${activity.color}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-white mb-1">{activity.title}</h3>
                          <p className="text-sm text-neutral-400">{activity.description}</p>
                          <p className="text-xs text-neutral-500 mt-1">{activity.time}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <TrendingUp className="w-12 h-12 text-neutral-700 mx-auto mb-4" />
                  <p className="text-neutral-400">
                    No hay actividad reciente
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - 1 column */}
          <div className="space-y-6">
            {/* Profile Card */}
            <div className="bg-neutral-900 border-2 border-neutral-800 rounded-xl p-6">
              <div className="text-center mb-4">
                <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-3xl font-black text-white">
                    {user?.firstName?.[0]?.toUpperCase()}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white">{user?.firstName} {user?.lastName}</h3>
                <p className="text-sm text-neutral-400">{user?.emailAddresses[0]?.emailAddress}</p>
              </div>
              
              <div className="pt-4 border-t border-neutral-800 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-400">Nivel</span>
                  <span className="text-white font-semibold">Principiante</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-400">Puntos</span>
                  <span className="text-white font-semibold">0</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-400">Miembro desde</span>
                  <span className="text-white font-semibold">
                    {new Date(user?.createdAt || '').toLocaleDateString('es', { month: 'short', year: 'numeric' })}
                  </span>
                </div>
              </div>
            </div>

            {/* Featured Routes */}
            <div className="bg-neutral-900 border-2 border-neutral-800 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Rutas Destacadas</h3>
              <div className="space-y-3">
                {[
                  { name: 'Ruta del Café', rating: 4.8, distance: '134 km' },
                  { name: 'Laguna Guatavita', rating: 4.6, distance: '75 km' },
                  { name: 'Oriente Antioqueño', rating: 4.9, distance: '156 km' },
                ].map((route, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-neutral-800/50 rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer">
                    <div>
                      <p className="text-sm font-semibold text-white">{route.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                          <span className="text-xs text-neutral-400">{route.rating}</span>
                        </div>
                        <span className="text-xs text-neutral-500">•</span>
                        <span className="text-xs text-neutral-400">{route.distance}</span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-neutral-500" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}