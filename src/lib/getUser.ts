// src/lib/getUser.ts
import { auth, currentUser } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getUserFromDB() {
  const { userId: clerkId } = await auth();
  
  if (!clerkId) {
    return null;
  }

  let user = await prisma.user.findUnique({
    where: { clerkId }
  });

  if (!user) {
    const clerkUser = await currentUser();
    
    if (!clerkUser) {
      return null;
    }

    const email = clerkUser.emailAddresses?.[0]?.emailAddress || "";
    const name = `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() || "Usuario";

    user = await prisma.user.create({
      data: {
        clerkId,
        email,
        name,
      }
    });

    console.log("✅ Usuario auto-creado:", clerkId);
  }

  return user;
}