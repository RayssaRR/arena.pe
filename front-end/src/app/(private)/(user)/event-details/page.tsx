"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Calendar, MapPin } from "lucide-react";
import BuyTicketCard from "../components/BuyTicketCard";
import Details from "../components/Details";
import { getEventById, EventResponse, resolvePublicAssetUrl, ApiError } from "@/lib/api";

type Event = EventResponse;

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
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Validar ID antes de tentar buscar
    if (!eventId || eventId.trim() === "") {
      setError("ID do evento não fornecido. Volte e selecione um evento válido.");
      setIsLoading(false);
      return;
    }

    // Validar se é um UUID válido
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(eventId)) {
      setError(`ID do evento inválido: ${eventId}`);
      setIsLoading(false);
      return;
    }

    async function fetchData() {
      try {
        setIsLoading(true);
        setError(null);

        const eventData = await getEventById(eventId!);
        console.log(eventData);
        
        setEvent(eventData);

      } catch (err) {
        console.error("Erro ao buscar evento:", err);
        if (err instanceof ApiError) {
          if (err.statusCode === 404) {
            setError("Evento não encontrado.");
          } else if (err.statusCode === 403) {
            setError("Você não tem permissão para acessar este evento.");
          } else {
            setError(err.message);
          }
        } else if (err instanceof Error) {
          setError(`Erro: ${err.message}`);
        } else {
          setError("Não foi possível carregar o evento. Tente novamente mais tarde.");
        }
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
              src={resolvePublicAssetUrl(event.imageUrl) ?? event.imageUrl}
              alt={event.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-black/70"></div>
          <div className="relative z-10 text-white p-10 h-full flex flex-col justify-end gap-3">
            <p className="bg-(--blue) p-1 rounded-full font-bold w-fit px-4">
              {event.category?.title ?? "Geral"}
            </p>

            {!event.isActive && (
              <p className="bg-(--red) p-1 rounded-full font-bold w-fit px-4">
              Desativado
            </p>
            )}
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
            {event.isActive && (
              <BuyTicketCard
                sectors={
                  event.ticketSectors?.map((sector) => ({
                    id: sector.id,
                    location: sector.location,
                    price: sector.price,
                    ticketsAvailable: sector.ticketsAvailable,
                    ticketsSold: sector.ticketsSold,
                  })) ?? []
                }
                eventId={event.id}
                eventTitle={event.title}
                eventDate={event.eventDate}
              />
            )}
          </div>
        </section>
      </main>
    </div>
  );
}