"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
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
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }).toUpperCase();
}

function formatDateLong(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" }).toUpperCase();
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
        <Button onClick={() => router.push(`/event-details/${event.id}`)} className="bg-(--blue) hover:bg-(--blue-hover) cursor-pointer">
          Obter Ingresso
        </Button>
        <Button variant="outline" className="border-red-400 text-red-500 hover:bg-red-50 cursor-pointer">
          Cancelar
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function UserDashboard() {
  const router = useRouter();
  const [userName, setUserName] = useState("Usuário");
  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const name = getUserNameFromToken();
    if (name) setUserName(name);

    async function fetchEvents() {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) return;
        const upcomingRes = await fetch(`${BACKEND_URL}/user/tickets/upcoming`, { headers: { Authorization: `Bearer ${token}` } });
        if (upcomingRes.ok) setUpcomingEvents(await upcomingRes.json());
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

      {/* Boas vindas */}
      <header className="space-y-1 mb-8">
        <h1 className="title-h1">Bem vindo de volta, {userName}!</h1>
        <p className="subtitle">
          Você tem {upcomingEvents.length} eventos programados para este mês.
        </p>
      </header>

      {/* Próximos eventos */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="title-h3">Próximos Eventos</h3>
          <button
            type="button"
            onClick={() => router.push("/dashboard-user/my-tickets?filter=upcoming")}
            className="text-sm text-(--blue) font-medium hover:underline cursor-pointer"
          >
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

    </main>
  );
}