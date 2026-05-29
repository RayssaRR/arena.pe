'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { getUserNameFromToken } from "@/lib/jwt-utils";
import { resolvePublicAssetUrl } from "@/lib/api";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8080";

type UpcomingEvent = {
  id: string;
  title: string;
  description: string;
  eventDate: string;
  imageUrl?: string;                          // ← adicionado
  category: { id: number; title: string } | null;
  ticketType: string;
  location: string;
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

function UpcomingEventCard({ event }: { event: UpcomingEvent }) {
  const router = useRouter();
  const imageUrl = resolvePublicAssetUrl(event.imageUrl);

  return (
    <Card className="mx-auto w-full pt-0 overflow-hidden">

      {/* Header com imagem real de fundo */}
      <CardHeader className="relative h-36 p-0">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={event.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gray-300" /> // fallback se não tiver imagem
        )}
        {/* Overlay escuro para o badge de categoria ficar legível */}
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 p-5">
          <p className="bg-white p-1 rounded-md text-(--blue) font-bold w-fit px-4 text-sm">
            {event.category?.title ?? "Geral"}
          </p>
        </div>
      </CardHeader>

      <CardContent className="space-y-2 p-5">
        <p className="text-(--blue) font-bold text-sm">{formatDateShort(event.eventDate)}</p>
        <h4 className="body-lg font-semibold">{event.title}</h4>
        <p className="text-(--gray) text-sm line-clamp-2">{event.description}</p>
      </CardContent>

      <CardFooter className="flex justify-between gap-3 bg-white p-5">
        <Button
          onClick={() => router.push(`/event-details/${event.id}`)}
          className="bg-(--blue) hover:bg-(--blue-hover) cursor-pointer"
        >
          Ver Detalhes
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
  const router = useRouter();
  const [userName, setUserName] = useState("Usuário");
  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  console.log(upcomingEvents);
  

  useEffect(() => {
    const name = getUserNameFromToken();
    if (name) setUserName(name);

    async function fetchEvents() {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) return;
        const res = await fetch(`${BACKEND_URL}/reservation/events/purchased?page=0&pageSize=4`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setUpcomingEvents(data.content || []);
        };
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
      <header className="space-y-1 mb-8">
        <h1 className="title-h1">Bem vindo de volta, {userName}!</h1>
        <p className="subtitle">
          Você tem {upcomingEvents.length} eventos programados para este mês.
        </p>
      </header>

      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="title-h3">Próximos Eventos</h3>
          <button
            type="button"
            onClick={() => router.push("/dashboard-user/my-tickets?filter=upcoming")}
            className="text-sm text-(--blue) font-medium hover:underline cursor-pointer"
          >
            Meus Ingressos
          </button>
        </div>

        {isLoading ? (
          <p className="text-sm text-muted-foreground animate-pulse">Carregando...</p>
        ) : upcomingEvents.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhum evento próximo encontrado.</p>
        ) : (
          <div className="grid grid-cols-4 gap-8">
            {upcomingEvents.slice(0, 3).map((event) => (
              <UpcomingEventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}