"use client";

import { useState } from "react";
import { Mail, ArrowLeft, Loader } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
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
    <div className="min-h-screen bg-neutral-950 flex items-center justify-between p-4 lg:p-8 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-red-600/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-red-700/10 rounded-full blur-3xl"></div>

      {/* Left side content */}
      <div className="hidden lg:flex flex-1 items-center justify-center px-8 max-w-2xl">
        <div className="relative z-10">
          <h1 className="text-5xl font-black text-white mb-6">
            ¿Olvidaste tu contraseña?
          </h1>
          <p className="text-xl text-neutral-400 mb-8 leading-relaxed">
            No te preocupes, te enviaremos instrucciones para recuperar el acceso a tu cuenta.
          </p>
          <div className="space-y-5">
            {[
              'Recuperación rápida y segura',
              'Instrucciones detalladas por email',
              'Soporte disponible 24/7'
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                <span className="text-neutral-300 text-lg">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="relative z-10 w-full max-w-md lg:mr-8">
        <div className="bg-transparent p-6">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="flex justify-center mb-3">
              <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center">
                <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L4 7v10l8 5 8-5V7l-8-5zm0 18.54l-6-3.75V8.46l6-3.75 6 3.75v8.33l-6 3.75z"/>
                </svg>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">Recuperar Contraseña</h1>
            <p className="text-neutral-400 text-sm">
              {!success 
                ? "Ingresa tu email para recibir instrucciones"
                : "Revisa tu correo electrónico"}
            </p>
          </div>

          {!success ? (
            <div className="space-y-4">
              {/* Email Input */}
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-neutral-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    disabled={loading}
                    className="w-full pl-10 pr-4 py-2.5 bg-neutral-800/50 border border-neutral-700/50 rounded-lg text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition disabled:opacity-50"
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
                className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg transition duration-300 flex items-center justify-center gap-2 text-sm"
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

              {/* Back Link */}
              <button
                onClick={() => window.location.href = '/auth/login'}
                className="w-full flex items-center justify-center gap-2 text-neutral-400 hover:text-red-500 font-medium text-sm transition pt-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Volver al Login
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Success Message */}
              <div className="bg-green-500/10 border border-green-500/50 rounded-lg p-5 text-center">
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-lg font-bold text-green-500 mb-2">
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
                className="w-full bg-neutral-800/50 hover:bg-neutral-800 border border-neutral-700/50 text-neutral-300 font-medium py-2.5 rounded-lg transition text-sm"
              >
                Enviar Otro Email
              </button>

              {/* Back Link */}
              <button
                onClick={() => window.location.href = '/auth/login'}
                className="w-full flex items-center justify-center gap-2 text-neutral-400 hover:text-red-500 font-medium text-sm transition pt-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Volver al Login
              </button>
            </div>
          )}

          {/* Info Box */}
          <div className="mt-5 pt-5 border-t border-neutral-800/50">
            <p className="text-xs text-neutral-500 text-center">
              Si no recibes el email en 5 minutos, verifica tu carpeta de spam.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}