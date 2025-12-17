import { Community } from "@/types/community";
import { Users } from "lucide-react";
import Link from "next/link";

export default function CommunityCard({ community }: { community: Community }) {
  return (
    <div className="bg-neutral-900 border-2 border-neutral-800 rounded-xl p-5 hover:border-red-600 transition-all">
      <h3 className="text-xl font-bold text-white mb-2">
        {community.name}
      </h3>

      <p className="text-neutral-400 text-sm mb-4 line-clamp-3">
        {community.description}
      </p>

      <div className="flex justify-between items-center text-sm text-neutral-400">
        <span className="flex items-center gap-1">
          <Users className="w-4 h-4" />
          {community.memberCount} miembros
        </span>

        <span className="bg-neutral-800 px-2 py-1 rounded text-xs">
          {community.topic}
        </span>
      </div>

      <Link
        href={`/communities/${community.id}`}
        className="block mt-4 text-center py-2 rounded-lg bg-neutral-800 hover:bg-red-600 transition text-white font-semibold"
      >
        Ver comunidad
      </Link>
    </div>
  );
}
