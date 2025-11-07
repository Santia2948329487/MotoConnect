// prisma.config.ts
import { defineConfig } from "@prisma/config";
import * as dotenv from "dotenv";

// 🔹 Cargamos las variables del .env manualmente
dotenv.config();

export default defineConfig({
  schema: "./prisma/schema.prisma",
});
