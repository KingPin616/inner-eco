import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";

function sanitizeId(id: string): string {
  return id.trim().replace(/[^a-zA-Z0-9_-]+/g, "-").replace(/^-+|-+$/g, "") || "plant";
}

export async function POST(request: NextRequest) {
  if (process.env.VERCEL === "1") {
    return NextResponse.json(
      {
        error:
          "This deployment is read-only on Vercel. QR files cannot be persisted here. Generate/download locally if you need saved PNG files.",
      },
      { status: 503 },
    );
  }

  try {
    const body = (await request.json()) as { id?: string; qrDataUrl?: string };
    const id = typeof body.id === "string" ? body.id : "";
    const qrDataUrl = typeof body.qrDataUrl === "string" ? body.qrDataUrl : "";

    if (!id.trim()) {
      return NextResponse.json({ error: "Missing plant id." }, { status: 400 });
    }

    if (!qrDataUrl.startsWith("data:image/png;base64,")) {
      return NextResponse.json({ error: "Invalid QR image data." }, { status: 400 });
    }

    const base64 = qrDataUrl.slice("data:image/png;base64,".length);
    const buffer = Buffer.from(base64, "base64");
    const fileName = `${sanitizeId(id)}-qr.png`;
    const qrDirectory = path.join(process.cwd(), "public", "qr");
    const outputFilePath = path.join(qrDirectory, fileName);

    await mkdir(qrDirectory, { recursive: true });
    await writeFile(outputFilePath, buffer);

    return NextResponse.json({ path: `/qr/${encodeURIComponent(fileName)}` });
  } catch {
    return NextResponse.json({ error: "Could not save QR image." }, { status: 500 });
  }
}