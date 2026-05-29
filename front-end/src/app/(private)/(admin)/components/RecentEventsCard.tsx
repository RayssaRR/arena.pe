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
            const status = event.isActive ? (
              event.status === "UPCOMING" ? { label: "Próximo", className: "bg-green-100 text-green-800" } :
              event.status === "ONGOING" ? { label: "Em Andamento", className: "bg-yellow-100 text-yellow-800" } :
              { label: "Encerrado", className: "bg-gray-100 text-gray-800" }
            ) : { label: "Inativo", className: "bg-red-100 text-red-800" };
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
                      onClick={() => router.push(`/events/overview?id=${event.id}`)}
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