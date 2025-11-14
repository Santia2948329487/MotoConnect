import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/auth/login");
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <main className="pt-16">{children}</main>
    </div>
  );
}