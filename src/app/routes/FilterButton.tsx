// src/app/routes/FilterButton.tsx
'use client';

import { useRouter } from 'next/navigation';
import { Filter } from 'lucide-react';

interface FilterButtonProps {
  currentDifficulty?: string;
}

export default function FilterButton({ currentDifficulty }: FilterButtonProps) {
  const router = useRouter();

  const handleChange = (value: string) => {
    if (value) {
      router.push(`/routes?difficulty=${value}`);
    } else {
      router.push('/routes');
    }
  };

  return (
    <div className="relative">
      <select
        className="appearance-none pl-10 pr-10 py-3 bg-neutral-900 text-white rounded-lg border-2 border-neutral-800 hover:border-red-600 focus:border-red-600 focus:outline-none transition-colors font-semibold cursor-pointer"
        value={currentDifficulty || ""}
        onChange={(e) => handleChange(e.target.value)}
      >
        <option value="">Todas las dificultades</option>
        <option value="Fácil">🟢 Fácil</option>
        <option value="Media">🟡 Media</option>
        <option value="Difícil">🔴 Difícil</option>
      </select>
      <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500 pointer-events-none" />
    </div>
  );
}