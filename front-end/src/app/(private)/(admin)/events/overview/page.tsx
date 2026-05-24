"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

const weeklyData = [
  { label: "SEMANA 1", value: 3200 },
  { label: "SEMANA 2", value: 4800 },
  { label: "SEMANA 3", value: 7200 },
  { label: "SEMANA 4", value: 8100 },
];

const dailyData = [
  { label: "SEG", value: 1200 },
  { label: "TER", value: 1800 },
  { label: "QUA", value: 900 },
  { label: "QUI", value: 2400 },
  { label: "SEX", value: 3100 },
  { label: "SÁB", value: 4200 },
  { label: "DOM", value: 2800 },
];

const audienceData = [
  { label: "18-24 anos", pct: 42 },
  { label: "25-34 anos", pct: 35 },
  { label: "35-44 anos", pct: 18 },
  { label: "45 anos ou mais", pct: 5 },
];

function AreaChartSVG({ data }: { data: { label: string; value: number }[] }) {
  const width = 500;
  const height = 180;
  const paddingX = 40;
  const paddingY = 20;
  const chartWidth = width - paddingX * 2;
  const chartHeight = height - paddingY * 2;

  const maxVal = Math.max(...data.map((d) => d.value));
  const minVal = 0;

  const getX = (i: number) => paddingX + (i / (data.length - 1)) * chartWidth;
  const getY = (v: number) => paddingY + chartHeight - ((v - minVal) / (maxVal - minVal)) * chartHeight;

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

      {/* Grid lines */}
      {[0, 0.25, 0.5, 0.75, 1].map((t, i) => (
        <line
          key={i}
          x1={paddingX}
          y1={paddingY + chartHeight * t}
          x2={width - paddingX}
          y2={paddingY + chartHeight * t}
          stroke="#f3f4f6"
          strokeWidth="1"
        />
      ))}

      {/* Area fill */}
      <polygon points={areaPoints} fill="url(#areaGrad)" />

      {/* Line */}
      <polyline
        points={points}
        fill="none"
        stroke="#2563eb"
        strokeWidth="2.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* Dots */}
      {data.map((d, i) => (
        <circle key={i} cx={getX(i)} cy={getY(d.value)} r="4" fill="#2563eb" />
      ))}

      {/* X labels */}
      {data.map((d, i) => (
        <text
          key={i}
          x={getX(i)}
          y={height - 2}
          textAnchor="middle"
          fontSize="9"
          fill="#9ca3af"
        >
          {d.label}
        </text>
      ))}

      {/* Y labels */}
      {[0, 0.5, 1].map((t, i) => {
        const val = minVal + (maxVal - minVal) * (1 - t);
        return (
          <text
            key={i}
            x={paddingX - 5}
            y={paddingY + chartHeight * t + 4}
            textAnchor="end"
            fontSize="9"
            fill="#9ca3af"
          >
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

export default function EventStats() {
  const [chartMode, setChartMode] = useState<"dia" | "semana">("semana");
  const chartData = chartMode === "semana" ? weeklyData : dailyData;

  return (
    <main className="p-8 min-h-screen bg-[#F5F7F8]">

      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-4 flex gap-1">
        <Link href="/dashboard-admin" className="hover:text-gray-800 transition">Eventos</Link>
        <span>-</span>
        <span className="text-gray-800 font-medium">Eventos Recentes</span>
      </nav>

      {/* Header */}
      <header className="space-y-1 mb-8">
        <div className="flex items-center gap-3">
          <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">Ativo</span>
          <p className="text-xs text-gray-400">ID do Evento: #AR-2026-081</p>
        </div>
        <h1 className="title-h1">Santa Cruz vs Figueirense</h1>
        <p className="subtitle">Outubro 11, 2026 - Arena Pernambuco</p>
      </header>

      {/* Stat cards */}
      <section className="grid grid-cols-4 gap-5 mb-8">
        <StatCard
          label="Receita Total"
          value="R$ 45,200"
          sub="+12,5% em relação à semana passada"
          subColor="text-green-600"
        />
        <StatCard
          label="Ingressos Vendidos"
          value="842 / 10000"
          extra={
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div className="bg-(--blue) h-1.5 rounded-full" style={{ width: "8.42%" }} />
            </div>
          }
        />
        <StatCard
          label="Taxa de Frequência"
          value="84%"
          sub="Meta: 92%"
        />
        <StatCard
          label="Preço Médio do Ingresso"
          value="R$ 53,68"
          sub="Padrão: R$ 45,00"
        />
      </section>

      {/* Charts */}
      <section className="grid grid-cols-3 gap-5">

        {/* Venda de Ingressos */}
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

        {/* Público-alvo */}
        <article className="border rounded-2xl p-5 bg-white space-y-4">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Público-alvo</p>
          <div className="space-y-4">
            {audienceData.map((item) => (
              <div key={item.label} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">{item.label}</span>
                  <span className="font-bold">{item.pct}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-(--blue) h-2 rounded-full"
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </article>

      </section>
    </main>
  );
}