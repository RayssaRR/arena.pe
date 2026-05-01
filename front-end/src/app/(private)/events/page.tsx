"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getJsonWithAuth, resolvePublicAssetUrl } from "@/lib/api";

type EventItem = {
  id?: string | number;
  title?: string;
  description?: string;
  eventDate?: string;
  capacity?: number;
  status?: string;
  imageUrl?: string;
};

type EditForm = {
  title: string;
  description: string;
  eventDate: string;
  capacity: number;
  status: string;
  imageUrl: string;
};

const EVENTOS_URL =
  process.env.NEXT_PUBLIC_EVENTOS_URL ?? "http://localhost:8080/events";

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  UPCOMING:  { label: "Em breve",     className: "bg-blue-100 text-blue-700" },
  ONGOING:   { label: "Em andamento", className: "bg-green-100 text-green-700" },
  COMPLETED: { label: "Encerrado",    className: "bg-gray-100 text-gray-600" },
  CANCELED:  { label: "Cancelado",    className: "bg-red-100 text-red-600" },
};

function normalizeEvents(payload: unknown): EventItem[] {
  if (Array.isArray(payload)) return payload as EventItem[];
  if (!payload || typeof payload !== "object") return [];
  const record = payload as Record<string, unknown>;
  if (Array.isArray(record.data)) return record.data as EventItem[];
  if (Array.isArray(record.events)) return record.events as EventItem[];
  return [];
}

function formatEventDate(value?: string): string {
  if (!value) return "Data não informada";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleString("pt-BR");
}

function toInputDate(value?: string): string {
  if (!value) return "";
  return value.split("T")[0];
}

export default function EventosPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [editForm, setEditForm] = useState<EditForm | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [editSuccess, setEditSuccess] = useState<string | null>(null);

  const [deletingEvent, setDeletingEvent] = useState<EventItem | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  async function loadEvents() {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setErrorMessage("Você precisa fazer login para ver os eventos.");
      setIsLoading(false);
      return;
    }
    try {
      const response = await getJsonWithAuth<unknown>(EVENTOS_URL, token);
      setEvents(normalizeEvents(response));
      setErrorMessage(null);
    } catch {
      setErrorMessage("Não foi possível carregar os eventos registrados.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => { loadEvents(); }, []);

  // DELETE
  function openDeleteModal(event: EventItem) {
    setDeletingEvent(event);
    setDeleteError(null);
  }

  function closeDeleteModal() {
    setDeletingEvent(null);
    setDeleteError(null);
  }

  async function handleDelete() {
    if (!deletingEvent?.id) return;
    const token = localStorage.getItem("authToken");
    if (!token) { setDeleteError("Você precisa estar autenticado."); return; }

    setIsDeleting(true);
    try {
      const res = await fetch(`${EVENTOS_URL}/${deletingEvent.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 404) { setDeleteError("Evento não encontrado"); return; }
      if (!res.ok) throw new Error();

      setEvents((prev) => prev.filter((e) => e.id !== deletingEvent.id));
      closeDeleteModal();
    } catch {
      setDeleteError("Não foi possível excluir o evento. Tente novamente.");
    } finally {
      setIsDeleting(false);
    }
  }

  // EDIT
  function openEditModal(event: EventItem) {
    setEditingEvent(event);
    setEditForm({
      title: event.title ?? "",
      description: event.description ?? "",
      eventDate: toInputDate(event.eventDate),
      capacity: event.capacity ?? 0,
      status: event.status ?? "UPCOMING",
      imageUrl: event.imageUrl ?? "",
    });
    setEditError(null);
    setEditSuccess(null);
  }

  function closeEditModal() {
    setEditingEvent(null);
    setEditForm(null);
    setEditError(null);
    setEditSuccess(null);
  }

  async function handleEdit() {
    if (!editingEvent?.id || !editForm) return;
    const token = localStorage.getItem("authToken");
    if (!token) { setEditError("Você precisa estar autenticado."); return; }

    setIsSubmitting(true);
    try {
      const res = await fetch(`${EVENTOS_URL}/${editingEvent.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: editForm.title,
          description: editForm.description,
          eventDate: `${editForm.eventDate}T00:00:00`,
          capacity: Number(editForm.capacity),
          status: editForm.status,
          imageUrl: editForm.imageUrl,
        }),
      });

      if (res.status === 404) { setEditError("Evento não encontrado"); return; }
      if (!res.ok) throw new Error();

      const updated: EventItem = await res.json();
      setEvents((prev) => prev.map((e) => (e.id === editingEvent.id ? { ...e, ...updated } : e)));
      setEditSuccess("Evento atualizado com sucesso.");
      setTimeout(() => closeEditModal(), 1200);
    } catch {
      setEditError("Não foi possível atualizar o evento. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-linear-to-b from-background via-background to-muted/40 px-4 py-10 sm:py-16">
      <section className="mx-auto w-full max-w-5xl space-y-6">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-semibold tracking-tight">Eventos registrados</h1>
            <p className="text-sm text-muted-foreground">Visualize todos os eventos cadastrados na plataforma.</p>
          </div>
          <Button asChild>
            <Link href="/events/registro">Novo evento</Link>
          </Button>
        </header>

        {isLoading && <p className="text-sm text-muted-foreground">Carregando eventos...</p>}

        {errorMessage && (
          <Card><CardContent><p className="text-sm text-destructive">{errorMessage}</p></CardContent></Card>
        )}

        {!isLoading && !errorMessage && events.length === 0 && (
          <Card><CardContent><p className="text-sm text-muted-foreground">Nenhum evento registrado até o momento.</p></CardContent></Card>
        )}

        {!isLoading && !errorMessage && events.length > 0 && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {events.map((event, index) => {
              const imageSrc = resolvePublicAssetUrl(event.imageUrl);
              const statusCfg = STATUS_CONFIG[event.status ?? ""] ?? { label: event.status ?? "Desconhecido", className: "bg-gray-100 text-gray-500" };

              return (
                <Card key={event.id ?? `${event.title}-${index}`}>
                  {imageSrc && (
                    <img src={imageSrc} alt={event.title ?? "Imagem do evento"} className="h-44 w-full object-cover" loading="lazy" />
                  )}
                  <CardHeader className="space-y-1">
                    <div className="flex items-center justify-between">
                      <CardTitle>{event.title ?? "Sem título"}</CardTitle>
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusCfg.className}`}>
                        {statusCfg.label}
                      </span>
                    </div>
                    <CardDescription>Data: {formatEventDate(event.eventDate)}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-sm text-muted-foreground">{event.description ?? "Sem descrição"}</p>
                    <p className="text-sm">Capacidade: {event.capacity ?? 0}</p>
                  </CardContent>
                  <div className="flex justify-end gap-2 px-6 pb-5">
                    <Button variant="outline" size="sm" onClick={() => openEditModal(event)}>Editar</Button>
                    <Button variant="destructive" size="sm" onClick={() => openDeleteModal(event)}>Excluir</Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </section>

      {/* Modal Excluir */}
      {deletingEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl space-y-4">
            <h2 className="text-lg font-semibold">Excluir evento</h2>
            <p className="text-sm text-muted-foreground">
              Tem certeza que deseja excluir <span className="font-medium text-foreground">"{deletingEvent.title}"</span>? Essa ação não pode ser desfeita.
            </p>
            {deleteError && <p className="text-sm text-destructive">{deleteError}</p>}
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={closeDeleteModal} disabled={isDeleting}>Cancelar</Button>
              <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                {isDeleting ? "Excluindo..." : "Excluir"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Editar */}
      {editingEvent && editForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-semibold">Editar evento</h2>
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-sm font-medium">Título</label>
                <input className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-blue-500"
                  value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Descrição</label>
                <textarea className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-blue-500 min-h-24 resize-none"
                  value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-sm font-medium">Data</label>
                  <input type="date" className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-blue-500"
                    value={editForm.eventDate} onChange={(e) => setEditForm({ ...editForm, eventDate: e.target.value })} />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Capacidade</label>
                  <input type="number" min={1} className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-blue-500"
                    value={editForm.capacity} onChange={(e) => setEditForm({ ...editForm, capacity: Number(e.target.value) })} />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Status</label>
                <select className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-blue-500"
                  value={editForm.status} onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}>
                  <option value="UPCOMING">Em breve</option>
                  <option value="ONGOING">Em andamento</option>
                  <option value="COMPLETED">Encerrado</option>
                  <option value="CANCELED">Cancelado</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">URL da imagem</label>
                <input className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-blue-500"
                  value={editForm.imageUrl} onChange={(e) => setEditForm({ ...editForm, imageUrl: e.target.value })} />
              </div>
            </div>
            {editError && <p className="text-sm text-destructive">{editError}</p>}
            {editSuccess && <p className="text-sm text-green-700">{editSuccess}</p>}
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={closeEditModal} disabled={isSubmitting}>Cancelar</Button>
              <Button onClick={handleEdit} disabled={isSubmitting}>
                {isSubmitting ? "Salvando..." : "Salvar alterações"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}