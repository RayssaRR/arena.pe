'use client';

import { useRouter } from "next/navigation";
import { Pencil, BarChart2, Trash2 } from "lucide-react";
import { EventResponse } from "@/lib/api";

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).toUpperCase();
}

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
  UPCOMING: { label: "Próximo", className: "bg-blue-100 text-blue-700" },
  ONGOING: { label: "Em andamento", className: "bg-yellow-100 text-yellow-700" },
  COMPLETED: { label: "Concluído", className: "bg-gray-100 text-gray-600" },
  CANCELED: { label: "Cancelado", className: "bg-red-100 text-red-600" },
};

interface RecentEventsCardProps {
  events: EventResponse[];
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}

export default function RecentEventsCard({ events, onDelete, onEdit }: RecentEventsCardProps) {
  const router = useRouter();

  if (events.length === 0) {
    return (
      <div className="border rounded-2xl overflow-hidden p-8 text-center text-gray-400">
        <p>Nenhum evento cadastrado ainda.</p>
      </div>
    );
  }

  return (
    <div className="border rounded-2xl overflow-hidden bg-white">
      <table className="w-full text-left">
        <thead className="text-gray-500 bg-gray-50 text-xs uppercase tracking-wider">
          <tr>
            <th className="px-4 py-3">Evento</th>
            <th className="px-4 py-3">Data</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Ações</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => {
            const status = STATUS_LABELS[event.status] ?? STATUS_LABELS.UPCOMING;
            return (
              <tr key={event.id} className="border-t hover:bg-gray-50 transition">
                <td className="px-4 py-3 font-medium text-gray-800">{event.title}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{formatDate(event.eventDate)}</td>
                <td className="px-4 py-3">
                  <span className={`px-3 py-1 rounded-2xl text-xs font-medium ${status.className}`}>
                    {status.label}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => onEdit(event.id)}
                      className="text-blue-500 hover:text-blue-700 transition cursor-pointer"
                      title="Editar"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => router.push(`/events/${event.id}/stats`)}
                      className="text-purple-500 hover:text-purple-700 transition cursor-pointer"
                      title="Estatísticas"
                    >
                      <BarChart2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(event.id)}
                      className="text-red-500 hover:text-red-700 transition cursor-pointer"
                      title="Deletar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}