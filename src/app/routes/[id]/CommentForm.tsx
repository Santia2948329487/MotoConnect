/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/routes/[id]/CommentForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Send, Loader2 } from 'lucide-react';

export default function CommentForm({ routeId }: { routeId: string }) {
  const router = useRouter();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      setError('El comentario no puede estar vacío');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/routes/${routeId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Error al publicar el comentario');
      }

      // Limpiar formulario y recargar
      setContent('');
      router.refresh();
      
    } catch (err: any) {
      console.error('Error:', err);
      setError(err.message || 'Error al publicar el comentario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 pb-6 border-b border-neutral-800">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Comparte tu experiencia o pregunta sobre la ruta..."
        className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none disabled:opacity-50"
        rows={4}
        disabled={loading}
      />
      
      {error && (
        <p className="text-red-400 text-sm mt-2">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading || !content.trim()}
        className="mt-3 px-6 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Publicando...
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            Publicar Comentario
          </>
        )}
      </button>
    </form>
  );
}