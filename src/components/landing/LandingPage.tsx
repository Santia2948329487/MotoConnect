// src/components/landing/LandingPage.tsx
'use client';

import React, { useState } from 'react';
import { Menu, X, ChevronRight, MapPin, Users, Wrench, Check, MessageCircle, Route, UsersRound } from 'lucide-react';

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-neutral-950/95 backdrop-blur-sm border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <a href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L4 7v10l8 5 8-5V7l-8-5zm0 18.54l-6-3.75V8.46l6-3.75 6 3.75v8.33l-6 3.75z"/>
                </svg>
              </div>
              <span className="text-2xl font-bold">MotoConnect</span>
            </a>

            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-neutral-300 hover:text-white transition-colors">Características</a>
              <a href="/auth/register" className="text-neutral-300 hover:text-white transition-colors">Rutas</a>
              <a href="/auth/register" className="text-neutral-300 hover:text-white transition-colors">Comunidad</a>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <a href="/auth/login" className="px-6 py-2.5 text-neutral-300 hover:text-white transition-colors">
                Ingresar
              </a>
              <a href="/auth/register" className="px-6 py-2.5 bg-red-600 hover:bg-red-700 rounded-md font-semibold transition-colors border-2 border-red-600">
                Registrarse
              </a>
            </div>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 hover:bg-neutral-800 rounded-lg transition"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {isMenuOpen && (
            <div className="md:hidden py-4 space-y-3 border-t border-neutral-800">
              <a href="#features" className="block px-4 py-2 hover:bg-neutral-800 rounded-lg">Características</a>
              <a href="/auth/register" className="block px-4 py-2 hover:bg-neutral-800 rounded-lg">Rutas</a>
              <a href="/auth/register" className="block px-4 py-2 hover:bg-neutral-800 rounded-lg">Comunidad</a>
              <a href="/auth/register" className="block px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md font-semibold text-center">
                Comenzar
              </a>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/95 to-transparent z-10"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-5xl md:text-7xl font-black leading-tight">
                Motorcycle<br />
                <span className="text-neutral-400">Website</span>
              </h1>

              <div className="space-y-4">
                {[
                  'Rutas Organizadas y Verificadas',
                  'Compatibilidad Móvil Total',
                  'Comunidad Global de Riders',
                  'Talleres Certificados',
                  'Fácil de Usar y Personalizar'
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-7 h-7 bg-red-600 rounded flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-lg text-neutral-300">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="bg-neutral-900 border-2 border-red-600 rounded-xl p-8 shadow-2xl shadow-red-600/20">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2L4 7v10l8 5 8-5V7l-8-5z"/>
                    </svg>
                  </div>
                </div>

                <h3 className="text-3xl font-bold mb-4">
                  Motorcycle The<br />Choice Cut
                </h3>

                <p className="text-neutral-400 mb-6">
                  Conecta con riders, descubre rutas épicas y encuentra los mejores talleres mecánicos.
                </p>

                <a href="/auth/register" className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded flex items-center justify-center gap-2 transition-colors group">
                  Explorar Más
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 px-4 bg-neutral-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                Icon: MessageCircle,
                title: 'Interacción entre moteros',
                items: [
                  'Publicaciones con fotos y videos',
                  'Comentarios y reacciones',
                  'Perfiles con información de la moto y estilo de conducción'
                ]
              },
              {
                Icon: Route,
                title: 'Rutas y eventos',
                items: [
                  'Visualización y registro de rutas en mapa',
                  'Calendario de rodadas y eventos',
                  'Inscripción y participación en actividades de la comunidad'
                ]
              },
              {
                Icon: UsersRound,
                title: 'Grupos y comunidad',
                items: [
                  'Grupos por ciudad, tipo de moto o interés',
                  'Chats de grupo',
                  'Espacios para compartir consejos, experiencias y recomendaciones'
                ]
              }
            ].map((feature, index) => {
              const FeatureIcon = feature.Icon;
              return (
              <div
                key={index}
                className="bg-neutral-900 border-2 border-red-900/50 rounded-lg p-8 hover:border-red-600 transition-colors"
              >
                <div className="w-14 h-14 bg-red-600 rounded-lg flex items-center justify-center mb-4">
                  <FeatureIcon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-white">
                  {feature.title}
                </h3>
                <ul className="space-y-2">
                  {feature.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">•</span>
                      <span className="text-neutral-300 text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {[
              { icon: Users, value: '50K+', label: 'Riders Activos' },
              { icon: MapPin, value: '10K+', label: 'Rutas Compartidas' },
              { icon: Wrench, value: '500+', label: 'Talleres Certificados' }
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="space-y-4">
                  <div className="w-16 h-16 bg-red-600 rounded-lg flex items-center justify-center mx-auto">
                    <Icon className="w-8 h-8" />
                  </div>
                  <div className="text-5xl font-black text-red-500">{stat.value}</div>
                  <div className="text-neutral-400">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-12 text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-6">
            ¿Listo para la Aventura?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Únete a miles de riders que ya están explorando nuevas rutas
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/auth/register" className="px-8 py-4 bg-white text-red-600 hover:bg-neutral-100 rounded-lg font-bold text-lg transition-colors">
              Comenzar Gratis
            </a>
            <a href="/routes" className="px-8 py-4 bg-transparent border-2 border-white hover:bg-white/10 rounded-lg font-bold text-lg transition-colors">
              Explorar Rutas
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-neutral-800 bg-neutral-950">
        <div className="max-w-7xl mx-auto text-center text-neutral-400 text-sm">
          <p>&copy; 2025 MotoConnect. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}