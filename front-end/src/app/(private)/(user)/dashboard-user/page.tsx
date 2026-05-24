"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { getUserNameFromToken } from "@/lib/jwt-utils";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8080";

type UpcomingEvent = {
  id: string;
  title: string;
  description: string;
  eventDate: string;
  category: { id: number; title: string } | null;
  ticketType: string;
  location: string;
};

type PastEvent = {
  id: string;
  title: string;
  eventDate: string;
  location: string;
  status: "COMPARECEU" | "PERDEU";
};

function formatDateShort(dateStr: string): string {
  const date = new Date(dateStr);
  return date
    .toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    })
    .toUpperCase();
}

function formatDateLong(dateStr: string): string {
  const date = new Date(dateStr);
  return date
    .toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
    .toUpperCase();
}

function UpcomingEventCard({ event }: { event: UpcomingEvent }) {
  const router = useRouter();

  return (
    <Card className="mx-auto w-full pt-0">
      <CardHeader className="bg-black/70 text-white p-5">
        <p className="bg-white p-1 rounded-md text-(--blue) font-bold w-fit px-4">
          {event.category?.title ?? "Geral"}
        </p>
      </CardHeader>

      <CardContent className="space-y-2 p-5">
        <h4 className="body-lg font-semibold">{event.title}</h4>
        <p className="text-(--gray) text-sm line-clamp-2">{event.description}</p>
        <div className="pt-2 space-y-1">
          <p className="text-(--blue) font-bold text-sm">{formatDateShort(event.eventDate)}</p>
          <p className="text-sm text-gray-500">Informações do assento</p>
          <p className="text-sm font-medium">{event.ticketType}</p>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between gap-3 bg-white p-5">
        <Button
          onClick={() => router.push(`/event-details/${event.id}`)}
          className="bg-(--blue) hover:bg-(--blue-hover) cursor-pointer"
        >
          Obter Ingresso
        </Button>
        <Button
          variant="outline"
          className="border-red-400 text-red-500 hover:bg-red-50 cursor-pointer"
        >
          Cancelar
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function UserDashboard() {
  const [userName, setUserName] = useState("Usuário");
  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEvent[]>([]);
  const [pastEvents, setPastEvents] = useState<PastEvent[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const name = getUserNameFromToken();
    if (name) setUserName(name);

    async function fetchEvents() {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) return;

        const [upcomingRes, pastRes] = await Promise.all([
          fetch(`${BACKEND_URL}/user/tickets/upcoming`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${BACKEND_URL}/user/tickets/past`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (upcomingRes.ok) setUpcomingEvents(await upcomingRes.json());
        if (pastRes.ok) setPastEvents(await pastRes.json());
      } catch (err) {
        console.error("Erro ao carregar eventos:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchEvents();
  }, []);

  return (
    <main className="p-8 min-h-screen bg-[#F5F7F8]">

      {/* Barra de busca + sino */}
      <div className="flex items-center justify-center gap-4 mb-8">
        <div className="relative w-full max-w-lg">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Procure por shows, partidas de futebol..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <button type="button" className="p-2 rounded-full hover:bg-gray-100 transition cursor-pointer">
          <Bell className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Boas vindas */}
      <header className="space-y-1 mb-8">
        <h1 className="title-h1">Bem vindo de volta, {userName}!</h1>
        <p className="subtitle">
          Você tem {upcomingEvents.length} eventos programados para este mês. Pronto para curtir o espetáculo?
        </p>
      </header>

      {/* Próximos eventos */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="title-h3">Próximos Eventos</h3>
          <button type="button" className="text-sm text-(--blue) font-medium hover:underline cursor-pointer">
            Ver tudo
          </button>
        </div>

        {isLoading ? (
          <p className="text-sm text-muted-foreground animate-pulse">Carregando...</p>
        ) : upcomingEvents.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhum evento próximo encontrado.</p>
        ) : (
          <div className="grid grid-cols-2 gap-8">
            {upcomingEvents.slice(0, 2).map((event) => (
              <UpcomingEventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </section>

      {/* Últimos eventos */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="title-h3">Últimos Eventos</h3>
          <button type="button" className="text-sm text-(--blue) font-medium hover:underline cursor-pointer">
            Ver tudo
          </button>
        </div>

        {isLoading ? (
          <p className="text-sm text-muted-foreground animate-pulse">Carregando...</p>
        ) : pastEvents.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhum evento anterior encontrado.</p>
        ) : (
          <div className="border rounded-2xl overflow-hidden">
            <table className="w-full text-left">
              <thead className="text-gray-500 bg-gray-50">
                <tr>
                  <th className="px-4 py-3" scope="col">EVENTO</th>
                  <th className="px-4 py-3" scope="col">DATA</th>
                  <th className="px-4 py-3" scope="col">LOCAL</th>
                  <th className="px-4 py-3" scope="col">STATUS</th>
                </tr>
              </thead>
              <tbody>
                {pastEvents.map((event) => (
                  <tr key={event.id} className="border-t hover:bg-gray-50 transition cursor-pointer">
                    <td className="px-4 py-3">{event.title}</td>
                    <td className="px-4 py-3">{formatDateLong(event.eventDate)}</td>
                    <td className="px-4 py-3">{event.location}</td>
                    <td className="px-4 py-3">
                      <span className={`px-4 py-1 rounded-2xl text-sm font-medium ${
                        event.status === "COMPARECEU"
                          ? "bg-(--green-light) text-(--green-dark)"
                          : "bg-red-100 text-red-600"
                      }`}>
                        {event.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

    </main>
  );
}