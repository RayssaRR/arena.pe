"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import Filter from "@/app/(private)/(user)/components/Filter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8080";

const PAGE_SIZE = 6;

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

type SortOption = {
  label: string;
  orderBy: string;
  direction: "asc" | "desc";
};

const SORT_OPTIONS: SortOption[] = [
  { label: "Mais recentes", orderBy: "eventDate", direction: "desc" },
  { label: "Mais antigos", orderBy: "eventDate", direction: "asc" },
  { label: "A-Z", orderBy: "title", direction: "asc" },
  { label: "Z-A", orderBy: "title", direction: "desc" },
];

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
            src={event.imageUrl.startsWith('/') ? BACKEND_URL + event.imageUrl : event.imageUrl}
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
  date: string;
  maxPrice: number;
};

export default function EventDiscover() {
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [isLoading, setIsLoading] = useState(true);

  // Adicionar margem para renderização do Header
  useEffect(() => {
    // O Header é renderizado no topo, não precisa de espaço extra aqui
  }, []);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    date: "",
    maxPrice: 500,
  });
  const [sort, setSort] = useState<SortOption>(SORT_OPTIONS[0]);
  const [sortOpen, setSortOpen] = useState(false);

  useEffect(() => {
    async function fetchEvents() {
      try {
        setIsLoading(true);
        setError(null);
        setVisibleCount(PAGE_SIZE);

        const params = new URLSearchParams({
          status: "UPCOMING",
          orderBy: sort.orderBy,
          direction: sort.direction,
        });

        // Enviar o ID da categoria (já é um número)
        if (filters.categories.length === 1) {
          const categoryId = filters.categories[0];
          params.set("categoryId", categoryId.toString());
        }

        if (filters.date) {
          params.set("date", filters.date);
        }

        const url = `${BACKEND_URL}/events?${params.toString()}`;
        console.log("Fetching eventos com URL:", url);

        const res = await fetch(url);
        if (!res.ok) throw new Error("Erro ao buscar eventos");
        const data: Event[] = await res.json();
        console.log("Eventos recebidos:", data.length);
        setAllEvents(data);
      } catch (err) {
        console.error("Erro ao buscar eventos:", err);
        setError("Não foi possível carregar os eventos.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchEvents();
  }, [filters, sort]);

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

            {/* Topo: título + ordenar */}
            <div className="flex items-center justify-between">
              <h3 className="title-h3">Exibindo próximos eventos</h3>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setSortOpen((prev) => !prev)}
                  className="flex items-center gap-2 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg px-4 py-2 bg-white hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <span>Ordenar por: <span className="text-(--blue) font-bold">{sort.label}</span></span>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>

                {sortOpen && (
                  <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[180px]">
                    {SORT_OPTIONS.map((option) => (
                      <button
                        key={option.label}
                        type="button"
                        onClick={() => {
                          setSort(option);
                          setSortOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-gray-50 cursor-pointer
                          ${sort.label === option.label ? "text-(--blue) font-bold" : "text-gray-700"}
                        `}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
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