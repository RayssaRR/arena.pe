"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Calendar, MapPin } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import BuyTicketCard from "../components/BuyTicketCard";
import Details from "../components/Details";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8080";

type TicketSector = {
  location: string;
  price: number;
  capacity: number;
  sold?: number;
};

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
  ticketSectors?: TicketSector[];
};

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date
    .toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
    .toUpperCase();
}

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

function NextEventCard({ event }: { event: Event }) {
  const router = useRouter();

  return (
    <Card className="mx-auto w-full pt-0">
      <CardHeader className="bg-black/70 text-white p-5 min-h-20">
        <p className="bg-white p-1 rounded-md text-(--blue) font-bold w-fit px-4 text-sm">
          {event.category?.title ?? "Geral"}
        </p>
      </CardHeader>

      <CardContent className="space-y-2 p-5">
        <p className="text-(--blue) font-bold text-sm">{formatDateShort(event.eventDate)}</p>
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

export default function EventDetails() {
  return (
    <Suspense fallback={<LoadingState />}>
      <EventDetailsContent />
    </Suspense>
  );
}

function LoadingState() {
  return (
    <div className="min-h-screen bg-[#F5F7F8]">
      <main className="p-8">
        <p className="text-sm text-muted-foreground animate-pulse">Carregando evento...</p>
      </main>
    </div>
  );
}

function EventDetailsContent() {
  const searchParams = useSearchParams();
  const eventId = searchParams?.get("id");
  const router = useRouter();

  const [event, setEvent] = useState<Event | null>(null);
  const [otherEvents, setOtherEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!eventId) {
      setError("ID do evento não fornecido");
      setIsLoading(false);
      return;
    }

    async function fetchData() {
      try {
        setIsLoading(true);
        setError(null);

        const [eventRes, othersRes] = await Promise.all([
          fetch(`${BACKEND_URL}/events/${eventId}`),
          fetch(`${BACKEND_URL}/events?status=UPCOMING&orderBy=eventDate&direction=asc`),
        ]);

        if (!eventRes.ok) throw new Error("Evento não encontrado");
        const eventData: Event = await eventRes.json();
        setEvent(eventData);

        if (othersRes.ok) {
          const othersData: Event[] = await othersRes.json();
          setOtherEvents(othersData.filter((e) => e.id !== eventId).slice(0, 4));
        }
      } catch (err) {
        console.error("Erro ao buscar evento:", err);
        setError("Não foi possível carregar o evento.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [eventId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F5F7F8]">
        <main className="p-8">
          <p className="text-sm text-muted-foreground animate-pulse">Carregando evento...</p>
        </main>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-[#F5F7F8]">
        <main className="p-8">
          <p className="text-sm text-destructive">{error ?? "Evento não encontrado."}</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F7F8]">
      <main className="p-8">
        {/* Hero */}
        <section className="relative rounded-3xl h-[50vh] overflow-hidden shadow-xl">
          {event.imageUrl && (
            <img
              src={event.imageUrl.startsWith("/") ? BACKEND_URL + event.imageUrl : event.imageUrl}
              alt={event.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-black/70"></div>
          <div className="relative z-10 text-white p-10 h-full flex flex-col justify-end gap-3">
            <p className="bg-(--blue) p-1 rounded-full font-bold w-fit px-4">
              {event.category?.title ?? "Geral"}
            </p>
            <p className="title-h1 text-white">{event.title}</p>
            <div className="flex gap-10">
              <div className="flex gap-2">
                <Calendar />
                <p className="inline">{formatDate(event.eventDate)}</p>
              </div>
              <div className="flex gap-2">
                <MapPin />
                <p className="inline">Arena Pernambuco, Recife</p>
              </div>
            </div>
          </div>
        </section>

        {/* Detalhes + Comprar */}
        <section className="flex gap-10 py-7">
          <div className="w-full">
            <Details description={event.description} />
          </div>
          <div className="w-full">
            <BuyTicketCard
              sectors={event.ticketSectors ?? []}
              eventId={event.id}
              eventTitle={event.title}
              eventDate={event.eventDate}
            />
          </div>
        </section>

        {/* Outros eventos */}
        {otherEvents.length > 0 && (
          <section>
            <h3 className="title-h3">Outros Eventos na Arena Pernambuco</h3>
            <div className="grid grid-cols-4 gap-8 mt-4">
              {otherEvents.map((e) => (
                <NextEventCard key={e.id} event={e} />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}