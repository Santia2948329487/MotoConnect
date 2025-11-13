import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) {
    return NextResponse.json({ error: "Missing token" }, { status: 401 });
  }

  const token = authHeader.replace("Bearer ", "");
  const decoded = verifyToken(token);

  if (!decoded) {
    return NextResponse.json({ error: "Invalid token" }, { status: 403 });
  }

  return NextResponse.json({
    message: "✅ Acceso permitido con JWT válido",
    user: decoded,
  });
}
