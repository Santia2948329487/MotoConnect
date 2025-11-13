import { Webhook } from "svix";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { generateToken } from "@/lib/jwt";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) throw new Error("❌ Missing CLERK_WEBHOOK_SECRET");

  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new NextResponse("Missing Svix headers", { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: any;
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    console.error("❌ Error verificando webhook:", err);
    return new NextResponse("Invalid signature", { status: 400 });
  }

  const { type, data } = evt;

  try {
    switch (type) {
      // ✅ CREAR o ACTUALIZAR USUARIO
      case "user.created": {
        const user = await prisma.user.upsert({
          where: { email: data.email_addresses[0].email_address },
          update: {
            clerkId: data.id,
            name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
          },
          create: {
            clerkId: data.id,
            name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
            email: data.email_addresses[0].email_address,
          },
        });

        const token = generateToken({
          id: user.id,
          role: user.role,
          email: user.email,
        });

        console.log("✅ Usuario creado/actualizado con JWT:", token);
        break;
      }

      // ✅ ACTUALIZAR DATOS DE USUARIO EXISTENTE
      case "user.updated":
        await prisma.user.update({
          where: { clerkId: data.id },
          data: {
            name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
            email: data.email_addresses[0].email_address,
          },
        });
        console.log(`🔄 Usuario actualizado: ${data.id}`);
        break;

      // ✅ ELIMINAR USUARIO SOLO SI EXISTE
      case "user.deleted": {
        const existingUser = await prisma.user.findUnique({
          where: { clerkId: data.id },
        });

        if (!existingUser) {
          console.log(`⚠️ Intento de eliminar usuario inexistente: ${data.id}`);
          break;
        }

        await prisma.user.delete({
          where: { clerkId: data.id },
        });
        console.log(`🗑️ Usuario eliminado: ${data.id}`);
        break;
      }

      default:
        console.log(`📦 Evento no manejado: ${type}`);
    }
  } catch (error) {
    console.error("❌ Error procesando evento:", error);
    return NextResponse.json({ error: "Error processing event" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
