import { Users } from "lucide-react";
import JoinCommunityButton from "./JoinCommunityButton";
import { Community } from "@/types/community";

export default function CommunityHeader({
  community,
  isMember,
}: {
  community: Community;
  isMember: boolean;
}) {
  return (
    <div className="relative rounded-2xl overflow-hidden border border-neutral-800 mb-8">

      {/* Imagen */}
      <div
        className="h-52 bg-cover bg-center"
        style={{
          backgroundImage: `url(${
            community.image ||
            "https://images.unsplash.com/photo-1529429611270-128b2d7c8b38"
          })`,
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

      {/* Contenido */}
      <div className="absolute bottom-0 w-full p-6 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-white">
            {community.name}
          </h1>

          <p className="text-neutral-300 mt-1">
            Creada por {community.creatorName}
          </p>

          <div className="flex items-center gap-2 text-neutral-300 text-sm mt-2">
            <Users className="w-4 h-4" />
            {community.memberCount} miembros
          </div>
        </div>

        <JoinCommunityButton
          communityId={community.id}
          isMemberInitial={isMember}
        />
      </div>
    </div>
  );
}
