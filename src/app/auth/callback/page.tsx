"use client";

import { useEffect } from "react";
import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";

export default function CallbackPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <h1 className="text-white text-xl">Completando autenticación...</h1>
        <p className="text-slate-400 text-sm mt-2">Por favor espera, esto puede tomar unos segundos</p>
      </div>

      {/* Callback handler */}
      <AuthenticateWithRedirectCallback />
    </div>
  );
}