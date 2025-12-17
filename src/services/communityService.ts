/* eslint-disable @typescript-eslint/no-explicit-any */
import { Community } from "@/types/community";

/* ---------- Base URL (MISMO patrón que routes) ---------- */
const getBaseUrl = () => {
  if (typeof window === "undefined") {
    if (process.env.NODE_ENV === "development") {
      return "http://localhost:3000/api";
    }
    return (
      process.env.NEXT_PUBLIC_API_URL ||
      "https://motoconnect.vercel.app/api"
    );
  }
  return "/api";
};

const API_BASE = getBaseUrl();

/* ---------- Tipado de respuesta ---------- */
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/* =========================================================
   1️⃣ Obtener TODAS las comunidades
========================================================= */
export async function fetchAllCommunities(): Promise<Community[]> {
  try {
    const res = await fetch(`${API_BASE}/communities`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      throw new Error(`Error ${res.status}`);
    }

    const result: ApiResponse<any[]> = await res.json();

    if (!result.success || !result.data) {
      throw new Error(result.error || "Error cargando comunidades");
    }

    return result.data.map((community) => ({
      id: community.id,
      name: community.name,
      description: community.description || "",
      memberCount: community.memberCount ?? 0,
      topic: community.topic || "General",
      creatorName: community.creator?.name || "Anónimo",
      image: community.image || "",
    }));
  } catch (error) {
    console.error("Error fetching communities:", error);
    throw error;
  }
}

/* =========================================================
   2️⃣ Obtener UNA comunidad por ID  ✅ (LA QUE FALTABA)
========================================================= */
export async function fetchCommunityById(
  id: string
): Promise<Community | null> {
  try {
    const res = await fetch(`${API_BASE}/communities/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error(`Error ${res.status}`);
    }

    const result: ApiResponse<any> = await res.json();

    if (!result.success || !result.data) {
      return null;
    }

    const community = result.data;

    return {
      id: community.id,
      name: community.name,
      description: community.description || "",
      memberCount: community.memberCount ?? 0,
      topic: community.topic || "General",
      creatorName: community.creator?.name || "Anónimo",
        image: community.image || "",
    };
  } catch (error) {
    console.error("Error fetching community:", error);
    return null;
  }
}
