import { clerkMiddleware, getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";

export default clerkMiddleware(async (auth, req) => {
  const url = req.nextUrl.pathname;

  // ✅ Esperamos a que Clerk resuelva la sesión
  const { userId } = await auth();

  // 🟢 Protege rutas que requieren sesión Clerk
  if (url.startsWith("/dashboard") && !userId) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // 🔒 Protege rutas API con JWT personalizado
  if (url.startsWith("/api/protected")) {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return new NextResponse(JSON.stringify({ error: "Missing token" }), { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "");
    const decoded = verifyToken(token);

    if (!decoded) {
      return new NextResponse(JSON.stringify({ error: "Invalid token" }), { status: 403 });
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};
