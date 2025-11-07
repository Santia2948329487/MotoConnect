// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

// 1. Importa el ClerkProvider
import { ClerkProvider } from '@clerk/nextjs';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'MotoConnect',
  description: 'La red social para moteros de todo el mundo.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // <html> DEBE ser el elemento raíz
    <html lang="es">
      <body className={inter.className}>
        {/* 2. El Provider DEBE ir DENTRO del body, envolviendo los children */}
        <ClerkProvider>
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}