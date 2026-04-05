"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getJsonWithAuth } from "@/lib/api";

type EventItem = {
  id?: string | number;
  title?: string;
  description?: string;
  eventDate?: string;
  capacity?: number;
  status?: string;
  imageUrl?: string;
};

const EVENTOS_URL =
  process.env.NEXT_PUBLIC_EVENTOS_URL ?? "http://localhost:8080/events";

function normalizeEvents(payload: unknown): EventItem[] {
  if (Array.isArray(payload)) {
    return payload as EventItem[];
  }

  if (!payload || typeof payload !== "object") {
    return [];
  }

  const record = payload as Record<string, unknown>;

  if (Array.isArray(record.data)) {
    return record.data as EventItem[];
  }

  if (Array.isArray(record.events)) {
    return record.events as EventItem[];
  }

  return [];
}

function formatEventDate(value?: string): string {
  if (!value) {
    return "Data nao informada";
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleString("pt-BR");
}

export default function EventosPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadEvents() {
      const token = localStorage.getItem("authToken");

      if (!token) {
        if (isMounted) {
          setErrorMessage("Voce precisa fazer login para ver os eventos.");
          setIsLoading(false);
        }
        return;
      }

      try {
        const response = await getJsonWithAuth<unknown>(EVENTOS_URL, token);
        const parsedEvents = normalizeEvents(response);

        if (isMounted) {
          setEvents(parsedEvents);
          setErrorMessage(null);
        }
      } catch {
        if (isMounted) {
          setErrorMessage("Nao foi possivel carregar os eventos registrados.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadEvents();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <main className="min-h-screen bg-linear-to-b from-background via-background to-muted/40 px-4 py-10 sm:py-16">
      <section className="mx-auto w-full max-w-5xl space-y-6">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-semibold tracking-tight">Eventos registrados</h1>
            <p className="text-sm text-muted-foreground">
              Visualize todos os eventos cadastrados na plataforma.
            </p>
          </div>

          <Button asChild>
            <Link href="/events/registro">Novo evento</Link>
          </Button>
        </header>

        {isLoading ? (
          <p className="text-sm text-muted-foreground">Carregando eventos...</p>
        ) : null}

        {errorMessage ? (
          <Card>
            <CardContent>
              <p className="text-sm text-destructive">{errorMessage}</p>
            </CardContent>
          </Card>
        ) : null}

        {!isLoading && !errorMessage && events.length === 0 ? (
          <Card>
            <CardContent>
              <p className="text-sm text-muted-foreground">Nenhum evento registrado ate o momento.</p>
            </CardContent>
          </Card>
        ) : null}

        {!isLoading && !errorMessage && events.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {events.map((event, index) => (
              <Card key={event.id ?? `${event.title ?? "evento"}-${index}`}>
                {event.imageUrl ? (
                  <Image
                    src={event.imageUrl}
                    alt={event.title ?? "Imagem do evento"}
                    className="h-44 w-full object-cover"
                    width={720}
                    height={176}
                  />
                ) : null}

                <CardHeader className="space-y-1">
                  <CardTitle>{event.title ?? "Sem titulo"}</CardTitle>
                  <CardDescription>{event.status ?? "Status nao informado"}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    {event.description ?? "Sem descricao"}
                  </p>
                  <p className="text-sm">Data: {formatEventDate(event.eventDate)}</p>
                  <p className="text-sm">Capacidade: {event.capacity ?? 0}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : null}
      </section>
    </main>
  );
}
