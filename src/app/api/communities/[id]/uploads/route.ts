import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as unknown as Blob | null;
    if (!file) return NextResponse.json({ error: "Archivo faltante" }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mime = (file as any).type || "application/octet-stream";
    const base64 = buffer.toString("base64");
    const dataUrl = `data:${mime};base64,${base64}`;

    return NextResponse.json({ url: dataUrl });
  } catch (err) {
    console.error("POST /api/communities/[id]/uploads error:", err);
    return NextResponse.json({ error: (err as Error)?.message ?? "Upload error" }, { status: 500 });
  }
}