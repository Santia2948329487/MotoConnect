// src/app/communities/page.tsx
import CommunityCard from '@/components/cards/CommunityCard';
import Link from 'next/link';
import { mockCommunities } from '@/lib/mockData'; 



export default function CommunitiesPage() {
  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-400">Comunidades Moteras 🏍️💬</h1>
        <Link href="/communities/create" className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium">
          + Crear Comunidad
        </Link>
      </div>
      
      {/* Grid Responsivo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockCommunities.map(community => (
          <CommunityCard key={community.id} community={community} />
        ))}
      </div>
    </div>
  );
}