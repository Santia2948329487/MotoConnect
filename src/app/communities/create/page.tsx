/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ArrowLeft, ImagePlus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateCommunityPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleFileChange(file: File) {
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (name.trim().length < 3) {
      setError("El nombre debe tener al menos 3 caracteres");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/communities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          image,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      router.push(`/communities/${data.data.id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-neutral-950 pt-16">
      <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-10">

        {/* PREVIEW */}
        <div className="space-y-4">
          <div className="aspect-video bg-neutral-800 rounded-xl overflow-hidden border border-neutral-700 flex items-center justify-center">
            {image ? (
              <img
                src={image}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-neutral-500">Vista previa</span>
            )}
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white">
              {name || "Nombre de la comunidad"}
            </h2>
            <p className="text-neutral-400 mt-1">
              {description || "Descripción de la comunidad"}
            </p>
          </div>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 space-y-5"
        >
          <div className="flex items-center gap-4 mb-4">
            <Link href="/communities">
              <button
                type="button"
                className="p-2 bg-neutral-800 hover:bg-red-600 rounded-lg"
              >
                <ArrowLeft />
              </button>
            </Link>
            <h1 className="text-3xl font-black text-white">
              Crear comunidad
            </h1>
          </div>

          {/* Imagen */}
          <div>
            <label className="block text-sm text-neutral-300 mb-2">
              Imagen
            </label>

            <div className="flex gap-3">
              <label className="flex items-center gap-2 px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg cursor-pointer hover:border-red-600">
                <ImagePlus size={18} />
                Subir imagen
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) =>
                    e.target.files && handleFileChange(e.target.files[0])
                  }
                />
              </label>

              <input
                type="url"
                placeholder="o pegar URL"
                className="flex-1 px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white"
                onChange={(e) => setImage(e.target.value)}
              />
            </div>
          </div>

          {/* Nombre */}
          <input
            className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white"
            placeholder="Nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          {/* Descripción */}
          <textarea
            className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white"
            rows={4}
            placeholder="Descripción"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            disabled={loading}
            className="w-full py-3 bg-red-600 hover:bg-red-700 rounded-lg font-bold text-white"
          >
            {loading ? "Creando..." : "Crear comunidad"}
          </button>
        </form>
      </div>
    </div>
  );
}
