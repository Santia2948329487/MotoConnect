// src/middleware.ts
import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export default clerkMiddleware(async (auth, req) => {
  const url = req.nextUrl.pathname;
  const { userId } = await auth();

  // Permitir acceso público a estas rutas
  const publicRoutes = [
    "/",
    "/auth/login",
    "/auth/register", 
    "/auth/callback",
    "/auth/forgotpassword"
  ];

  if (publicRoutes.includes(url)) {
    return NextResponse.next();
  }

  // Proteger rutas que requieren autenticación
  if (url.startsWith("/dashboard") && !userId) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|.*\\..*|api/webhooks).*)",
    "/api/((?!webhooks).*)"
  ],
};