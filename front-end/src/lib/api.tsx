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

export async function getJson<TResponse = unknown>(
  url: string,
): Promise<TResponse> {
  const { data } = await axios.get<TResponse>(url, {
    headers: {
      "Content-Type": "application/json",
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

// Auth types
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  id?: string;
  name: string;
  email: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  role: "ADMIN" | "CUSTOMER";
}

// Auth functions
export async function register(payload: RegisterRequest): Promise<RegisterResponse> {
  const url = `${BACKEND_BASE_URL}/auth/register`;
  return postJson<RegisterResponse>(url, payload);
}

export async function login(payload: LoginRequest): Promise<LoginResponse> {
  const url = `${BACKEND_BASE_URL}/auth/login`;
  return postJson<LoginResponse>(url, payload);
}

// Event types
export interface Category {
  id: number;
  title: string;
  description?: string;
}

export interface CreateEventRequest {
  title: string;
  description: string;
  eventDate: string; // ISO 8601 format (2026-05-19T14:30:00)
  capacity: number;
  status: "UPCOMING" | "ONGOING" | "COMPLETED" | "CANCELED";
  imageUrl: string;
  categoryId: number;
}

export interface EventResponse {
  id: string;
  title: string;
  description: string;
  eventDate: string;
  capacity: number;
  ticketsSold: number;
  status: string;
  imageUrl: string;
  category?: Category;
}

// Event functions
export async function getCategories(token?: string): Promise<Category[]> {
  const url = `${BACKEND_BASE_URL}/categories`;
  if (token) {
    return getJsonWithAuth<Category[]>(url, token);
  }
  return getJson<Category[]>(url);
}

export async function createEvent(
  payload: CreateEventRequest,
  token: string
): Promise<EventResponse> {
  const url = `${BACKEND_BASE_URL}/events`;
  return postJsonWithAuth<EventResponse>(url, payload, token);
}

export async function getEvents(token?: string): Promise<EventResponse[]> {
  const url = `${BACKEND_BASE_URL}/events`;
  if (token) {
    return getJsonWithAuth<EventResponse[]>(url, token);
  }
  return getJson<EventResponse[]>(url);
}