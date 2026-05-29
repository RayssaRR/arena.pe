"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Calendar, MapPin, CheckCircle, XCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getEventById, resolvePublicAssetUrl, EventResponse } from "@/lib/api";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8080";

type UserTicket = {
  ticketId: string;
  eventTitle: string;
  eventId: string;
  ticketModelTitle: string;
  price: number;
  location: string;
  isValid: boolean;
  createdAt: string;
};

type PagedTickets = {
  content: UserTicket[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  isLast: boolean;
};

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).toUpperCase();
}

function formatDateShort(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).toUpperCase();
}

function fmt(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function TicketCard({ ticket, onViewTicket }: { ticket: UserTicket; onViewTicket: (id: string) => void }) {
  return (
    <div className="bg-white border rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
      {/* Header colorido */}
      <div className="bg-blue-600 px-5 py-4 text-white flex items-center justify-between">
        <div>
          <p className="text-xs text-blue-200 uppercase tracking-wider">Arena Pernambuco</p>
          <p className="font-semibold text-sm mt-0.5">{ticket.ticketModelTitle || ticket.location}</p>
        </div>
        <div className="flex items-center gap-1.5">
          {ticket.isValid ? (
            <>
              <CheckCircle className="w-4 h-4 text-green-300" />
              <span className="text-xs font-medium text-green-300">Válido</span>
            </>
          ) : (
            <>
              <XCircle className="w-4 h-4 text-red-300" />
              <span className="text-xs font-medium text-red-300">Inválido</span>
            </>
          )}
        </div>
      </div>

      {/* Separador estilo ingresso */}
      <div className="border-t-2 border-dashed border-gray-200 mx-4" />

      {/* Detalhes */}
      <div className="px-5 py-4 grid grid-cols-2 gap-3">
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide">Setor</p>
          <p className="text-sm font-semibold text-gray-800 mt-0.5">{ticket.location}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide">Preço</p>
          <p className="text-sm font-semibold text-gray-800 mt-0.5">{fmt(ticket.price)}</p>
        </div>
        <div className="col-span-2">
          <p className="text-xs text-gray-400 uppercase tracking-wide">Comprado em</p>
          <p className="text-sm font-medium text-gray-600 mt-0.5">{formatDateShort(ticket.createdAt)}</p>
        </div>
      </div>

      {/* Ação */}
      <div className="px-5 pb-4">
        <Button
          onClick={() => onViewTicket(ticket.ticketId)}
          className="w-full bg-(--blue) hover:bg-(--blue-hover) cursor-pointer text-sm"
        >
          Ver Ingresso
        </Button>
      </div>
    </div>
  );
}

function MyEventContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const eventId = searchParams?.get("id");

  const [event, setEvent] = useState<EventResponse | null>(null);
  const [tickets, setTickets] = useState<UserTicket[]>([]);
  const [isLoadingEvent, setIsLoadingEvent] = useState(true);
  const [isLoadingTickets, setIsLoadingTickets] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!eventId) {
      setError("ID do evento não encontrado.");
      setIsLoadingEvent(false);
      setIsLoadingTickets(false);
      return;
    }

    async function loadEvent() {
      try {
        const data = await getEventById(eventId!);
        setEvent(data);
      } catch {
        setError("Não foi possível carregar o evento.");
      } finally {
        setIsLoadingEvent(false);
      }
    }

    loadEvent();
  }, [eventId]);

  useEffect(() => {
    if (!eventId) return;

    async function loadTickets() {
      try {
        setIsLoadingTickets(true);
        const token = localStorage.getItem("authToken");
        if (!token) throw new Error("Token não encontrado.");

        const res = await fetch(
          `${BACKEND_URL}/reservation/events/${eventId}/tickets?page=${page}&pageSize=6`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!res.ok) throw new Error("Erro ao buscar ingressos.");
        const data: PagedTickets = await res.json();
        setTickets(data.content);
        setTotalPages(data.totalPages);
      } catch {
        setError("Não foi possível carregar os ingressos.");
      } finally {
        setIsLoadingTickets(false);
      }
    }

    loadTickets();
  }, [eventId, page]);

  if (error) {
    return (
      <div className="min-h-screen bg-[#F5F7F8] flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-red-500">{error}</p>
          <Button onClick={() => router.push("/dashboard-user")} className="cursor-pointer">
            Voltar
          </Button>
        </div>
      </div>
    );
  }

  const imageUrl = resolvePublicAssetUrl(event?.imageUrl);

  return (
    <div className="min-h-screen bg-[#F5F7F8]">
      <main className="p-8 max-w-5xl mx-auto space-y-8">

        {/* Hero do evento */}
        <section className="relative rounded-3xl h-64 overflow-hidden shadow-xl">
          {isLoadingEvent ? (
            <div className="absolute inset-0 bg-gray-300 animate-pulse" />
          ) : (
            <>
              {imageUrl ? (
                <img src={imageUrl} alt={event?.title} className="absolute inset-0 w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 bg-gray-700" />
              )}
              <div className="absolute inset-0 bg-black/60" />
              <div className="relative z-10 text-white p-8 h-full flex flex-col justify-end gap-2">
                <p className="bg-(--blue) p-1 rounded-full font-bold w-fit px-4 text-sm">
                  {event?.category?.title ?? "Geral"}
                </p>
                <h1 className="title-h1 text-white">{event?.title}</h1>
                <div className="flex gap-6 text-sm text-white/80">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    <span>{event?.eventDate ? formatDate(event.eventDate) : "—"}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    <span>Arena Pernambuco, Recife</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </section>

        {/* Descrição */}
        {event?.description && (
          <section className="bg-white rounded-2xl p-6 border">
            <h2 className="title-h3 mb-2">Sobre o Evento</h2>
            <p className="text-gray-600 text-sm leading-relaxed">{event.description}</p>
          </section>
        )}

        {/* Meus Ingressos */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="title-h3">Meus Ingressos</h2>
            <span className="text-sm text-gray-500">
              {tickets.length} ingresso{tickets.length !== 1 ? "s" : ""} encontrado{tickets.length !== 1 ? "s" : ""}
            </span>
          </div>

          {isLoadingTickets ? (
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white border rounded-2xl h-48 animate-pulse" />
              ))}
            </div>
          ) : tickets.length === 0 ? (
            <div className="bg-white border rounded-2xl p-8 text-center">
              <Clock className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">Nenhum ingresso encontrado para este evento.</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {tickets.map((ticket) => (
                <TicketCard
                  key={ticket.ticketId}
                  ticket={ticket}
                  onViewTicket={(id) => router.push(`/ticket?ticketId=${id}`)}
                />
              ))}
            </div>
          )}

          {/* Paginação */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-3 mt-6">
              <Button
                variant="outline"
                disabled={page === 0}
                onClick={() => setPage((p) => p - 1)}
                className="cursor-pointer"
              >
                Anterior
              </Button>
              <span className="text-sm text-gray-500 self-center">
                Página {page + 1} de {totalPages}
              </span>
              <Button
                variant="outline"
                disabled={page + 1 >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="cursor-pointer"
              >
                Próxima
              </Button>
            </div>
          )}
        </section>

      </main>
    </div>
  );
}

export default function MyEventPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#F5F7F8]">
        <p className="text-gray-500 animate-pulse">Carregando...</p>
      </div>
    }>
      <MyEventContent />
    </Suspense>
  );
}