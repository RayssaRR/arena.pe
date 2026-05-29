"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getEventById } from "@/lib/api";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8080";

type DailySale = {
  period: string;
  ticketsSold: number;
  revenue: number;
};

type WeeklySale = {
  weekPeriod: string;
  ticketsSold: number;
  revenue: number;
  dailyBreakdown: DailySale[];
};

type EventStatistics = {
  totalRevenue: number;
  ticketsSold: number;
  ticketsAvailable: number;
  averageTicketPrice: number;
  salesByPeriod: WeeklySale[];
};

type EventInfo = {
  title: string;
  eventDate: string;
  status: string;
};

function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function AreaChartSVG({ data }: { data: { label: string; value: number }[] }) {
  if (!data || data.length === 0) return <p className="text-sm text-gray-400">Sem dados disponíveis.</p>;

  const width = 500;
  const height = 180;
  const paddingX = 40;
  const paddingY = 20;
  const chartWidth = width - paddingX * 2;
  const chartHeight = height - paddingY * 2;

  const maxVal = Math.max(...data.map((d) => d.value));
  const minVal = 0;

  const getX = (i: number) => paddingX + (i / Math.max(data.length - 1, 1)) * chartWidth;
  const getY = (v: number) =>
    maxVal === 0
      ? paddingY + chartHeight
      : paddingY + chartHeight - ((v - minVal) / (maxVal - minVal)) * chartHeight;

  const points = data.map((d, i) => `${getX(i)},${getY(d.value)}`).join(" ");
  const areaPoints = [
    `${paddingX},${paddingY + chartHeight}`,
    ...data.map((d, i) => `${getX(i)},${getY(d.value)}`),
    `${getX(data.length - 1)},${paddingY + chartHeight}`,
  ].join(" ");

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-[200px]">
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2563eb" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 0.25, 0.5, 0.75, 1].map((t, i) => (
        <line key={i} x1={paddingX} y1={paddingY + chartHeight * t} x2={width - paddingX} y2={paddingY + chartHeight * t} stroke="#f3f4f6" strokeWidth="1" />
      ))}
      <polygon points={areaPoints} fill="url(#areaGrad)" />
      <polyline points={points} fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      {data.map((d, i) => (
        <circle key={i} cx={getX(i)} cy={getY(d.value)} r="4" fill="#2563eb" />
      ))}
      {data.map((d, i) => (
        <text key={i} x={getX(i)} y={height - 2} textAnchor="middle" fontSize="9" fill="#9ca3af">{d.label}</text>
      ))}
      {[0, 0.5, 1].map((t, i) => {
        const val = minVal + (maxVal - minVal) * (1 - t);
        return (
          <text key={i} x={paddingX - 5} y={paddingY + chartHeight * t + 4} textAnchor="end" fontSize="9" fill="#9ca3af">
            {val >= 1000 ? `${(val / 1000).toFixed(0)}mil` : val}
          </text>
        );
      })}
    </svg>
  );
}

function StatCard({
  label,
  value,
  sub,
  subColor,
  extra,
}: {
  label: string;
  value: string;
  sub?: string;
  subColor?: string;
  extra?: React.ReactNode;
}) {
  return (
    <article className="border rounded-2xl p-5 space-y-2 bg-white">
      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">{label}</p>
      <p className="title-h2">{value}</p>
      {extra}
      {sub && <p className={`text-xs ${subColor ?? "text-gray-400"}`}>{sub}</p>}
    </article>
  );
}

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
  UPCOMING: { label: "Ativo", className: "bg-green-100 text-green-700" },
  ONGOING: { label: "Em andamento", className: "bg-yellow-100 text-yellow-700" },
  COMPLETED: { label: "Concluído", className: "bg-gray-100 text-gray-600" },
  CANCELED: { label: "Cancelado", className: "bg-red-100 text-red-600" },
};

export default function EventStats() {
  const searchParams = useSearchParams();
  const eventId = searchParams.get("id");

  const [chartMode, setChartMode] = useState<"dia" | "semana">("semana");
  const [stats, setStats] = useState<EventStatistics | null>(null);
  const [eventInfo, setEventInfo] = useState<EventInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!eventId) {
      setError("ID do evento não encontrado.");
      setIsLoading(false);
      return;
    }

    async function loadData() {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) throw new Error("Token não encontrado.");

        const [statsRes, event] = await Promise.all([
          fetch(`${BACKEND_URL}/events/statistics/${eventId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          getEventById(eventId!),
        ]);

        if (!statsRes.ok) throw new Error("Erro ao buscar estatísticas.");

        const statsData: EventStatistics = await statsRes.json();
        setStats(statsData);
        setEventInfo({
          title: event.title,
          eventDate: event.eventDate,
          status: event.status ?? "UPCOMING",
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao carregar dados.");
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [eventId]);

  // Montar dados do gráfico
  const weeklyChartData =
    stats?.salesByPeriod?.map((w) => ({
      label: w.weekPeriod,
      value: w.ticketsSold,
    })) ?? [];

  const dailyChartData =
    stats?.salesByPeriod?.flatMap((w) =>
      w.dailyBreakdown.map((d) => ({
        label: d.period,
        value: d.ticketsSold,
      }))
    ) ?? [];

  const chartData = chartMode === "semana" ? weeklyChartData : dailyChartData;

  const totalCapacity = (stats?.ticketsSold ?? 0) + (stats?.ticketsAvailable ?? 0);
  const occupancyPct = totalCapacity > 0 ? ((stats?.ticketsSold ?? 0) / totalCapacity) * 100 : 0;
  const status = STATUS_LABELS[eventInfo?.status ?? "UPCOMING"] ?? STATUS_LABELS.UPCOMING;

  if (isLoading) {
    return (
      <main className="p-8 min-h-screen bg-[#F5F7F8] flex items-center justify-center">
        <p className="text-gray-500 animate-pulse">Carregando estatísticas...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="p-8 min-h-screen bg-[#F5F7F8] flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </main>
    );
  }

  return (
    <main className="p-8 min-h-screen bg-[#F5F7F8]">
      <nav className="text-sm text-gray-500 mb-4 flex gap-1">
        <Link href="/dashboard-admin" className="hover:text-gray-800 transition">Eventos</Link>
        <span>-</span>
        <span className="text-gray-800 font-medium">Estatísticas</span>
      </nav>

      <header className="space-y-1 mb-8">
        <div className="flex items-center gap-3">
          <span className={`text-xs font-bold px-3 py-1 rounded-full ${status.className}`}>
            {status.label}
          </span>
          <p className="text-xs text-gray-400">ID do Evento: {eventId}</p>
        </div>
        <h1 className="title-h1">{eventInfo?.title ?? "—"}</h1>
        <p className="subtitle">
          {eventInfo?.eventDate ? formatDate(eventInfo.eventDate) : "—"} - Arena Pernambuco
        </p>
      </header>

      <section className="grid grid-cols-4 gap-5 mb-8">
        <StatCard
          label="Receita Total"
          value={stats ? formatCurrency(stats.totalRevenue) : "—"}
          sub="Baseado nos ingressos vendidos"
          subColor="text-green-600"
        />
        <StatCard
          label="Ingressos Vendidos"
          value={`${stats?.ticketsSold ?? 0} / ${totalCapacity}`}
          extra={
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div
                className="bg-(--blue) h-1.5 rounded-full"
                style={{ width: `${occupancyPct.toFixed(1)}%` }}
              />
            </div>
          }
        />
        <StatCard
          label="Taxa de Ocupação"
          value={`${occupancyPct.toFixed(1)}%`}
          sub={`${stats?.ticketsAvailable ?? 0} ingressos disponíveis`}
        />
        <StatCard
          label="Preço Médio do Ingresso"
          value={stats ? formatCurrency(stats.averageTicketPrice) : "—"}
        />
      </section>

      <section className="grid grid-cols-3 gap-5">
        <article className="col-span-2 border rounded-2xl p-5 bg-white space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Venda de Ingressos</p>
            <div className="flex bg-gray-100 rounded-lg p-0.5 gap-0.5">
              <button
                type="button"
                onClick={() => setChartMode("dia")}
                className={`text-xs px-3 py-1 rounded-md transition cursor-pointer font-medium ${
                  chartMode === "dia" ? "bg-white shadow text-(--blue)" : "text-gray-500"
                }`}
              >
                Dia
              </button>
              <button
                type="button"
                onClick={() => setChartMode("semana")}
                className={`text-xs px-3 py-1 rounded-md transition cursor-pointer font-medium ${
                  chartMode === "semana" ? "bg-white shadow text-(--blue)" : "text-gray-500"
                }`}
              >
                Semana
              </button>
            </div>
          </div>
          <AreaChartSVG data={chartData} />
        </article>

        <article className="border rounded-2xl p-5 bg-white space-y-4">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Vendas por Semana</p>
          <div className="space-y-4">
            {stats?.salesByPeriod && stats.salesByPeriod.length > 0 ? (
              stats.salesByPeriod.map((week) => {
                const pct = totalCapacity > 0 ? (week.ticketsSold / totalCapacity) * 100 : 0;
                return (
                  <div key={week.weekPeriod} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-700">{week.weekPeriod}</span>
                      <span className="font-bold">{week.ticketsSold} ing.</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className="bg-(--blue) h-2 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-gray-400">Sem dados de vendas ainda.</p>
            )}
          </div>
        </article>
      </section>
    </main>
  );
}