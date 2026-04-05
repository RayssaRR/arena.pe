import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:",
});

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

export async function uploadImageToPublicAssets(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/assets/upload", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Falha ao enviar imagem");
  }

  const payload: unknown = await response.json();
  if (!payload || typeof payload !== "object") {
    throw new Error("Resposta invalida do upload");
  }

  const filename = (payload as { filename?: unknown }).filename;
  if (typeof filename !== "string" || !filename.trim()) {
    throw new Error("Resposta sem filename");
  }

  return filename;
}