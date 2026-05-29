"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { resolvePublicAssetUrl } from "@/lib/api";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8080";

type Event = {
  id: string;
  title: string;
  description: string;
  eventDate: string;
  capacity: number;
  ticketsSold: number;
  status: string;
  imageUrl: string | null;
  category: { id: number; title: string } | null;
};

function formatDate(dateStr: string): string {
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

function EventCard({ event }: { event: Event }) {
  const router = useRouter();
  const imageUrl = resolvePublicAssetUrl(event.imageUrl!);

  return (
    <Card className="mx-auto w-full pt-0 overflow-hidden">
      <CardHeader className="relative h-36 p-0">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={event.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gray-300" />
        )}
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 p-5">
          <p className="bg-white p-1 rounded-md text-(--blue) font-bold w-fit px-4 text-sm">
            {event.category?.title ?? "Geral"}
          </p>
        </div>
      </CardHeader>

      <CardContent className="space-y-2 p-5">
        <p className="text-(--blue) font-bold text-sm">{formatDate(event.eventDate)}</p>
        <h4 className="body-lg font-semibold">{event.title}</h4>
        <p className="text-(--gray) text-sm line-clamp-2">{event.description}</p>
      </CardContent>

      <CardFooter className="flex justify-end gap-5 bg-white p-5">
        <Button
          onClick={() => router.push(`/event-details?id=${event.id}`)}
          className="bg-(--blue) hover:bg-(--blue-hover) cursor-pointer"
        >
          Detalhes
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function Home() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEvents() {
      try {
        setIsLoading(true);
        setError(null);
        const res = await fetch(`${BACKEND_URL}/events`);
        if (!res.ok) throw new Error("Erro ao buscar eventos");
        const data: Event[] = await res.json();
        setEvents(data.slice(0, 3));
      } catch {
        setError("Não foi possível carregar os eventos.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchEvents();
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F7F8]">
      <Header />

      <main className="p-8">
        {/* Hero */}
        <section
          className="relative text-white p-10 rounded-3xl h-[65vh] flex flex-col items-center justify-center gap-5 shadow-xl text-center overflow-hidden"
          style={{
            backgroundImage: "url('/ArenaPernambuco1.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center bottom",
          }}
        >
          <div className="absolute inset-0 bg-black/55 rounded-3xl" />
          <div className="relative z-10 space-y-2">
            <h2 className="title-h1 text-white">
              O coração da ação em Pernambuco
            </h2>
            <p className="text-white font-normal">
              Descubra esportes de classe mundial, festivais de música e passeios
              exclusivos na Arena Pernambuco.
            </p>
          </div>
        </section>

        {/* Eventos */}
        <div className="gap-8 mt-8 items-start">
          <section className="w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="title-h3">Próximos Eventos</h3>
              <Button onClick={() => router.push("/event-discover")}>
                Ver todos
              </Button>
            </div>

            {isLoading && (
              <p className="text-sm text-muted-foreground animate-pulse">
                Carregando eventos...
              </p>
            )}

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}

            {!isLoading && !error && events.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Nenhum evento próximo encontrado.
              </p>
            )}

            {!isLoading && !error && events.length > 0 && (
              <div className="grid grid-cols-3 gap-8">
                {events.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}