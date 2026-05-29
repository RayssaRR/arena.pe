"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8080";

type Ticket = {
  ticketId: string;
  eventTitle: string;
  eventId: string;
  eventDate: string;
  eventStatus: "UPCOMING" | "ONGOING" | "FINISHED";
  price: number;
  location: string;
  ticketStatus: "VALIDO" | "RESGATADO" | "CANCELADO" | "EXPIRADO";
  createdAt: string;
};

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" }).toUpperCase();
}

const STATUS_CONFIG = {
  UPCOMING: { label: "Próximo", className: "bg-blue-100 text-blue-700" },
  ONGOING: { label: "Em andamento", className: "bg-yellow-100 text-yellow-700" },
  FINISHED: { label: "Finalizado", className: "bg-gray-100 text-gray-700" },
};

const TICKET_STATUS_CONFIG = {
  VALIDO: { label: "Válido", className: "bg-green-100 text-green-700" },
  RESGATADO: { label: "Resgatado", className: "bg-blue-100 text-blue-700" },
  CANCELADO: { label: "Cancelado", className: "bg-red-100 text-red-600" },
  EXPIRADO: { label: "Expirado", className: "bg-gray-100 text-gray-700" },
};

function MyTicketsContent() {
  const router = useRouter();

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTickets() {
      try {
        setIsLoading(true);
        setError(null);
        const token = localStorage.getItem("authToken");
        if (!token) return;

        const res = await fetch(`${BACKEND_URL}/reservation`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Erro ao buscar ingressos");
        const data = await res.json();
        setTickets(data.content || []);
      } catch {
        setError("Não foi possível carregar seus ingressos.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchTickets();
  }, []);

  return (
    <main className="p-8 min-h-screen bg-[#F5F7F8]">

      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          type="button"
          onClick={() => router.push("/dashboard-user")}
          className="p-2 rounded-full hover:bg-gray-200 transition cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h1 className="title-h1">Meus Ingressos</h1>
          <p className="subtitle">Todos os seus ingressos em um só lugar.</p>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <p className="text-sm text-muted-foreground animate-pulse">Carregando ingressos...</p>
      ) : error ? (
        <p className="text-sm text-destructive">{error}</p>
      ) : tickets.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400 space-y-2">
          <p className="text-lg font-medium">Nenhum ingresso encontrado</p>
          <button
            type="button"
            onClick={() => router.push("/event-discover")}
            className="mt-4 text-sm text-(--blue) font-medium hover:underline cursor-pointer"
          >
            Explorar eventos →
          </button>
        </div>
      ) : (
        <div className="border rounded-2xl overflow-hidden bg-white">
          <table className="w-full text-left">
            <thead className="text-gray-500 bg-gray-50 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3">Evento</th>
                <th className="px-5 py-3">Data</th>
                <th className="px-5 py-3">Setor</th>
                <th className="px-5 py-3">Preço</th>
                <th className="px-5 py-3">Status do Evento</th>
                <th className="px-5 py-3">Status do Ingresso</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => {
                const eventStatus = STATUS_CONFIG[ticket.eventStatus] ?? STATUS_CONFIG.UPCOMING;
                const ticketStatus = TICKET_STATUS_CONFIG[ticket.ticketStatus];
                return (
                  <tr
                    key={ticket.ticketId}
                    className="border-t hover:bg-gray-50 transition cursor-pointer"
                    onClick={() => router.push(`/ticket?ticketId=${ticket.ticketId}`)}
                  >
                    <td className="px-5 py-4 font-medium text-gray-800">{ticket.eventTitle}</td>
                    <td className="px-5 py-4 text-sm text-gray-500">{formatDate(ticket.eventDate)}</td>
                    <td className="px-5 py-4 text-sm text-gray-500">{ticket.location}</td>
                    <td className="px-5 py-4 text-sm font-medium text-gray-800">R$ {ticket.price.toFixed(2)}</td>
                    <td className="px-5 py-4">
                      <span className={`px-3 py-1 rounded-2xl text-xs font-medium ${eventStatus.className}`}>
                        {eventStatus.label}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-3 py-1 rounded-2xl text-xs font-medium ${ticketStatus.className}`}>
                        {ticketStatus.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

    </main>
  );
}

export default function MyTicketsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 animate-pulse">Carregando...</p>
      </div>
    }>
      <MyTicketsContent />
    </Suspense>
  );
}