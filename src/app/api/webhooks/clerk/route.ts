import { Webhook } from "svix";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 1️⃣ Verificamos el webhook con la firma de Clerk
export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error("Missing CLERK_WEBHOOK_SECRET");
  }

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
    console.error("Error verificando webhook:", err);
    return new NextResponse("Invalid signature", { status: 400 });
  }

  // 2️⃣ Procesamos el evento
  const { type, data } = evt;

  switch (type) {
    case "user.created":
      await prisma.user.create({
        data: {
          clerkId: data.id,
          name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
          email: data.email_addresses[0].email_address,
        },
      });
      break;

    case "user.updated":
      await prisma.user.update({
        where: { clerkId: data.id },
        data: {
          name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
          email: data.email_addresses[0].email_address,
        },
      });
      break;

    case "user.deleted":
      await prisma.user.delete({
        where: { clerkId: data.id },
      });
      break;

    default:
      console.log(`Evento no manejado: ${type}`);
  }

  return NextResponse.json({ received: true });
}
