// src/app/routes/RetryButton.tsx
'use client';

export default function RetryButton() {
  return (
    <button 
      onClick={() => window.location.reload()} 
      className="py-2 px-6 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
    >
      Reintentar
    </button>
  );
}