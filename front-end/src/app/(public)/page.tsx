"use client";

import { useEffect, useState } from "react";
import Category from "@/app/(private)/(user)/components/Category";
import { Header } from "@/components/Header";
import SearchBar from "@/app/(private)/(user)/components/Searchbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { useRouter } from "next/navigation";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8080";

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

const CATEGORY_MAP: Record<string, string> = {
  Esportes: "Esporte",
  Shows: "Show",
  Tours: "Tour",
  "E-Sports": "E-Sport",
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

  return (
    <Card className="mx-auto w-full pt-0">
      <CardHeader className="bg-black/70 text-white p-5 min-h-20">
        <p className="bg-white p-1 rounded-md text-(--blue) font-bold w-fit px-4 text-sm">
          {event.category?.title ?? "Geral"}
        </p>
      </CardHeader>

      <CardContent className="space-y-2 p-5">
        <p className="text-(--blue) font-bold text-sm">{formatDate(event.eventDate)}</p>
        <h4 className="body-lg font-semibold">{event.title}</h4>
        <p className="text-(--gray) text-sm line-clamp-2">{event.description}</p>
      </CardContent>

      <CardFooter className="flex justify-end gap-5 bg-white p-5">
        <Button
          onClick={() => router.push(`/event-details/${event.id}`)}
          className="bg-(--blue) hover:bg-(--blue-hover) cursor-pointer"
        >
          Detalhes
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("Todos os Eventos");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchEvents() {
      try {
        setIsLoading(true);
        setError(null);

        const params = new URLSearchParams({
          status: "UPCOMING",
          orderBy: "eventDate",
          direction: "asc",
        });

        if (selectedCategory !== "Todos os Eventos") {
          params.set("title", CATEGORY_MAP[selectedCategory] ?? selectedCategory);
        }

        if (searchTerm.trim()) {
          params.set("title", searchTerm.trim());
        }

        const res = await fetch(`${BACKEND_URL}/events?${params.toString()}`);
        if (!res.ok) throw new Error("Erro ao buscar eventos");
        const data: Event[] = await res.json();
        setEvents(data);
      } catch {
        setError("Não foi possível carregar os eventos.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchEvents();
  }, [selectedCategory, searchTerm]);

  return (
    <div className="min-h-screen bg-[#F5F7F8]">
      <Header />

      <main className="p-8">
        {/* Hero */}
        <section className="bg-black/70 text-white p-10 rounded-3xl h-[50vh] flex flex-col items-center justify-center gap-5 shadow-xl text-center">
          <div className="space-y-2">
            <h2 className="title-h1 text-white">
              O coração da ação em Pernambuco
            </h2>
            <p className="text-white font-normal">
              Descubra esportes de classe mundial, festivais de música e passeios
              exclusivos na Arena Pernambuco.
            </p>
          </div>
          <SearchBar onSearch={setSearchTerm} />
        </section>

        {/* Content */}
        <div className="grid grid-cols-4 gap-8 mt-8 items-start">

          {/* Sidebar categorias */}
          <section className="col-span-1 flex flex-col gap-4 mt-8">
            <Category value={selectedCategory} onChange={setSelectedCategory} />
          </section>

          {/* Eventos */}
          <section className="col-span-3">
            <h3 className="title-h3">Próximos Eventos</h3>

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