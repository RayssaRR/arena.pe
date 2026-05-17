import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:",
});

const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8080";

export async function postJson<TResponse = unknown, TPayload = unknown>(
  url: string,
  payload: TPayload,
): Promise<TResponse> {
  const { data } = await axios.post<TResponse>(url, payload, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return data;
}

export async function postJsonWithAuth<TResponse = unknown, TPayload = unknown>(
  url: string,
  payload: TPayload,
  token: string,
): Promise<TResponse> {
  const { data } = await axios.post<TResponse>(url, payload, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
}

export async function getJsonWithAuth<TResponse = unknown>(
  url: string,
  token: string,
): Promise<TResponse> {
  const { data } = await axios.get<TResponse>(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
}

export async function uploadImageToPublicAssets(
  file: File,
  token?: string,
): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${BACKEND_BASE_URL}/uploads`, {
    method: "POST",
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : undefined,
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Falha ao enviar imagem");
  }

  const payload: unknown = await response.json();
  if (!payload || typeof payload !== "object") {
    throw new Error("Resposta invalida do upload");
  }

  const path = (payload as { path?: unknown }).path;
  if (typeof path === "string" && path.trim()) {
    return path;
  }

  const filename = (payload as { filename?: unknown }).filename;
  if (typeof filename !== "string" || !filename.trim()) {
    throw new Error("Resposta sem filename");
  }

  return `/uploads/${filename}`;
}

export function resolvePublicAssetUrl(assetPath?: string): string | null {
  if (!assetPath) {
    return null;
  }

  const value = assetPath.trim();
  if (!value) {
    return null;
  }

  if (value.startsWith("http://") || value.startsWith("https://")) {
    return value;
  }

  if (value.startsWith("/uploads/") || value.startsWith("/assets/uploads/")) {
    const normalizedPath = value.startsWith("/assets/uploads/")
      ? value.replace("/assets/uploads/", "/uploads/")
      : value;

    return `${BACKEND_BASE_URL}${normalizedPath}`;
  }

  return `${BACKEND_BASE_URL}/${value.replace(/^\/+/, "")}`;
}