"use client";

import HomeCard from "../components/HomeCard";
import RecentEventsCard from "../components/RecentEventsCard";
import { useEffect, useState } from "react";
import { getEvents, EventResponse } from "@/lib/api";
import { getUserNameFromToken } from "@/lib/jwt-utils";
import { Calendar, Ticket, CircleDollarSign, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AdminDashboard() {
  const [events, setEvents] = useState<EventResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userName, setUserName] = useState("Administrador");

  useEffect(() => {
    const name = getUserNameFromToken();
    if (name) setUserName(name);

    const loadEvents = async () => {
      try {
        // GET /events é público (permitAll), não precisa de token
        const data = await getEvents();
        setEvents(data);
      } catch (err) {
        console.error("Erro ao carregar eventos:", err);
        setError("Erro ao carregar eventos");
      } finally {
        setIsLoading(false);
      }
    };

    loadEvents();
  }, []);

  const handleDeleteEvent = (eventId: string) => {
    console.log("Deletar evento:", eventId);
  };

  const handleEditEvent = (eventId: string) => {
    console.log("Editar evento:", eventId);
  };

  return (
    <main className="p-8 min-h-screen">
      <div className="space-y-1 mb-8">
        <h1 className="title-h1">Bem vindo de volta, {userName}!</h1>
        <p className="subtitle">Veja o que está acontecendo com seus eventos hoje.</p>
      </div>

      <section>
        <div className="flex gap-5 mt-7">
          <HomeCard
            icon={Calendar}
            label="Total de Eventos"
            value={events.length || 0}
            description={`${events.filter(e => e.status === "UPCOMING").length} eventos próximos`}
          />
          <HomeCard
            icon={Ticket}
            label="Ingressos Vendidos"
            value={events.reduce((acc, e) => acc + (e.ticketsSold ?? 0), 0).toLocaleString("pt-BR")}
            description="Total de ingressos vendidos"
          />
          <HomeCard
            icon={CircleDollarSign}
            label="Receita Total"
            value="R$ 45.200"
            description="R$ 2.450 em processamento de pagamentos"
          />
        </div>
      </section>

      <section className="mt-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="title-h3">Eventos Recentes</h3>
          <Link href="/events/register">
            <Button className="bg-(--blue) cursor-pointer flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Criar Evento
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="border rounded-2xl overflow-hidden p-8 text-center text-gray-500">
            <p>Carregando eventos...</p>
          </div>
        ) : error ? (
          <div className="border rounded-2xl overflow-hidden p-8 text-center text-red-500">
            <p>{error}</p>
          </div>
        ) : (
          <RecentEventsCard
            events={events}
            onDelete={handleDeleteEvent}
            onEdit={handleEditEvent}
          />
        )}
      </section>
    </main>
  );
}