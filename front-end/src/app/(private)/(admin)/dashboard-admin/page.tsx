"use client";

import HomeCard from "../components/HomeCard";
import RecentEventsCard from "../components/RecentEventsCard";
import { useEffect, useState } from "react";
import { getEvents, EventResponse, getEventsWithDeleted } from "@/lib/api";
import { getUserNameFromToken } from "@/lib/jwt-utils";
import { Calendar, Ticket, CircleDollarSign, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import axios from "axios";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8080";

export default function AdminDashboard() {
  const router = useRouter();
  const [events, setEvents] = useState<EventResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userName, setUserName] = useState("Administrador");
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [totalTicketsSold, setTotalTicketsSold] = useState<number>(0);

  useEffect(() => {
    const name = getUserNameFromToken();
    if (name) setUserName(name);
    loadData();
  }, []);

  async function loadData() {
    try {
      const token = localStorage.getItem("authToken");
      const data = await getEventsWithDeleted(token!);
      setEvents(data);

      if (token && data.length > 0) {
        const statsResults = await Promise.allSettled(
          data.map((event) =>
            fetch(`${BACKEND_URL}/events/statistics/${event.id}`, {
              headers: { Authorization: `Bearer ${token}` },
            }).then((r) => (r.ok ? r.json() : null))
          )
        );

        let revenue = 0;
        let tickets = 0;
        for (const result of statsResults) {
          if (result.status === "fulfilled" && result.value) {
            revenue += result.value.totalRevenue ?? 0;
            tickets += result.value.ticketsSold ?? 0;
          }
        }
        setTotalRevenue(revenue);
        setTotalTicketsSold(tickets);
      }
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
      setError("Erro ao carregar eventos");
    } finally {
      setIsLoading(false);
    }
  }

  const handleEditEvent = (eventId: string) => {
    router.push(`/events/update?id=${eventId}`);
  };

  const handleDeleteEvent = async (eventId: string) => {
    const confirmed = window.confirm("Tem certeza que deseja deletar este evento?");
    if (!confirmed) return;

    try {
      const token = localStorage.getItem("authToken");
      await axios.delete(`${BACKEND_URL}/events/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      router.refresh();
    } catch (err) {
      console.error("Erro ao deletar evento:", err);
      alert("Erro ao deletar evento. Tente novamente.");
    }
  };

  const formattedRevenue = totalRevenue.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

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
            value={events.length}
            description={`${events.filter(e => e.status === "UPCOMING").length} eventos próximos`}
          />
          <HomeCard
            icon={Ticket}
            label="Ingressos Vendidos"
            value={totalTicketsSold.toLocaleString("pt-BR")}
            description="Total de ingressos vendidos"
          />
          <HomeCard
            icon={CircleDollarSign}
            label="Receita Total"
            value={formattedRevenue}
            description="Soma de todos os eventos"
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