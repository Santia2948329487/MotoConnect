"use client";

import { useUser, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Users, MapPin, Wrench, TrendingUp, ChevronRight, Calendar, Star, LogOut, Award, Zap, Target } from "lucide-react";
import { fetchUserCommunities } from "@/services/communityService";
import { fetchDashboardSummary } from "@/services/dashboardService";
import { fetchAllRoutes } from "@/services/routeService";
import type { DashboardSummary } from "@/services/dashboardService";
import type { Community } from "@/types/community";
import type { Route as RouteType } from "@/types/route";

export default function DashboardPage() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  const [userCommunities, setUserCommunities] = useState<Community[]>([]);
  const [userCommunitiesCount, setUserCommunitiesCount] = useState<number>(0);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [featuredRoutes, setFeaturedRoutes] = useState<RouteType[]>([]);


  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const data = await fetchUserCommunities();
        if (!mounted) return;
        setUserCommunities(data);
        setUserCommunitiesCount(data.length);
      } catch (err) {
        console.error("Error loading user communities:", err);
      }
    }
    load();
    return () => { mounted = false };
  }, []);

  useEffect(() => {
    let mounted = true;
    async function loadSummary() {
      try {
        const s = await fetchDashboardSummary();
        if (!mounted) return;
        setSummary(s);
      } catch (err) {
        console.error('Error loading dashboard summary:', err);
      }
    }
    loadSummary();
    return () => { mounted = false };
  }, []);

  useEffect(() => {
    let mounted = true;
    async function loadFeatured() {
      try {
        const routes = await fetchAllRoutes({ limit: 3, offset: 0 });
        if (!mounted) return;
        setFeaturedRoutes(routes.slice(0, 3));
      } catch (err) {
        console.error('Error loading featured routes:', err);
      }
    }
    loadFeatured();
    return () => { mounted = false };
  }, []);

  const stats = [
    { 
      icon: Users, 
      label: "Comunidades", 
      value: "0", 
      link: "/communities"
    },
    { 
      icon: MapPin, 
      label: "Rutas", 
      value: "0", 
      link: "/routes"
    },
    { 
      icon: Wrench, 
      label: "Talleres", 
      value: "0", 
      link: "/workshops"
    },
    { 
      icon: TrendingUp, 
      label: "Actividad", 
      value: "0", 
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
    },
    {
      type: 'community',
      title: 'Te uniste a una comunidad',
      description: 'Riders Antioquia',
      time: 'Hace 5 horas',
      icon: Users,
    },
    {
      type: 'workshop',
      title: 'Nuevo taller guardado',
      description: 'MotoTaller Centro',
      time: 'Hace 1 día',
      icon: Wrench,
    },
  ];

  const achievements = [
    { icon: Award, label: 'Primera Ruta', earned: true },
    { icon: Users, label: 'Social', earned: true },
    { icon: Target, label: '10 Rutas', earned: false },
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      {/* Hero Header with Motorcycle Background */}
      <div className="relative overflow-hidden border-b border-neutral-800">
        {/* Background Motorcycle Image */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?q=80&w=2070&auto=format&fit=crop" 
            alt="Motorcycle background"
            className="w-full h-full object-cover object-center"
          />
          {/* Dark overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-black/85 to-red-950/70"></div>
          {/* Additional texture overlay */}
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgb(239, 68, 68) 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
          <div className="flex items-start justify-between mb-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 bg-red-600/10 border border-red-600/20 rounded-full px-4 py-2">
                <Zap className="w-4 h-4 text-red-500" />
                <span className="text-sm font-semibold text-red-400">Dashboard Activo</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-black leading-tight">
                Bienvenido,<br />
                <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                  {user?.firstName}! 🏍️
                </span>
              </h1>
              
              <p className="text-lg text-neutral-300 max-w-2xl">
                Conecta con moteros, comparte rutas épicas y localiza los mejores talleres mecánicos
              </p>
            </div>
            
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 bg-neutral-900 hover:bg-red-600 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 border-2 border-neutral-800 hover:border-red-600 group"
            >
              <LogOut className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              <span className="hidden sm:inline">Cerrar Sesión</span>
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Link
                  key={stat.label}
                  href={stat.link}
                  className="group relative bg-neutral-900/50 backdrop-blur-sm border-2 border-neutral-800 hover:border-red-600 rounded-xl p-6 transition-all duration-300 hover:scale-105 overflow-hidden"
                >
                  {/* Animated gradient on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-red-600/0 to-orange-600/0 group-hover:from-red-600/10 group-hover:to-orange-600/10 transition-all duration-300"></div>
                  
                  <div className="relative">
                    <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg shadow-red-600/20">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-4xl font-black text-white mb-1 group-hover:text-red-500 transition-colors">{(() => {
                      if (!summary) return index === 0 ? userCommunitiesCount : stat.value;
                      if (index === 0) return summary.totals.communities;
                      if (index === 1) return summary.totals.routes;
                      if (index === 2) return summary.totals.workshops;
                      // activity - show recentActivity length
                      if (index === 3) return summary.recentActivity.length;
                      return stat.value;
                    })()}</div>
                    <div className="text-neutral-400 text-sm font-medium">{stat.label}</div>
                  </div>
                  
                  <ChevronRight className="absolute bottom-4 right-4 w-5 h-5 text-neutral-700 group-hover:text-red-500 group-hover:translate-x-1 transition-all" />
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Actions with Enhanced Design */}
        <div className="mb-12">
          <h2 className="text-3xl font-black text-white mb-6 flex items-center gap-3">
            <div className="w-2 h-8 bg-red-600 rounded-full"></div>
            Acciones Rápidas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { href: '/communities', label: 'Ver Comunidades', gradient: 'from-blue-600 to-cyan-600', icon: Users },
              { href: '/routes', label: 'Explorar Rutas', gradient: 'from-red-600 to-orange-600', icon: MapPin },
              { href: '/workshops', label: 'Buscar Talleres', gradient: 'from-purple-600 to-pink-600', icon: Wrench },
            ].map((action, index) => {
              const ActionIcon = action.icon;
              return (
                <Link 
                  key={index}
                  href={action.href} 
                  className={`group relative bg-gradient-to-r ${action.gradient} hover:shadow-2xl hover:shadow-red-600/20 rounded-xl p-8 transition-all duration-300 hover:scale-105 overflow-hidden`}
                >
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300"></div>
                  
                  <div className="relative flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                        <ActionIcon className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-lg font-bold text-white">{action.label}</span>
                    </div>
                    <ChevronRight className="w-6 h-6 text-white/80 group-hover:translate-x-2 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Activity Feed - 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            {/* Activity Card */}
            <div className="bg-neutral-900 border-2 border-neutral-800 rounded-xl p-8 shadow-2xl shadow-black/20">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black text-white flex items-center gap-3">
                  <div className="w-2 h-8 bg-red-600 rounded-full"></div>
                  Actividad Reciente
                </h2>
                <Calendar className="w-6 h-6 text-neutral-500" />
              </div>

              {summary && summary.recentActivity.length > 0 ? (
                <div className="space-y-4">
                  {summary.recentActivity.map((activity, index) => {
                    return (
                      <div
                        key={index}
                        className="group flex items-start gap-4 p-6 bg-neutral-950/50 border-2 border-neutral-800 hover:border-red-600 rounded-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                      >
                        <div className="w-14 h-14 bg-gradient-to-br from-red-600 to-orange-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg shadow-red-600/20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                          <TrendingUp className="w-7 h-7 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-white mb-1 text-lg group-hover:text-red-500 transition-colors">{activity.title}</h3>
                          <p className="text-neutral-300 mb-2">{activity.description}</p>
                          <p className="text-sm text-neutral-500">{new Date(activity.createdAt).toLocaleString()}</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-neutral-700 group-hover:text-red-500 group-hover:translate-x-1 transition-all opacity-0 group-hover:opacity-100" />
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-10 h-10 text-neutral-600" />
                  </div>
                  <p className="text-neutral-400 text-lg">
                    No hay actividad reciente
                  </p>
                  <p className="text-neutral-500 text-sm mt-2">
                    Comienza a explorar rutas y comunidades
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - 1 column */}
          <div className="space-y-6">
            {/* Profile Card with Gradient */}
            <div className="relative bg-neutral-900 border-2 border-neutral-800 rounded-xl overflow-hidden shadow-2xl shadow-black/20">
              <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-r from-red-600 to-orange-600"></div>
              
              <div className="relative pt-16 px-8 pb-8">
                <div className="text-center mb-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-red-600 to-orange-600 rounded-xl flex items-center justify-center mx-auto mb-4 -mt-12 border-4 border-neutral-900 shadow-2xl shadow-red-600/30">
                    <span className="text-4xl font-black text-white">
                      {user?.firstName?.[0]?.toUpperCase()}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1">{user?.firstName} {user?.lastName}</h3>
                  <p className="text-sm text-neutral-400">{user?.emailAddresses[0]?.emailAddress}</p>
                  
                  <div className="flex items-center justify-center gap-2 mt-4">
                    <div className="px-3 py-1 bg-red-600/20 border border-red-600/30 rounded-full">
                      <span className="text-xs font-semibold text-red-400">Principiante</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4 pt-6 border-t border-neutral-800">
                  <div className="flex items-center justify-between p-3 bg-neutral-950/50 rounded-lg">
                    <span className="text-neutral-400 text-sm">Puntos XP</span>
                    <span className="text-white font-bold">{summary ? summary.xp : 0}</span>
                  </div>
                  <div className="w-full bg-neutral-800 rounded-full h-2">
                    <div className="bg-gradient-to-r from-red-600 to-orange-600 h-2 rounded-full" style={{width: `${summary ? Math.min(100, Math.floor((summary.xp / (summary.levels?.[summary.level+1] || 100)) * 100)) : 0}%`}}></div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-neutral-950/50 rounded-lg">
                    <span className="text-neutral-400 text-sm">Miembro desde</span>
                    <span className="text-white font-semibold text-sm">
                      {new Date(user?.createdAt || '').toLocaleDateString('es', { month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                </div>

                {/* Achievements */}
                <div className="mt-6 pt-6 border-t border-neutral-800">
                  <h4 className="text-sm font-bold text-white mb-3">Logros Recientes</h4>
                  <div className="flex gap-2">
                    {achievements.map((achievement, index) => {
                      const AchIcon = achievement.icon;
                      return (
                        <div
                          key={index}
                          className={`flex-1 p-3 rounded-lg border-2 ${
                            achievement.earned 
                              ? 'bg-red-600/10 border-red-600/30' 
                              : 'bg-neutral-950/50 border-neutral-800'
                          }`}
                        >
                          <AchIcon className={`w-6 h-6 mx-auto ${
                            achievement.earned ? 'text-red-500' : 'text-neutral-700'
                          }`} />
                          <p className={`text-xs text-center mt-2 font-medium ${
                            achievement.earned ? 'text-red-400' : 'text-neutral-600'
                          }`}>
                            {achievement.label}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
              {/* Comunidades -> mostrar las que el usuario sigue */}
                <div className="mt-6 pt-6 border-t border-neutral-800">
                  <h4 className="text-sm font-bold text-white mb-3">Comunidades que sigues</h4>
                  {summary && summary.recentActivity.length > 0 ? (
                    <div className="space-y-2">
                      {userCommunities.map((c) => (
                        <Link key={c.id} href={`/communities/${c.id}`} className="block p-2 bg-neutral-950/50 rounded-md hover:bg-neutral-900">
                          <div className="text-sm font-semibold text-white">{c.name}</div>
                          <div className="text-xs text-neutral-400">{c.creatorName}</div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-neutral-500 text-sm">Aún no te has unido a comunidades</div>
                  )}
                </div>

              {/* Featured Routes with Enhanced Design */}
            <div className="bg-neutral-900 border-2 border-neutral-800 rounded-xl p-8 shadow-2xl shadow-black/20">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <div className="w-2 h-6 bg-red-600 rounded-full"></div>
      
                Rutas Destacadas
              </h3>
              <div className="space-y-3">
                {featuredRoutes.length > 0 ? (
                  featuredRoutes.map((route, index) => (
                    <div key={route.id} className="group flex items-center justify-between p-4 bg-neutral-950/50 border-2 border-neutral-800 hover:border-red-600 rounded-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer">
                      <div className="flex-1">
                        <p className="font-bold text-white mb-2 group-hover:text-red-500 transition-colors">{route.title}</p>
                        <div className="flex items-center gap-3 flex-wrap">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                            <span className="text-sm font-semibold text-neutral-300">{(route.reviews && route.reviews.length > 0) ? Math.round((route.reviews.reduce((a,b)=>a+(b.rating||0),0)/route.reviews.length)*10)/10 : '—'}</span>
                          </div>
                          <span className="text-neutral-600">•</span>
                          <span className="text-sm text-neutral-400 font-medium">{route.distanceKm ? `${route.distanceKm} km` : '-'}</span>
                          <span className="text-neutral-600">•</span>
                          <span className="text-xs px-2 py-1 bg-neutral-800 text-neutral-400 rounded-full font-medium">
                            {route.difficulty}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-neutral-700 group-hover:text-red-500 group-hover:translate-x-1 transition-all" />
                    </div>
                  ))
                ) : (
                  <div className="text-neutral-400">Cargando rutas destacadas...</div>
                )}
              </div>
              
              <Link 
                href="/routes" 
                className="mt-6 w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-all hover:scale-105 group"
              >
                Ver Todas las Rutas
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}