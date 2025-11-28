"use client";

import { useState } from "react";
import { Mail, ArrowLeft, Loader } from "lucide-react";

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
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Efectos de fondo */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-red-700/10 rounded-full blur-3xl"></div>

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-neutral-900/50 backdrop-blur-xl border border-neutral-800 rounded-2xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 bg-red-600 rounded-xl flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L4 7v10l8 5 8-5V7l-8-5zm0 18.54l-6-3.75V8.46l6-3.75 6 3.75v8.33l-6 3.75z"/>
                </svg>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Recuperar Contraseña</h1>
            <p className="text-neutral-400 text-sm">
              {!success 
                ? "Ingresa tu email para recibir instrucciones"
                : "Revisa tu correo electrónico"}
            </p>
          </div>

          {!success ? (
            <div className="space-y-5">
              {/* Email Input */}
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 w-5 h-5 text-neutral-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    disabled={loading}
                    className="w-full pl-10 pr-4 py-2.5 bg-neutral-800/50 border border-neutral-700/50 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition disabled:opacity-50"
                    required
                  />
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg transition duration-300 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  "Enviar Instrucciones"
                )}
              </button>

              {/* Divider */}
              <div className="flex items-center my-6">
                <div className="flex-1 h-px bg-neutral-800"></div>
              </div>

              {/* Back Link */}
              <button
                onClick={() => window.location.href = '/auth/login'}
                className="w-full flex items-center justify-center gap-2 text-neutral-400 hover:text-red-500 font-medium text-sm transition"
              >
                <ArrowLeft className="w-4 h-4" />
                Volver al Login
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Success Message */}
              <div className="bg-green-500/10 border border-green-500/50 rounded-lg p-6 text-center">
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-green-500 mb-2">
                  Email Enviado
                </h2>
                <p className="text-neutral-400 text-sm">
                  Revisa tu bandeja de entrada (y spam) para las instrucciones de recuperación.
                </p>
              </div>

              {/* Reset Button */}
              <button
                onClick={() => {
                  setSuccess(false);
                  setEmail("");
                }}
                className="w-full bg-neutral-800/50 hover:bg-neutral-800 border border-neutral-700/50 text-neutral-300 font-medium py-2.5 rounded-lg transition"
              >
                Enviar Otro Email
              </button>

              {/* Divider */}
              <div className="flex items-center my-6">
                <div className="flex-1 h-px bg-neutral-800"></div>
              </div>

              {/* Back Link */}
              <button
                onClick={() => window.location.href = '/auth/login'}
                className="w-full flex items-center justify-center gap-2 text-neutral-400 hover:text-red-500 font-medium text-sm transition"
              >
                <ArrowLeft className="w-4 h-4" />
                Volver al Login
              </button>
            </div>
          )}

          {/* Info Box */}
          <div className="mt-6 pt-6 border-t border-neutral-800">
            <p className="text-xs text-neutral-500 text-center">
              Si no recibes el email en 5 minutos, verifica tu carpeta de spam o intenta de nuevo.
            </p>
          </div>
        </div>

        <div className="text-center mt-6 text-xs text-neutral-500">
          ✓ Conexión segura con encriptación SSL
        </div>
      </div>
    </div>
  );
}