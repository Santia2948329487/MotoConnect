// src/app/routes/[id]/CommentsList.tsx
'use client';

import { User, Clock } from 'lucide-react';

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  author: {
    id: string;
    name: string;
  };
}

export default function CommentsList({ comments }: { comments: Comment[] }) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Hoy';
    if (days === 1) return 'Ayer';
    if (days < 7) return `Hace ${days} días`;
    if (days < 30) return `Hace ${Math.floor(days / 7)} semanas`;
    return date.toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  if (comments.length === 0) {
    return (
      <div className="text-center py-8">
        <User className="w-12 h-12 text-neutral-700 mx-auto mb-3" />
        <p className="text-neutral-500">Aún no hay comentarios</p>
        <p className="text-sm text-neutral-600 mt-1">Sé el primero en comentar</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div
          key={comment.id}
          className="bg-neutral-800/50 border border-neutral-700 rounded-lg p-4 hover:border-red-600/30 transition-colors"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">
                {comment.author.name[0]?.toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-bold text-red-500">{comment.author.name}</p>
                <div className="flex items-center gap-1 text-xs text-neutral-500">
                  <Clock className="w-3 h-3" />
                  <span>{formatDate(comment.createdAt)}</span>
                </div>
              </div>
              <p className="text-neutral-300 text-sm leading-relaxed whitespace-pre-wrap break-words">
                {comment.content}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}