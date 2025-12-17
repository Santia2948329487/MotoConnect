// src/types/community.ts

export interface Community {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  topic: string; // Ej: Off-Road, Viajes Largos, Mantenimiento
  creatorName: string;
  image: string;
}