// src/app/docs/page.tsx
'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Loader, BookOpen, Shield, Zap } from 'lucide-react';

// Importar SwaggerUI dinámicamente para evitar problemas de SSR
const SwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: false });
import 'swagger-ui-react/swagger-ui.css';

export default function ApiDocsPage() {
  const [spec, setSpec] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/docs')
      .then((res) => {
        if (!res.ok) throw new Error('Error cargando documentación');
        return res.json();
      })
      .then((data) => {
        setSpec(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <div className="text-center">
          <Loader className="w-12 h-12 text-blue-400 animate-spin mx-auto mb-4" />
          <p className="text-white text-xl">Cargando documentación...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <div className="text-center text-red-400">
          <p className="text-xl mb-4">❌ Error cargando documentación</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header con estilo */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                  <BookOpen className="w-7 h-7 text-white" />
                </div>
                <h1 className="text-4xl font-bold text-white">
                  MotoConnect API Docs
                </h1>
              </div>
              <p className="text-purple-100 text-lg">
                📖 Documentación completa de endpoints REST
              </p>
            </div>
            
            <div className="flex gap-2">
              <a
                href="/"
                className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg text-white transition"
              >
                <Zap className="w-4 h-4" />
                Ir a la App
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Info Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="w-6 h-6 text-green-400" />
              <h3 className="text-white font-semibold">Autenticación</h3>
            </div>
            <p className="text-slate-400 text-sm">
              Usa JWT Bearer Token de Clerk en el header <code className="text-purple-400">Authorization</code>
            </p>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <Zap className="w-6 h-6 text-yellow-400" />
              <h3 className="text-white font-semibold">Rate Limiting</h3>
            </div>
            <p className="text-slate-400 text-sm">
              100 requests/min en API general, 5 intentos/15min en auth
            </p>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <BookOpen className="w-6 h-6 text-blue-400" />
              <h3 className="text-white font-semibold">Formato</h3>
            </div>
            <p className="text-slate-400 text-sm">
              Todos los endpoints usan JSON y retornan códigos HTTP estándar
            </p>
          </div>
        </div>
      </div>

      {/* Swagger UI */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          {spec && <SwaggerUI spec={spec} />}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-slate-800 border-t border-slate-700 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-400 text-sm">
          <p>🏍️ MotoConnect API v1.0.0 | Desarrollado por Aprendiz SENA</p>
          <p className="mt-2">
            <a href="https://github.com/tu-usuario/motoconnect" className="text-blue-400 hover:text-blue-300">
              GitHub
            </a>
            {' • '}
            <a href="mailto:soporte@motoconnect.com" className="text-blue-400 hover:text-blue-300">
              Soporte
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}