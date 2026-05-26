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
    headers: { "Content-Type": "application/json" },
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
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}

// GET sem token e sem Content-Type (causa 403 em alguns servidores)
export async function getJson<TResponse = unknown>(
  url: string,
): Promise<TResponse> {
  const { data } = await axios.get<TResponse>(url);
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
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    body: formData,
  });

  if (!response.ok) throw new Error("Falha ao enviar imagem");

  const payload: unknown = await response.json();
  if (!payload || typeof payload !== "object") throw new Error("Resposta invalida do upload");

  const path = (payload as { path?: unknown }).path;
  if (typeof path === "string" && path.trim()) return path;

  const filename = (payload as { filename?: unknown }).filename;
  if (typeof filename !== "string" || !filename.trim()) throw new Error("Resposta sem filename");

  return `/uploads/${filename}`;
}

export function resolvePublicAssetUrl(assetPath?: string): string | null {
  if (!assetPath) return null;
  const value = assetPath.trim();
  if (!value) return null;
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  if (value.startsWith("/uploads/") || value.startsWith("/assets/uploads/")) {
    const normalizedPath = value.startsWith("/assets/uploads/")
      ? value.replace("/assets/uploads/", "/uploads/")
      : value;
    return `${BACKEND_BASE_URL}${normalizedPath}`;
  }
  return `${BACKEND_BASE_URL}/${value.replace(/^\/+/, "")}`;
}

// ── Auth ───────────────────────────────────────────────────────────────────

export interface RegisterRequest { name: string; email: string; password: string; }
export interface RegisterResponse { id?: string; name: string; email: string; }
export interface LoginRequest { email: string; password: string; }
export interface LoginResponse { token: string; role: "ADMIN" | "CUSTOMER"; }

export async function register(payload: RegisterRequest): Promise<RegisterResponse> {
  return postJson<RegisterResponse>(`${BACKEND_BASE_URL}/auth/register`, payload);
}

export async function login(payload: LoginRequest): Promise<LoginResponse> {
  return postJson<LoginResponse>(`${BACKEND_BASE_URL}/auth/login`, payload);
}

// ── Categories ─────────────────────────────────────────────────────────────

export interface Category { id: number; title: string; description?: string; }

export async function getCategories(token?: string): Promise<Category[]> {
  const url = `${BACKEND_BASE_URL}/categories`;
  return token ? getJsonWithAuth<Category[]>(url, token) : getJson<Category[]>(url);
}

// ── Events ─────────────────────────────────────────────────────────────────

export interface TicketSectorRequest { location: string; price: number; capacity: number; }

export interface CreateEventRequest {
  title: string;
  description: string;
  eventDate: string;
  capacity: number;
  status: "UPCOMING" | "ONGOING" | "COMPLETED" | "CANCELED";
  imageUrl: string;
  categoryId: number;
  ticketSectors?: TicketSectorRequest[];
}

export interface TicketSector { location: string; price: number; capacity: number; sold?: number; }

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
  ticketSectors?: TicketSector[];
}

export async function createEvent(payload: CreateEventRequest, token: string): Promise<EventResponse> {
  return postJsonWithAuth<EventResponse>(`${BACKEND_BASE_URL}/events`, payload, token);
}

export async function getEvents(token?: string): Promise<EventResponse[]> {
  const url = `${BACKEND_BASE_URL}/events`;
  return token ? getJsonWithAuth<EventResponse[]>(url, token) : getJson<EventResponse[]>(url);
}

export async function getEventById(id: string): Promise<EventResponse> {
  return getJson<EventResponse>(`${BACKEND_BASE_URL}/events/${id}`);
}

// ── Tickets / Reservations ─────────────────────────────────────────────────

export interface UserTicketResponse {
  ticketId: string;
  eventTitle: string;
  eventId: string;
  ticketModelTitle: string;
  price: number;
  location: string;
  isValid: boolean;
  createdAt: string;
}

export interface PagedUserTickets {
  content: UserTicketResponse[];
  currentPage: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  isLast: boolean;
}

export async function getUserTickets(
  token: string,
  page = 0,
  pageSize = 10,
  filterByValidity?: boolean
): Promise<PagedUserTickets> {
  const params = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
    sortBy: "createdAt",
    sortDirection: "desc",
  });
  if (filterByValidity !== undefined) params.append("filterByValidity", String(filterByValidity));
  return getJsonWithAuth<PagedUserTickets>(`${BACKEND_BASE_URL}/reservation?${params}`, token);
}

export async function cancelTicket(ticketId: string, token: string): Promise<void> {
  await axios.delete(`${BACKEND_BASE_URL}/reservation/${ticketId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function getTicketById(ticketId: string, token: string): Promise<UserTicketResponse> {
  return getJsonWithAuth<UserTicketResponse>(`${BACKEND_BASE_URL}/reservation/${ticketId}`, token);
}