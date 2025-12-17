// src/app/communities/page.tsx
import { fetchAllCommunities } from '@/services/communityService';
import CommunityCard from '@/components/cards/CommunityCard';
import Link from 'next/link';
import { Suspense } from 'react';
import { Plus, Users, ArrowLeft } from 'lucide-react';

// ======================
// Skeleton (igual a routes)
// ======================
function CommunitiesSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="bg-neutral-900 border-2 border-neutral-800 rounded-xl p-4 animate-pulse"
        >
          <div className="h-6 bg-neutral-800 rounded w-3/4 mb-3"></div>
          <div className="h-4 bg-neutral-800 rounded w-full mb-2"></div>
          <div className="h-4 bg-neutral-800 rounded w-5/6 mb-4"></div>
          <div className="space-y-2">
            <div className="h-3 bg-neutral-800 rounded w-1/2"></div>
            <div className="h-3 bg-neutral-800 rounded w-2/3"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ======================
// Empty state (igual a routes)
// ======================
function NoCommunitiesContent() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-20 h-20 bg-neutral-900 border-2 border-neutral-800 rounded-full flex items-center justify-center mb-6">
        <Users className="w-10 h-10 text-neutral-600" />
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">
        No hay comunidades disponibles
      </h2>
      <p className="text-neutral-400 mb-6">
        Sé el primero en crear una comunidad motera
      </p>
      <Link
        href="/communities/create"
        className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
      >
        <Plus className="w-5 h-5" />
        Crear Primera Comunidad
      </Link>
    </div>
  );
}

// ======================
// Content
// ======================
async function CommunitiesContent() {
  const communities = await fetchAllCommunities();

  if (communities.length === 0) {
    return <NoCommunitiesContent />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {communities.map((community) => (
        <CommunityCard key={community.id} community={community} />
      ))}
    </div>
  );
}

// ======================
// Page principal
// ======================
export default async function CommunitiesPage() {
  return (
    <div className="min-h-screen bg-neutral-950 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header (CLON de routes) */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          
          {/* Botón atrás + título */}
          <div className="flex items-center gap-6">
            <Link href="/dashboard">
              <button className="p-2 bg-neutral-800 hover:bg-red-600 text-white rounded-lg transition-colors border border-neutral-700 hover:border-red-600">
                <ArrowLeft className="w-6 h-6" />
              </button>
            </Link>

            <div>
              <h1 className="text-4xl font-black text-white mb-2">
                Comunidades 🏍️
              </h1>
              <p className="text-neutral-400">
                Únete, crea y conecta con otras comunidades moteras
              </p>
            </div>
          </div>

          {/* Botón crear */}
          <Link
            href="/communities/create"
            className="px-6 py-3 bg-red-600 hover:bg-red-700 border-2 border-red-600 text-white rounded-lg font-semibold transition-all hover:scale-105 whitespace-nowrap flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Crear Comunidad
          </Link>
        </div>

        <Suspense fallback={<CommunitiesSkeleton />}>
          <CommunitiesContent />
        </Suspense>

      </div>
    </div>
  );
}
