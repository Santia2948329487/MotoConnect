// src/components/cards/CommunityCard.tsx
import { Community } from '@/types/community';
import Link from 'next/link';

interface CommunityCardProps {
  community: Community;
}

export default function CommunityCard({ community }: CommunityCardProps) {
  return (
    <Link href={`/communities/${community.id}`} className="block">
      <div className="bg-gray-800 p-5 rounded-xl shadow-lg border-t-4 border-blue-500 hover:bg-gray-700 transition-colors">
        <h3 className="text-2xl font-bold text-white mb-2 truncate">{community.name}</h3>
        <p className="text-sm font-medium text-blue-400 mb-3">{community.topic}</p>
        
        <p className="text-gray-400 line-clamp-2">{community.description}</p>
        
        <div className="mt-4 flex justify-between items-center text-sm text-gray-400">
          <span>👥 {community.memberCount.toLocaleString()} Miembros</span>
          <span className="text-xs">Creador: {community.creatorName}</span>
        </div>
      </div>
    </Link>
  );
}