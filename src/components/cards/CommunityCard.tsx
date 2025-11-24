// src/components/cards/CommunityCard.tsx
import { Community } from '@/types/community';
import Link from 'next/link';
import { Users, User } from 'lucide-react';

interface CommunityCardProps {
  community: Community;
}

export default function CommunityCard({ community }: CommunityCardProps) {
  return (
    <Link href={`/communities/${community.id}`} className="block group">
      <div className="bg-neutral-900 border-2 border-neutral-800 hover:border-red-600 rounded-xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-red-600/10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-2xl font-bold text-white line-clamp-2 flex-1 group-hover:text-red-500 transition-colors">
            {community.name}
          </h3>
          <div className="w-12 h-12 bg-blue-600/10 border border-blue-600/20 rounded-lg flex items-center justify-center flex-shrink-0 ml-3">
            <Users className="w-6 h-6 text-blue-500" />
          </div>
        </div>

        {/* Topic Badge */}
        <div className="mb-3">
          <span className="inline-block px-3 py-1 bg-red-600/10 border border-red-600/20 rounded-full text-red-500 text-sm font-semibold">
            {community.topic}
          </span>
        </div>
        
        {/* Description */}
        <p className="text-neutral-400 text-sm mb-4 line-clamp-2 leading-relaxed">
          {community.description}
        </p>
        
        {/* Footer */}
        <div className="pt-4 border-t border-neutral-800 flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-neutral-500">
            <Users className="w-4 h-4" />
            <span className="font-semibold text-white">
              {community.memberCount.toLocaleString()}
            </span>
            <span>miembros</span>
          </div>
          <div className="flex items-center gap-1 text-neutral-500 text-xs">
            <User className="w-3 h-3" />
            <span>{community.creatorName}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}