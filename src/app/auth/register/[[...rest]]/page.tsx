"use client";

import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, Loader, User, ArrowLeft } from "lucide-react";

export default function RegisterPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");

  const handleRegister = (e) => {
    e.preventDefault();
    setError("");

    if (!firstName.trim()) {
      setError("El nombre es obligatorio");
      return;
    }

    if (!email.trim()) {
      setError("El email es obligatorio");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setPendingVerification(true);
      setLoading(false);
    }, 1500);
  };

  const handleVerifyEmail = (e) => {
    e.preventDefault();
    if (!code) return;

    setLoading(true);
    setError("");

    setTimeout(() => {
      setLoading(false);
    }, 1500);
  };

  if (pendingVerification) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-between p-4 lg:p-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-red-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-red-700/10 rounded-full blur-3xl"></div>

        {/* Left side content */}
        <div className="hidden lg:flex flex-1 items-center justify-center px-8 max-w-2xl">
          <div className="relative z-10">
            <h1 className="text-5xl font-black text-white mb-6">
              Casi listo para rodar
            </h1>
            <p className="text-xl text-neutral-400 mb-8 leading-relaxed">
              Solo falta verificar tu email para unirte a la comunidad más grande de moteros.
            </p>
          </div>
        </div>

        <div className="relative z-10 w-full max-w-md lg:mr-8">
          <div className="bg-transparent p-6">
            <div className="text-center mb-6">
              <div className="flex justify-center mb-3">
                <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center">
                  <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L4 7v10l8 5 8-5V7l-8-5zm0 18.54l-6-3.75V8.46l6-3.75 6 3.75v8.33l-6 3.75z"/>
                  </svg>
                </div>
              </div>
              <h1 className="text-2xl font-bold text-white mb-1">Verifica tu Email</h1>
              <p className="text-neutral-400 text-sm">Hemos enviado un código a {email}</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Código de Verificación
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="000000"
                  disabled={loading}
                  maxLength={6}
                  className="w-full px-4 py-2.5 bg-neutral-800/50 border border-neutral-700/50 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition text-center text-2xl tracking-widest disabled:opacity-50"
                />
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm">
                  {error}
                </div>
              )}

              <button
                onClick={handleVerifyEmail}
                disabled={loading || code.length < 6}
                className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg transition duration-300 flex items-center justify-center gap-2 text-sm"
              >
                {loading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Verificando...
                  </>
                ) : (
                  "Verificar"
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setPendingVerification(false);
                  setCode("");
                }}
                className="w-full flex items-center justify-center gap-2 text-neutral-400 hover:text-red-500 font-medium text-sm transition pt-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Volver
              </button>
            </div>

            <div className="mt-5 pt-5 border-t border-neutral-800/50">
              <p className="text-xs text-neutral-500 text-center">
                Si no recibes el código, revisa tu carpeta de spam.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-between p-4 lg:p-8 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-64 h-64 bg-red-600/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-red-700/10 rounded-full blur-3xl"></div>

      {/* Left side content */}
      <div className="hidden lg:flex flex-1 items-center justify-center px-8 max-w-2xl">
        <div className="relative z-10">
          <h1 className="text-5xl font-black text-white mb-6">
            Únete a la comunidad
          </h1>
          <p className="text-xl text-neutral-400 mb-8 leading-relaxed">
            Conecta con miles de riders, descubre rutas épicas y comparte tu pasión por las dos ruedas.
          </p>
          <div className="space-y-5">
            {[
              'Rutas Organizadas y Verificadas',
              'Comunidad Global de Riders',
              'Talleres Certificados',
              'Eventos y Rodadas',
              'Grupos por Intereses'
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
            <h1 className="text-2xl font-bold text-white mb-1">MotoConnect</h1>
            <p className="text-neutral-400 text-sm">
              Únete a la Comunidad Global de Moteros
            </p>
          </div>

          <div className="space-y-4">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Nombre
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-5 h-5 text-neutral-500" />
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Juan"
                    disabled={loading}
                    className="w-full pl-10 pr-4 py-2.5 bg-neutral-800/50 border border-neutral-700/50 rounded-lg text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition disabled:opacity-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Apellido
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-5 h-5 text-neutral-500" />
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Pérez"
                    disabled={loading}
                    className="w-full pl-10 pr-4 py-2.5 bg-neutral-800/50 border border-neutral-700/50 rounded-lg text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition disabled:opacity-50"
                  />
                </div>
              </div>
            </div>

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

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-neutral-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 8 caracteres"
                  disabled={loading}
                  className="w-full pl-10 pr-12 py-2.5 bg-neutral-800/50 border border-neutral-700/50 rounded-lg text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  className="absolute right-3 top-3 text-neutral-500 hover:text-neutral-400 transition disabled:opacity-50"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password Input */}
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Confirmar Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-neutral-500" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirma tu contraseña"
                  disabled={loading}
                  className="w-full pl-10 pr-12 py-2.5 bg-neutral-800/50 border border-neutral-700/50 rounded-lg text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={loading}
                  className="absolute right-3 top-3 text-neutral-500 hover:text-neutral-400 transition disabled:opacity-50"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
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
              onClick={handleRegister}
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg transition duration-300 flex items-center justify-center gap-2 text-sm"
            >
              {loading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Registrando...
                </>
              ) : (
                "Registrarse"
              )}
            </button>

            {/* Divider */}
            <div className="flex items-center my-4">
              <div className="flex-1 h-px bg-neutral-800"></div>
              <span className="px-3 text-neutral-500 text-xs">O</span>
              <div className="flex-1 h-px bg-neutral-800"></div>
            </div>

            {/* Login Link */}
            <div className="text-center">
              <p className="text-neutral-400 text-sm">
                ¿Ya tienes cuenta?{" "}
                <a href="/auth/login" className="text-red-500 hover:text-red-400 font-semibold transition">
                  Inicia sesión aquí
                </a>
              </p>
            </div>
          </div>

          {/* Info Box */}
          <div className="mt-5 pt-5 border-t border-neutral-800/50">
            <p className="text-xs text-neutral-500 text-center">
              ✓ Conexión segura con encriptación SSL
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}