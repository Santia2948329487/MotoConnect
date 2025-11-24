// src/app/routes/FilterButton.tsx
'use client';

import { useRouter } from 'next/navigation';

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
    <select
      className="py-2 px-4 bg-gray-800 text-white rounded-md border border-gray-700 hover:border-blue-500 transition-colors"
      value={currentDifficulty || ""}
      onChange={(e) => handleChange(e.target.value)}
    >
      <option value="">Todas las dificultades</option>
      <option value="Fácil">Fácil</option>
      <option value="Media">Media</option>
      <option value="Difícil">Difícil</option>
    </select>
  );
}