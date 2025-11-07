// src/app/workshops/page.tsx
import MapDisplay from '@/components/MapDisplay';
import { mockWorkshops } from '@/lib/mockData';

export default function WorkshopsPage() {
  // Centro inicial: Un punto central en Colombia (ej. Medellín)
  const initialCenter: [number, number] = [6.2442, -75.5812]; 

  return (
    <div className="p-4 bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold text-blue-400 mb-4">
        Mapa de Talleres Moteros 🛠️
      </h1>
      <MapDisplay 
        locations={mockWorkshops.map(w => ({ ...w, id: String(w.id) }))} 
        initialCenter={initialCenter} 
        zoom={13} 
      />
    </div>
  );
}