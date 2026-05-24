"use client";

import HomeCard from "../components/HomeCard";
import RecentEventsCard from "../components/RecentEventsCard";
import { useEffect, useState } from "react";
import { getEvents, EventResponse } from "@/lib/api";
import { getUserNameFromToken } from "@/lib/jwt-utils";
import { Calendar, Ticket, CircleDollarSign } from "lucide-react";

export default function AdminDashboard() {
  const [events, setEvents] = useState<EventResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userName, setUserName] = useState("Administrador");

  useEffect(() => {
    const userName = getUserNameFromToken();
    if (userName) {
      setUserName(userName);
    }

    const loadEvents = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) throw new Error("Token não encontrado");
        const data = await getEvents(token);
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
      {/* Welcome Section */}
      <div className="space-y-1 mb-8">
        <h1 className="title-h1">Bem vindo de volta, {userName}!</h1>
        <p className="subtitle">Veja o que está acontecendo com seus eventos hoje.</p>
      </div>

      {/* Estatísticas */}
      <section>
        <div className="flex gap-5 mt-7">
          <HomeCard
            icon={Calendar}
            label="Total de Eventos"
            value={24}
            description="4 eventos acontecendo ao vivo neste momento"
          />
          <HomeCard
            icon={Ticket}
            label="Ingressos Vendidos"
            value="1.284"
            description="156 ingressos vendidos esta semana"
          />
          <HomeCard
            icon={CircleDollarSign}
            label="Receita Total"
            value="R$ 45.200"
            description="R$ 2.450 em processamento de pagamentos"
          />
        </div>
      </section>

      {/* Eventos Recentes */}
      <section className="mt-10">
        <h3 className="title-h3 mb-4">Eventos Recentes</h3>
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