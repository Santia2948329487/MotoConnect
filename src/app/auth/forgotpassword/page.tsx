"use client";

import { useState } from "react";
import { Mail, ArrowLeft, Zap, Loader } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Aquí iría la lógica real con tu backend
      // Por ahora simulamos
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      if (!email.includes("@")) {
        setError("Email inválido");
        setLoading(false);
        return;
      }

      setSuccess(true);
      setEmail("");
    } catch (err) {
      setError("Error al enviar el email. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Fondo con efecto GTA VI */}
      <div className="fixed inset-0">
        {/* Gradiente GTA VI */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-950 via-black to-purple-950 opacity-50"></div>
        
        {/* Líneas animadas */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-10 w-96 h-96 bg-red-600 rounded-full blur-3xl opacity-10 animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-600 rounded-full blur-3xl opacity-10 animate-pulse delay-1000"></div>
        </div>

        {/* Grid background */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "linear-gradient(0deg, transparent 24%, rgba(255, 0, 0, 0.05) 25%, rgba(255, 0, 0, 0.05) 26%, transparent 27%, transparent 74%, rgba(255, 0, 0, 0.05) 75%, rgba(255, 0, 0, 0.05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(255, 0, 0, 0.05) 25%, rgba(255, 0, 0, 0.05) 26%, transparent 27%, transparent 74%, rgba(255, 0, 0, 0.05) 75%, rgba(255, 0, 0, 0.05) 76%, transparent 77%, transparent)",
            backgroundSize: "50px 50px",
          }}
        ></div>
      </div>

      {/* Contenido */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Card con bordes GTA */}
          <div className="border-4 border-red-600 bg-black/80 backdrop-blur-xl p-8 relative">
            {/* Corners GTA VI */}
            <div className="absolute -top-2 -left-2 w-4 h-4 border-t-4 border-l-4 border-red-600"></div>
            <div className="absolute -top-2 -right-2 w-4 h-4 border-t-4 border-r-4 border-red-600"></div>
            <div className="absolute -bottom-2 -left-2 w-4 h-4 border-b-4 border-l-4 border-red-600"></div>
            <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-4 border-r-4 border-red-600"></div>

            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="w-14 h-14 bg-red-600 flex items-center justify-center transform -rotate-45 hover:rotate-0 transition-transform duration-300">
                  <Zap className="w-8 h-8 text-white transform rotate-45" />
                </div>
              </div>
              <h1 className="text-3xl font-black text-red-600 mb-2 uppercase tracking-widest">
                RECUPERAR ACCESO
              </h1>
              <p className="text-slate-400 text-sm">
                Ingresa tu email para recibir instrucciones
              </p>
            </div>

            {!success ? (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email Input */}
                <div>
                  <label className="block text-sm font-bold text-red-600 mb-2 uppercase">
                    EMAIL
                  </label>
                  <div className="relative border-2 border-red-600 bg-black/50">
                    <Mail className="absolute left-3 top-3.5 w-5 h-5 text-red-600" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="tu@email.com"
                      disabled={loading}
                      className="w-full pl-10 pr-4 py-2.5 bg-transparent text-white placeholder-slate-600 focus:outline-none focus:border-red-500 uppercase text-sm tracking-wide"
                      required
                    />
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div className="border-2 border-red-600 bg-red-600/10 p-3 text-red-400 text-sm font-bold uppercase">
                    ⚠️ {error}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-black py-3 uppercase tracking-widest text-sm border-2 border-red-600 transition duration-200 transform hover:scale-105"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader className="w-4 h-4 animate-spin" />
                      ENVIANDO...
                    </div>
                  ) : (
                    "ENVIAR INSTRUCCIONES"
                  )}
                </button>

                {/* Divider */}
                <div className="border-t-2 border-red-600 my-6"></div>

                {/* Back Link */}
                <Link
                  href="/auth/login"
                  className="flex items-center justify-center gap-2 text-red-600 hover:text-red-400 font-bold uppercase text-sm transition"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Volver al Login
                </Link>
              </form>
            ) : (
              <div className="text-center">
                {/* Success Message */}
                <div className="mb-6 p-6 border-2 border-green-600 bg-green-600/10">
                  <div className="text-4xl mb-3">✓</div>
                  <h2 className="text-2xl font-black text-green-600 mb-2 uppercase">
                    Email Enviado
                  </h2>
                  <p className="text-slate-400 text-sm mb-4">
                    Revisa tu bandeja de entrada (y spam) para las instrucciones de recuperación.
                  </p>
                </div>

                {/* Reset Button */}
                <button
                  onClick={() => {
                    setSuccess(false);
                    setEmail("");
                  }}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-3 uppercase tracking-widest text-sm border-2 border-red-600 transition"
                >
                  Enviar Otro Email
                </button>

                <Link
                  href="/auth/login"
                  className="block mt-4 text-red-600 hover:text-red-400 font-bold uppercase text-sm transition"
                >
                  Volver al Login
                </Link>
              </div>
            )}

            {/* Footer GTA Style */}
            <div className="mt-8 pt-6 border-t border-red-600/30 text-center">
              <p className="text-xs text-slate-500 uppercase tracking-widest">
                © MotoConnect Security System
              </p>
            </div>
          </div>

          {/* Info Box */}
          <div className="mt-6 border-2 border-red-600/50 bg-black/50 p-4">
            <p className="text-xs text-slate-400 uppercase tracking-wide">
              Si no recibes el email en 5 minutos, verifica tu carpeta de spam o intenta de nuevo.
            </p>
          </div>
        </div>
      </div>

      {/* Scanlines effect */}
      <div className="fixed inset-0 pointer-events-none opacity-5">
        <div className="absolute inset-0 bg-repeat" style={{
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 0, 0, 0.5) 2px, rgba(0, 0, 0, 0.5) 4px)"
        }}></div>
      </div>
    </div>
  );
}