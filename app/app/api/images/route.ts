import { readdir } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

const ALLOWED_IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"]);

export async function GET() {
  const imageDirectoryPath = path.join(process.cwd(), "public", "image");

  try {
    const entries = await readdir(imageDirectoryPath, { withFileTypes: true });

    const images = entries
      .filter((entry) => {
        if (!entry.isFile()) {
          return false;
        }

        const extension = path.extname(entry.name).toLowerCase();
        return ALLOWED_IMAGE_EXTENSIONS.has(extension);
      })
      .map((entry) => ({
        fileName: entry.name,
        path: `/image/${encodeURIComponent(entry.name)}`,
      }))
      .sort((a, b) => a.fileName.localeCompare(b.fileName));

    return NextResponse.json({ images });
  } catch {
    return NextResponse.json({ images: [] });
  }
}
