// src/components/navigation/Navbar.tsx
'use client'; 

import Link from 'next/link';
// Importa los componentes de Clerk
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'; 
import { SunIcon, MoonIcon, MenuIcon } from 'lucide-react'; // Asumiendo que usas lucide/react-icons

const NavLinks = [
  { href: '/routes', label: 'Rutas' },
  { href: '/workshops', label: 'Mapa de Talleres' },
  { href: '/communities', label: 'Comunidades' },
];

interface NavbarProps {
  // Asumiendo que esta prop maneja el dark/light mode
  toggleTheme: () => void; 
  isDark: boolean;
}

export default function Navbar({ toggleTheme, isDark }: NavbarProps) {
  // Aquí puedes usar useState y useEffect para manejar un menú móvil
  // const [isOpen, setIsOpen] = useState(false); 

  return (
    <nav className="sticky top-0 z-50 bg-gray-900 border-b border-gray-700/50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo y Nombre de la Aplicación */}
          <Link href="/" className="text-2xl font-bold text-blue-400 hover:text-blue-300 transition-colors">
            MotoConnect 🏍️
          </Link>

          {/* Links de Navegación (Desktop) */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Estos links solo son visibles si el usuario está logueado */}
            <SignedIn>
              {NavLinks.map((link) => (
                <Link 
                  key={link.href} 
                  href={link.href} 
                  className="text-gray-300 hover:text-blue-400 transition-colors font-medium"
                >
                  {link.label}
                </Link>
              ))}
            </SignedIn>
          </div>

          {/* Botones de Usuario, Tema y Menú Móvil */}
          <div className="flex items-center space-x-3">
            
            {/* Botón de Modo Oscuro/Claro */}
            <button onClick={toggleTheme} className="p-2 rounded-full text-gray-400 hover:bg-gray-700 transition-colors">
              {isDark ? <SunIcon size={20} /> : <MoonIcon size={20} />}
            </button>
            
            {/* Componente de Perfil de Clerk (Cuando está logueado) */}
            <SignedIn>
              {/* UserButton de Clerk muestra el avatar y un menú desplegable de perfil */}
              <UserButton afterSignOutUrl="/" /> 
            </SignedIn>

            {/* Botones de Login/Registro (Cuando está invitado) */}
            <SignedOut>
              <Link href="/login" className="py-1.5 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium text-sm">
                Login
              </Link>
            </SignedOut>

            {/* Botón de Menú Móvil (Hamburguesa) */}
            {/* TODO: Implementar el modal/sidebar para el menú móvil */}
            <button className="md:hidden p-2 rounded-full text-gray-400 hover:bg-gray-700 transition-colors">
              <MenuIcon size={20} />
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
}