"use client";

import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, Loader, CornerDownRight } from "lucide-react";
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const { signIn, isLoaded, setActive } = useSignIn();
  
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;

    setLoading(true);
    setError("");

    try {
      const result = await signIn.create({
        strategy: "password",
        identifier: email,
        password: password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/");
      } else {
        setError("Verifica tus credenciales e intenta de nuevo");
      }
    } catch (err: any) {
      console.error("Error de login:", err);
      setError(err.errors?.[0]?.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!isLoaded) return;

    try {
      setLoading(true);
      setError("");
      
      await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/auth/callback",
        redirectUrlComplete: "/dashboard",
      });
    } catch (err: any) {
      console.error("Error Google:", err);
      setError(err.errors?.[0]?.message || "Error al iniciar sesión con Google");
      setLoading(false);
    }
  };

  const handleMicrosoftSignIn = async () => {
    if (!isLoaded) return;

    try {
      setLoading(true);
      setError("");
      
      await signIn.authenticateWithRedirect({
        strategy: "oauth_microsoft",
        redirectUrl: "/auth/callback",
        redirectUrlComplete: "/dashboard",
      });
    } catch (err: any) {
      console.error("Error Microsoft:", err);
      setError(err.errors?.[0]?.message || "Error al iniciar sesión con Microsoft");
      setLoading(false);
    }
  };

  const handleFacebookSignIn = async () => {
    if (!isLoaded) return;

    try {
      setLoading(true);
      setError("");
      
      await signIn.authenticateWithRedirect({
        strategy: "oauth_facebook",
        redirectUrl: "/auth/callback",
        redirectUrlComplete: "/dashboard",
      });
    } catch (err: any) {
      console.error("Error Facebook:", err);
      setError(err.errors?.[0]?.message || "Error al iniciar sesión con Facebook");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Imagen de fondo con overlay */}
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1558981359-219d6364c9c8?q=80&w=2070&auto=format&fit=crop"
          alt="Motorcycle background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/95 via-black/90 to-red-950/80"></div>
      </div>

      {/* Efectos de blur adicionales */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-red-700/10 rounded-full blur-3xl"></div>

      {/* Contenedor principal con grid para la nueva distribución */}
      <div className="relative z-10 w-full max-w-5xl grid md:grid-cols-2 gap-12 items-center">
        
        {/* Sección de Descripción a la Izquierda */}
        <div className="hidden md:block text-white pr-8">
          <div className="flex items-center mb-6">
            <div className="w-16 h-16 bg-red-600 rounded-xl flex items-center justify-center mr-4">
              <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L4 7v10l8 5 8-5V7l-8-5zm0 18.54l-6-3.75V8.46l6-3.75 6 3.75v8.33l-6 3.75z"/>
              </svg>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight">MotoConnect</h1>
          </div>
          
          <p className="text-neutral-300 text-lg mb-8 leading-relaxed">
            Tu punto de encuentro digital con la **Comunidad Global de Moteros**. 
            Accede a rutas exclusivas, foros de mecánica, eventos locales y conecta 
            con miles de apasionados por la carretera.
          </p>

          <ul className="space-y-3">
            <li className="flex items-start text-neutral-400">
              <CornerDownRight className="w-5 h-5 text-red-500 mr-3 mt-1 flex-shrink-0" />
              <span>Planifica tus próximas aventuras.</span>
            </li>
            <li className="flex items-start text-neutral-400">
              <CornerDownRight className="w-5 h-5 text-red-500 mr-3 mt-1 flex-shrink-0" />
              <span>Comparte tus conocimientos y experiencias.</span>
            </li>
            <li className="flex items-start text-neutral-400">
              <CornerDownRight className="w-5 h-5 text-red-500 mr-3 mt-1 flex-shrink-0" />
              <span>Únete a rodadas y eventos exclusivos.</span>
            </li>
          </ul>
        </div>

        {/* Formulario de Login a la Derecha */}
        <div className="w-full max-w-md mx-auto md:max-w-none">
          <div className="bg-neutral-900/50 backdrop-blur-xl border border-neutral-800 rounded-2xl p-8 shadow-2xl">
            
            {/* Encabezado del Login para móviles */}
            <div className="text-center mb-8 md:hidden">
              <div className="flex justify-center mb-4">
                <div className="w-14 h-14 bg-red-600 rounded-xl flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L4 7v10l8 5 8-5V7l-8-5zm0 18.54l-6-3.75V8.46l6-3.75 6 3.75v8.33l-6 3.75z"/>
                  </svg>
                </div>
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">MotoConnect</h1>
              <p className="text-neutral-400 text-sm">Comunidad Global de Moteros</p>
            </div>

            <h2 className="text-2xl font-semibold text-white mb-6 text-center md:text-left">Inicia Sesión</h2>

            <form onSubmit={handleEmailSignIn} className="space-y-5">
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

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 w-5 h-5 text-neutral-500" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    disabled={loading}
                    className="w-full pl-10 pr-12 py-2.5 bg-neutral-800/50 border border-neutral-700/50 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition disabled:opacity-50"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                    className="absolute right-3 top-3.5 text-neutral-500 hover:text-neutral-400 transition disabled:opacity-50"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm">
                  {error}
                </div>
              )}

              <div className="flex justify-end">
                <a href="/auth/forgotpassword" className="text-sm text-red-500 hover:text-red-400 transition">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>

              <button
                type="submit"
                disabled={loading || !isLoaded}
                className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg transition duration-300 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Ingresando...
                  </>
                ) : (
                  "Ingresar"
                )}
              </button>
            </form>

            <div className="flex items-center my-6">
              <div className="flex-1 h-px bg-neutral-800"></div>
              <span className="px-3 text-neutral-500 text-sm">O</span>
              <div className="flex-1 h-px bg-neutral-800"></div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleGoogleSignIn}
                disabled={loading || !isLoaded}
                className="w-full flex items-center justify-center gap-2 bg-neutral-800/50 hover:bg-neutral-800 border border-neutral-700/50 text-neutral-300 font-medium py-2.5 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Google
              </button>

              <button
                onClick={handleMicrosoftSignIn}
                disabled={loading || !isLoaded}
                className="w-full flex items-center justify-center gap-2 bg-neutral-800/50 hover:bg-neutral-800 border border-neutral-700/50 text-neutral-300 font-medium py-2.5 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zm12.6 0H12.6V0H24v11.4z" fill="#00A4EF"/>
                </svg>
                Microsoft
              </button>

              <button
                onClick={handleFacebookSignIn}
                disabled={loading || !isLoaded}
                className="w-full flex items-center justify-center gap-2 bg-neutral-800/50 hover:bg-neutral-800 border border-neutral-700/50 text-neutral-300 font-medium py-2.5 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="#1877F2"/>
                </svg>
                Facebook
              </button>
            </div>

            <p className="text-center text-neutral-400 text-sm mt-6">
              ¿No tienes cuenta?{" "}
              <a href="/auth/register" className="text-red-500 hover:text-red-400 font-semibold transition">
                Regístrate aquí
              </a>
            </p>
          </div>

          <div className="text-center mt-6 text-xs text-neutral-500">
            ✓ Conexión segura con encriptación SSL
          </div>
        </div>
      </div>
    </div>
  );
}