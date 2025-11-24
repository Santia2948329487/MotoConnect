// src/app/communities/page.tsx
import CommunityCard from '@/components/cards/CommunityCard';
import Link from 'next/link';
import { mockCommunities } from '@/lib/mockData';
import { Plus, Users } from 'lucide-react';

export default function CommunitiesPage() {
  return (
    <div className="min-h-screen bg-neutral-950 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-black text-white mb-2">Comunidades Moteras 🏍️💬</h1>
            <p className="text-neutral-400">
              Conecta con riders de todo el mundo
            </p>
          </div>
          
          <Link 
            href="/communities/create" 
            className="px-6 py-3 bg-red-600 hover:bg-red-700 border-2 border-red-600 text-white rounded-lg font-semibold transition-all hover:scale-105 whitespace-nowrap flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Crear Comunidad
          </Link>
        </div>
        
        {/* Grid */}
        {mockCommunities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockCommunities.map(community => (
              <CommunityCard key={community.id} community={community} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-neutral-900 border-2 border-neutral-800 rounded-full flex items-center justify-center mb-6">
              <Users className="w-10 h-10 text-neutral-600" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              No hay comunidades disponibles
            </h2>
            <p className="text-neutral-400 mb-6">
              Crea la primera comunidad y empieza a conectar
            </p>
          </div>
        )}
      </div>
    </div>
  );
}