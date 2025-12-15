// src/app/workshops/new/page.tsx
'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react'; // Importar el ícono de flecha
import Link from 'next/link'; // Importar Link para el botón de navegación

// Asumiendo que workshop-map maneja su propio estilo para el mapa.
const Map = dynamic(() => import('./workshop-map'), { ssr: false });

export default function CreateWorkshopPage() {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [services, setServices] = useState('');
  const [description, setDescription] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!position) return alert('Debes seleccionar una ubicación en el mapa');

    const res = await fetch('/api/workshops', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        description,
        phone,
        services,
        address: 'Sin dirección especificada', // O puedes pedirla en el form
        latitude: Number(position[0]),
        longitude: Number(position[1]),
      }),
    });

    const data = await res.json();
    console.log('SERVER RESPONSE:', data);

    if (res.ok) {
      alert('Taller creado correctamente');
      // La ruta para redirigir a la lista de talleres es /workshops
      router.push('/workshops');
    } else {
      alert('Error al crear el taller: ' + (data.error || 'desconocido'));
    }
  };

  // La función handleBack ya no es necesaria con el componente Link.
  /*
  const handleBack = () => {
    router.push("/workshops"); // Redirige a la página de listado de talleres
  };
  */

  return (
    // Contenedor principal con fondo oscuro y padding de la landing page.
    <div className="min-h-screen bg-neutral-950 text-white pt-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto pb-12">
        
        {/* MODIFICACIÓN: Nuevo Botón de Regreso (Estilo compacto) */}
        <div className="mb-6">
          <Link href="/workshops"> {/* Aseguramos que apunte a /workshops */}
            <button className="p-2 bg-neutral-800 hover:bg-red-600 text-white rounded-lg transition-colors border border-neutral-700 hover:border-red-600">
              <ArrowLeft className="w-5 h-5" />
            </button>
          </Link>
        </div>
        {/* FIN - Botón de Regreso */}

        <h1 className="text-4xl font-black mb-2 text-red-600">
          Registrar Nuevo Taller 🔧
        </h1>

        <p className="text-neutral-400 mb-6">
          Haz clic en el mapa para seleccionar la ubicación exacta del taller.
        </p>

        {/* Mapa con borde que sigue la estética de la landing page */}
        <div className="h-[400px] rounded-xl overflow-hidden mb-8 border-2 border-red-900/50 shadow-lg shadow-black/50">
          <Map onSelectPosition={setPosition} />
        </div>

        {/* Formulario con estilo oscuro y borde de acento */}
        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-neutral-900 border-2 border-red-600/50 p-8 rounded-xl shadow-2xl"
        >
          {/* Campo Nombre */}
          <div>
            <label className="block text-sm font-medium mb-2 text-neutral-300">
              Nombre del Taller
            </label>
            <input
              className="w-full p-3 rounded-lg bg-neutral-800 border border-neutral-700 focus:border-red-600 focus:ring-1 focus:ring-red-600 text-white transition-colors"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Campo Teléfono */}
          <div>
            <label className="block text-sm font-medium mb-2 text-neutral-300">
              Teléfono
            </label>
            <input
              className="w-full p-3 rounded-lg bg-neutral-800 border border-neutral-700 focus:border-red-600 focus:ring-1 focus:ring-red-600 text-white transition-colors"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          {/* Campo Servicios */}
          <div>
            <label className="block text-sm font-medium mb-2 text-neutral-300">
              Servicios (separados por comas)
            </label>
            <input
              className="w-full p-3 rounded-lg bg-neutral-800 border border-neutral-700 focus:border-red-600 focus:ring-1 focus:ring-red-600 text-white transition-colors"
              placeholder="Ej: Mecánica, Eléctrico, Cambio de aceite"
              value={services}
              onChange={(e) => setServices(e.target.value)}
            />
          </div>

          {/* Campo Descripción */}
          <div>
            <label className="block text-sm font-medium mb-2 text-neutral-300">
              Descripción
            </label>
            <textarea
              className="w-full p-3 rounded-lg bg-neutral-800 border border-neutral-700 focus:border-red-600 focus:ring-1 focus:ring-red-600 text-white transition-colors"
              value={description}
              rows={3}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          {/* Botón de Registro con estilo de la landing page */}
          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 p-4 rounded-lg text-white font-semibold text-lg transition-colors border-2 border-red-600"
          >
            Registrar Taller
          </button>
        </form>
      </div>
    </div>
  );
}