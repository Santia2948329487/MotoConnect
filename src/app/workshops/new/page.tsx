"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

const Map = dynamic(() => import("./workshop-map"), { ssr: false });

export default function CreateWorkshopPage() {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [services, setServices] = useState("");
  const [description, setDescription] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: any) => {
  e.preventDefault();
  if (!position) return alert("Debes seleccionar una ubicación en el mapa");

  const res = await fetch("/api/workshops", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name,
      description,
      phone,
      services,
      address: "Sin dirección especificada", // O puedes pedirla en el form
      latitude: Number(position[0]),
      longitude: Number(position[1]),
    }),
  });

  const data = await res.json();
  console.log("SERVER RESPONSE:", data);

  if (res.ok) {
    alert("Taller creado correctamente");
    router.push("/workshops");
  } else {
    alert("Error al crear el taller: " + (data.error || "desconocido"));
  }
};

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Registrar Nuevo Taller 🔧</h1>

      <p className="text-gray-400 mb-4">
        Haz clic en el mapa para seleccionar la ubicación del taller.
      </p>

      <div className="h-[400px] rounded overflow-hidden mb-6">
        <Map onSelectPosition={setPosition} />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 bg-neutral-900 p-6 rounded-xl">
        <div>
          <label>Nombre del Taller</label>
          <input
            className="w-full p-2 rounded bg-neutral-800"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Teléfono</label>
          <input
            className="w-full p-2 rounded bg-neutral-800"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div>
          <label>Servicios</label>
          <input
            className="w-full p-2 rounded bg-neutral-800"
            placeholder="Ej: Mecánica, Eléctrico, Cambio de aceite"
            value={services}
            onChange={(e) => setServices(e.target.value)}
          />
        </div>

        <div>
          <label>Descripción</label>
          <textarea
            className="w-full p-2 rounded bg-neutral-800"
            value={description}
            rows={3}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded text-white"
        >
          Registrar Taller
        </button>
      </form>
    </div>
  );
}
