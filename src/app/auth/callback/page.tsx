"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth, AuthenticateWithRedirectCallback } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";

export default function CallbackPage() {
  const router = useRouter();
  const { isLoaded, userId } = useAuth();

  useEffect(() => {
    async function handleSync() {
      // 1. Si no hay userId, NO hacemos nada todavía. 
      // Dejamos que <AuthenticateWithRedirectCallback /> haga su trabajo abajo.
      if (!userId) return;

      console.log("✅ Sesión confirmada, userId:", userId);

      try {
        console.log("🔄 Sincronizando usuario con DB...");
        
        // Llamada a tu API de sincronización
        const response = await fetch("/api/sync-user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });

        if (response.ok) {
          console.log("✅ Usuario sincronizado correctamente");
        } else {
          console.warn("⚠️ La DB respondió con error (pero continuamos)");
        }
      } catch (error) {
        console.warn("⚠️ Error de red al sincronizar (pero continuamos):", error);
      }

      console.log("🚀 Login completo, redirigiendo al dashboard...");
      router.push("/dashboard");
    }

    if (isLoaded) {
      handleSync();
    }
  }, [isLoaded, userId, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-red-600 rounded-xl flex items-center justify-center mx-auto mb-4 animate-pulse">
          <Loader2 className="w-8 h-8 text-white animate-spin" />
        </div>
        <h1 className="text-white text-2xl font-bold mb-2">Completando autenticación...</h1>
        <p className="text-slate-400 text-sm">Esto tomará solo unos segundos</p>
      </div>

      {/* 🛑 CRÍTICO 1: El div para que el Captcha no falle */}
      <div id="clerk-captcha" />

      {/* 🛑 CRÍTICO 2: El componente que procesa el ticket de Google/Auth */}
      {/* Usamos continueSignUpUrl={null} para evitar que redirija automáticamente antes de nuestro sync */}
      <AuthenticateWithRedirectCallback 
        continueSignUpUrl={null}
        redirectUrl={null} 
      />
    </div>
  );
}