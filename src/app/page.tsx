// src/app/page.tsx
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import LandingPage from "@/components/landing/LandingPage";

export default async function HomePage() {
  const { userId } = await auth();

  // Si está autenticado, ir al dashboard
  if (userId) {
    redirect("/dashboard");
  }

  // Si no está autenticado, mostrar landing page
  return <LandingPage />;
}