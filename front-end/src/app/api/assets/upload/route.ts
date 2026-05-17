import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;
const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

export const runtime = "nodejs";

function resolveExtension(file: File): string {
  const originalExt = path.extname(file.name).toLowerCase();
  if (originalExt) {
    return originalExt;
  }

  switch (file.type) {
    case "image/jpeg":
      return ".jpg";
    case "image/png":
      return ".png";
    case "image/webp":
      return ".webp";
    case "image/gif":
      return ".gif";
    default:
      return ".bin";
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const fileEntry = formData.get("file");

    if (!(fileEntry instanceof File)) {
      return NextResponse.json({ error: "Arquivo nao enviado." }, { status: 400 });
    }

    if (!ALLOWED_MIME_TYPES.has(fileEntry.type)) {
      return NextResponse.json({ error: "Tipo de arquivo nao permitido." }, { status: 400 });
    }

    if (fileEntry.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json({ error: "Arquivo excede 10MB." }, { status: 400 });
    }

    const extension = resolveExtension(fileEntry);
    const filename = `${randomUUID()}${extension}`;

    const assetsDir = path.join(process.cwd(), "public", "assets", "uploads");
    await fs.mkdir(assetsDir, { recursive: true });

    const filePath = path.join(assetsDir, filename);
    const bytes = Buffer.from(await fileEntry.arrayBuffer());

    await fs.writeFile(filePath, bytes);

    return NextResponse.json({ filename }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Falha ao salvar imagem." }, { status: 500 });
  }
}
