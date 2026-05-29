"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import Filter from "@/app/(private)/(user)/components/Filter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { getFilteredEvents, EventResponse, resolvePublicAssetUrl } from "@/lib/api";

const PAGE_SIZE = 6;

type Event = EventResponse;

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
    <Card 
      className="mx-auto w-full pt-0 overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => router.push(`/event-details?id=${event.id}`)}
    >
      <CardHeader className="relative bg-black/70 text-white p-3 h-48 overflow-hidden">
        {/* Background Image */}
        {event.imageUrl && (
          <img
            src={resolvePublicAssetUrl(event.imageUrl) ?? event.imageUrl}
            alt={event.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/70"></div>

        {/* Content */}
        <div className="relative z-10">
          <p className="bg-white p-1 rounded-md text-(--blue) font-bold w-fit px-3 text-xs">
            {event.category?.title ?? "Geral"}
          </p>
        </div>
      </CardHeader>

      <CardContent className="space-y-1 p-3">
        <p className="text-(--blue) font-bold text-xs">{formatDate(event.eventDate)}</p>
        <h4 className="font-semibold text-sm line-clamp-2">{event.title}</h4>
        <p className="text-(--gray) text-xs line-clamp-1">{event.description}</p>
      </CardContent>
    </Card>
  );
}

type FilterState = {
  categories: number[];
};

export default function EventDiscover() {
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
  });

  useEffect(() => {
    async function fetchEvents() {
      try {
        setIsLoading(true);
        setError(null);
        setVisibleCount(PAGE_SIZE);

        // Chamar getFilteredEvents com filtros
        const data = await getFilteredEvents(
          filters.categories.length === 1 ? filters.categories[0] : undefined // categoryId
        );

        setAllEvents(data);
      } catch (err) {
        console.error("Erro ao buscar eventos:", err);
        setError("Não foi possível carregar os eventos.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchEvents();
  }, [filters]);

  const visibleEvents = allEvents.slice(0, visibleCount);
  const hasMore = visibleCount < allEvents.length;

  const handleApply = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen bg-[#F5F7F8]">
      <Header />

      <main className="p-8">
        <header className="space-y-1">
          <h1 className="title-h1">Explore a programação de eventos</h1>
          <p className="subtitle">
            Encontre seu próximo momento inesquecível na Arena Pernambuco. De jogos de futebol de alto nível a shows de nível internacional.
          </p>
        </header>

        <div className="grid grid-cols-4 gap-8 mt-8 items-start">

          {/* Filtros */}
          <section className="col-span-1 mt-8">
            <Filter onApply={handleApply} />
          </section>

          {/* Eventos */}
          <section className="col-span-3 space-y-6">

            {/* Topo: título */}
            <div className="flex items-center justify-between">
              <h3 className="title-h3">Exibindo próximos eventos</h3>
            </div>

            {isLoading && (
              <p className="text-sm text-muted-foreground animate-pulse">
                Carregando eventos...
              </p>
            )}

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}

            {!isLoading && !error && allEvents.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Nenhum evento encontrado para os filtros selecionados.
              </p>
            )}

            {!isLoading && !error && allEvents.length > 0 && (
              <>
                <div className="grid grid-cols-3 gap-8">
                  {visibleEvents.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>

                {hasMore && (
                  <div className="flex justify-center mt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
                      className="cursor-pointer px-10 border-2"
                    >
                      Carregar Mais Eventos
                    </Button>
                  </div>
                )}
              </>
            )}

          </section>

        </div>
      </main>
    </div>
  );
}