// src/components/landing/LandingPage.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X, ChevronRight, MapPin, Users, Wrench, Check } from 'lucide-react';

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-neutral-950/95 backdrop-blur-sm border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L4 7v10l8 5 8-5V7l-8-5zm0 18.54l-6-3.75V8.46l6-3.75 6 3.75v8.33l-6 3.75z"/>
                </svg>
              </div>
              <span className="text-2xl font-bold">MotoConnect</span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <a href="#home" className="text-neutral-300 hover:text-white transition-colors">Home</a>
              <a href="#features" className="text-neutral-300 hover:text-white transition-colors">Características</a>
              <a href="#routes" className="text-neutral-300 hover:text-white transition-colors">Rutas</a>
              <a href="#community" className="text-neutral-300 hover:text-white transition-colors">Comunidad</a>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <Link href="/auth/login" className="px-6 py-2.5 text-neutral-300 hover:text-white transition-colors">
                Ingresar
              </Link>
              <Link href="/auth/register" className="px-6 py-2.5 bg-red-600 hover:bg-red-700 rounded-md font-semibold transition-colors border-2 border-red-600">
                Comenzar
              </Link>
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
              <a href="#home" className="block px-4 py-2 hover:bg-neutral-800 rounded-lg">Home</a>
              <a href="#features" className="block px-4 py-2 hover:bg-neutral-800 rounded-lg">Características</a>
              <Link href="/auth/register" className="block px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md font-semibold text-center">
                Comenzar
              </Link>
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

                <Link href="/auth/register" className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded flex items-center justify-center gap-2 transition-colors group">
                  Explorar Más
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
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
                icon: '🏍️',
                title: 'MOTORCYCLE JUST FEELS RIGHT',
                description: 'Descubre las mejores rutas moteras verificadas por la comunidad'
              },
              {
                icon: '🎓',
                title: 'OUR PURPOSE IS EDUCATION',
                description: 'Aprende de riders experimentados y comparte tu conocimiento'
              },
              {
                icon: '❌',
                title: 'GET THE MOTORCYCLE HABIT',
                description: 'Únete a una comunidad global apasionada por las dos ruedas'
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-neutral-900 border-2 border-red-900/50 rounded-lg p-8 hover:border-red-600 transition-colors"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-sm font-bold tracking-wider mb-3 text-red-500 uppercase">
                  {feature.title}
                </h3>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
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
            <Link href="/auth/register" className="px-8 py-4 bg-white text-red-600 hover:bg-neutral-100 rounded-lg font-bold text-lg transition-colors">
              Comenzar Gratis
            </Link>
            <Link href="/routes" className="px-8 py-4 bg-transparent border-2 border-white hover:bg-white/10 rounded-lg font-bold text-lg transition-colors">
              Explorar Rutas
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-neutral-800 bg-neutral-950">
        <div className="max-w-7xl mx-auto text-center text-neutral-400 text-sm">
          <p>&copy; 2024 MotoConnect. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}