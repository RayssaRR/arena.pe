"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8080";

type Ticket = {
  id: string;
  title: string;
  eventDate: string;
  location: string;
  sector: string;
  quantity: number;
  total: number;
  status: "UPCOMING" | "COMPARECEU" | "PERDEU";
};

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" }).toUpperCase();
}

function fmt(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

const STATUS_CONFIG = {
  UPCOMING: { label: "Próximo", className: "bg-blue-100 text-blue-700" },
  COMPARECEU: { label: "Compareceu", className: "bg-(--green-light) text-(--green-dark)" },
  PERDEU: { label: "Perdeu", className: "bg-red-100 text-red-600" },
};

function MyTicketsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialFilter = searchParams?.get("filter") === "past" ? "past" : "upcoming";

  const [filter, setFilter] = useState<"upcoming" | "past">(initialFilter);
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

        const res = await fetch(`${BACKEND_URL}/user/tickets/${filter}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Erro ao buscar ingressos");
        setTickets(await res.json());
      } catch {
        setError("Não foi possível carregar seus ingressos.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchTickets();
  }, [filter]);

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

      {/* Tabs */}
      <div className="flex bg-gray-200 rounded-xl p-1 w-fit gap-1 mb-8">
        <button
          type="button"
          onClick={() => setFilter("upcoming")}
          className={`px-6 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${
            filter === "upcoming" ? "bg-white text-(--blue) shadow" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Próximos
        </button>
        <button
          type="button"
          onClick={() => setFilter("past")}
          className={`px-6 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${
            filter === "past" ? "bg-white text-(--blue) shadow" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Histórico
        </button>
      </div>

      {/* Content */}
      {isLoading ? (
        <p className="text-sm text-muted-foreground animate-pulse">Carregando ingressos...</p>
      ) : error ? (
        <p className="text-sm text-destructive">{error}</p>
      ) : tickets.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400 space-y-2">
          <p className="text-lg font-medium">Nenhum ingresso encontrado</p>
          <p className="text-sm">
            {filter === "upcoming" ? "Você não tem eventos próximos." : "Você ainda não foi a nenhum evento."}
          </p>
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
                <th className="px-5 py-3">Qtd.</th>
                <th className="px-5 py-3">Total</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => {
                const status = STATUS_CONFIG[ticket.status] ?? STATUS_CONFIG.UPCOMING;
                return (
                  <tr
                    key={ticket.id}
                    className="border-t hover:bg-gray-50 transition cursor-pointer"
                    onClick={() => router.push(`/ticket?ticketId=${ticket.id}`)}
                  >
                    <td className="px-5 py-4 font-medium text-gray-800">{ticket.title}</td>
                    <td className="px-5 py-4 text-sm text-gray-500">{formatDate(ticket.eventDate)}</td>
                    <td className="px-5 py-4 text-sm text-gray-500">{ticket.sector || "—"}</td>
                    <td className="px-5 py-4 text-sm text-gray-500">{ticket.quantity}</td>
                    <td className="px-5 py-4 text-sm font-medium text-gray-800">{fmt(ticket.total)}</td>
                    <td className="px-5 py-4">
                      <span className={`px-3 py-1 rounded-2xl text-xs font-medium ${status.className}`}>
                        {status.label}
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