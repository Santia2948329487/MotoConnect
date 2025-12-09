/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/api/webhooks/clerk/route.ts
export const runtime = "nodejs"; // SIN ESTO NO FUNCIONA EN NEXT 15/16
export const dynamic = "force-dynamic";

import { Webhook } from "svix";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  
  if (!WEBHOOK_SECRET) {
    console.error("❌ Missing CLERK_WEBHOOK_SECRET");
    return new NextResponse("Missing secret", { status: 500 });
  }

  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error("❌ Missing Svix headers");
    return new NextResponse("Missing headers", { status: 400 });
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
  console.log(`\n📨 Webhook recibido: ${type}`);

  const email = data.email_addresses?.[0]?.email_address || null;
  const name = `${data.first_name || ""} ${data.last_name || ""}`.trim();

  try {
    switch (type) {
      case "user.created": {
        console.log(`👤 Creando usuario: ${email}`);
        
        const user = await prisma.user.upsert({
          where: { clerkId: data.id },
          update: { 
            name: name || "Usuario",
            email: email || ""
          },
          create: { 
            clerkId: data.id, 
            name: name || "Usuario",
            email: email || ""
          },
        });

        console.log(`✅ Usuario creado/actualizado:`, {
          id: user.id,
          clerkId: user.clerkId,
          name: user.name,
          email: user.email
        });
        break;
      }

      case "user.updated": {
        console.log(`🔄 Actualizando usuario: ${data.id}`);
        
        const user = await prisma.user.update({
          where: { clerkId: data.id },
          data: { 
            name: name || "Usuario",
            email: email || ""
          },
        });

        console.log(`✅ Usuario actualizado:`, {
          id: user.id,
          name: user.name
        });
        break;
      }

      case "user.deleted": {
        console.log(`🗑️  Eliminando usuario: ${data.id}`);
        
        const existingUser = await prisma.user.findUnique({
          where: { clerkId: data.id },
        });

        if (!existingUser) {
          console.log(`⚠️  Usuario no existe en DB: ${data.id}`);
          return NextResponse.json({ received: true });
        }

        await prisma.user.delete({
          where: { clerkId: data.id },
        });

        console.log(`✅ Usuario eliminado: ${data.id}`);
        break;
      }

      default:
        console.log(`📦 Evento no manejado: ${type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error: any) {
    console.error(`❌ Error procesando ${type}:`, error.message);
    
    // Log más detallado del error
    if (error.code === 'P2002') {
      console.error(`⚠️  Violación de unique constraint:`, error.meta);
    }
    
    return NextResponse.json(
      { 
        error: "Error processing event",
        type,
        message: error.message 
      },
      { status: 500 }
    );
  }
}

// Endpoint GET para verificar que el webhook está activo
export async function GET() {
  return NextResponse.json({
    status: "active",
    message: "Clerk webhook endpoint is working",
    timestamp: new Date().toISOString()
  });
}