import { fetchCommunityById } from "@/services/communityService";
import CommunityHeader from "./CommunityHeader";
import CommunityPosts from "./CommunityPosts";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

interface PageProps {
  params: { id: string } | Promise<{ id: string }>;
}

export default async function CommunityPage({ params }: PageProps) {
  const { id } = await params;

  const community = await fetchCommunityById(id);

  if (!community) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-neutral-400">
        Comunidad no encontrada
      </div>
    );
  }

  let isMember = false;
  try {
    const { userId } = await auth();
    if (userId) {
      const user = await prisma.user.findUnique({ where: { clerkId: userId } });
      if (user) {
        const membership = await prisma.communityMember.findFirst({
          where: { userId: user.id, communityId: id },
        });
        isMember = Boolean(membership);
      }
    }
  } catch (err) {
    console.error("Error checking membership:", err);
  }

  return (
    <div className="min-h-screen bg-neutral-950 pt-16">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <Link href="/communities" className="inline-block mb-4">
          <button className="p-2 bg-neutral-800 hover:bg-red-600 text-white rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </Link>

        <CommunityHeader community={community} isMember={isMember} />

        <p className="text-neutral-300 mb-10">
          {community.description || "Esta comunidad no tiene descripción."}
        </p>

        <CommunityPosts communityId={community.id} />
      </div>
    </div>
  );
}