"use client";

import { SquarePen, ChartNoAxesColumn, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { EventResponse } from "@/lib/api";

interface RecentEventsCardProps {
  events: EventResponse[];
  onDelete?: (eventId: string) => void;
  onEdit?: (eventId: string) => void;
}

function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    const formatter = new Intl.DateTimeFormat("pt-BR", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    return formatter.format(date).toUpperCase();
  } catch {
    return dateString;
  }
}

function getStatusBadge(status: string): string {
  const statusMap: Record<string, string> = {
    UPCOMING: "Próximo",
    ONGOING: "Em Andamento",
    COMPLETED: "Concluído",
    CANCELED: "Cancelado",
  };
  return statusMap[status] || status;
}

function getStatusColor(status: string): string {
  const colorMap: Record<string, string> = {
    UPCOMING: "bg-blue-100 text-blue-800",
    ONGOING: "bg-green-100 text-green-800",
    COMPLETED: "bg-gray-100 text-gray-800",
    CANCELED: "bg-red-100 text-red-800",
  };
  return colorMap[status] || "bg-gray-100 text-gray-800";
}

export default function RecentEventsCard({
  events,
  onDelete,
  onEdit,
}: RecentEventsCardProps) {
  const router = useRouter();

  const handleRowClick = (eventId: string) => {
    router.push(`/event-details?id=${eventId}`);
  };

  if (events.length === 0) {
    return (
      <div className="border rounded-2xl overflow-hidden p-8 text-center text-gray-500">
        <p>Nenhum evento cadastrado</p>
      </div>
    );
  }

  return (
    <div className="border rounded-2xl overflow-hidden">
      <table className="w-full text-left">
        {/* Header (Títulos) */}
        <thead className="text-gray-500 bg-gray-50">
          <tr>
            <th className="px-4 py-3" scope="col">
              EVENTO
            </th>
            <th className="px-4 py-3" scope="col">
              DATA
            </th>
            <th className="px-4 py-3" scope="col">
              STATUS
            </th>
            <th className="px-4 py-3" scope="col">
              AÇÕES
            </th>
          </tr>
        </thead>

        {/* Dados */}
        <tbody>
          {events.map((event) => (
            <tr
              key={event.id}
              className="border-t hover:bg-gray-50 transition cursor-pointer"
              onClick={() => handleRowClick(event.id)}
            >
              <td className="px-4 py-3 font-medium">{event.title}</td>
              <td className="px-4 py-3">{formatDate(event.eventDate)}</td>
              <td className="px-4 py-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                    event.status
                  )}`}
                >
                  {getStatusBadge(event.status)}
                </span>
              </td>
              <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                <span className="flex gap-3">
                  <button
                    onClick={() => onEdit?.(event.id)}
                    className="text-blue-600 hover:text-blue-800 transition"
                    title="Editar"
                  >
                    <SquarePen size={18} />
                  </button>
                  <button
                    onClick={() => router.push(`/events/${event.id}/stats`)}
                    className="text-purple-600 hover:text-purple-800 transition"
                    title="Estatísticas"
                  >
                    <ChartNoAxesColumn size={18} />
                  </button>
                  <button
                    onClick={() => onDelete?.(event.id)}
                    className="text-red-600 hover:text-red-800 transition"
                    title="Deletar"
                  >
                    <Trash size={18} />
                  </button>
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}