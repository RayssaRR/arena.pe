"use client";

import { useState } from "react";
import { CheckCircle, XCircle, Ticket, Loader2, ShieldCheck } from "lucide-react";

type TicketStatus = "idle" | "loading" | "found" | "not-found" | "validating" | "success" | "error";

interface TicketData {
  id: string;
  ownerName: string;
  ownerEmail: string;
  eventName: string;
  eventDate: string;
  eventLocation: string;
  seatInfo?: string;
  used: boolean;
}

export default function ValidateTicketPage() {
  const [ticketId, setTicketId] = useState("");
  const [status, setStatus] = useState<TicketStatus>("idle");
  const [ticketData, setTicketData] = useState<TicketData | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSearch = async () => {
    if (!ticketId.trim()) return;
    setStatus("loading");
    setTicketData(null);
    setErrorMsg("");
    try {
      const res = await fetch(`/api/tickets/${ticketId.trim()}`);
      if (!res.ok) {
        setStatus("not-found");
        setErrorMsg("Ingresso não encontrado. Verifique o ID e tente novamente.");
        return;
      }
      const data: TicketData = await res.json();
      setTicketData(data);
      setStatus("found");
    } catch {
      setStatus("not-found");
      setErrorMsg("Erro ao buscar ingresso. Tente novamente.");
    }
  };

  const handleValidate = async () => {
    if (!ticketData) return;
    setStatus("validating");
    try {
      const res = await fetch(`/api/tickets/${ticketData.id}/validate`, {
        method: "POST",
      });
      if (!res.ok) {
        const err = await res.json();
        setStatus("error");
        setErrorMsg(err.message || "Falha ao validar o ingresso.");
        return;
      }
      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMsg("Erro ao validar ingresso. Tente novamente.");
    }
  };

  const handleReset = () => {
    setTicketId("");
    setStatus("idle");
    setTicketData(null);
    setErrorMsg("");
  };

  const isSearching = status === "loading";
  const isValidating = status === "validating";

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex flex-col items-center px-4 pt-10">
      {/* Page title */}
      <div className="flex items-center gap-2 mb-6">
        <ShieldCheck size={22} className="text-[#2563eb]" />
        <h1 className="text-2xl font-bold text-gray-900">Validar Ingresso</h1>
      </div>

      {/* Card */}
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

        {/* Idle / not-found */}
        {(status === "idle" || status === "loading" || status === "not-found") && (
          <>
            <p className="text-sm text-gray-500 mb-5">
              Informe o <strong className="text-gray-800">ID do ingresso</strong> que deseja validar.
            </p>

            <input
              type="text"
              value={ticketId}
              onChange={(e) => setTicketId(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Ex: TKT-2024-00123"
              disabled={isSearching}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-900
                         placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300
                         focus:border-blue-400 transition-all disabled:opacity-50 mb-3"
            />

            {status === "not-found" && (
              <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-3">
                <XCircle size={16} className="text-red-400 mt-0.5 shrink-0" />
                <p className="text-sm text-red-600">{errorMsg}</p>
              </div>
            )}

            <button
              onClick={handleSearch}
              disabled={!ticketId.trim() || isSearching}
              className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] disabled:opacity-40 disabled:cursor-not-allowed
                         text-white rounded-lg py-2.5 text-sm font-semibold transition-colors
                         flex items-center justify-center gap-2"
            >
              {isSearching ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  Buscando...
                </>
              ) : (
                "Buscar ingresso"
              )}
            </button>
          </>
        )}

        {/* Found / validating / error */}
        {(status === "found" || status === "validating" || status === "error") && ticketData && (
          <>
            <p className="text-sm text-gray-500 mb-4">
              Ingresso encontrado. Confira os dados e confirme a entrada.
            </p>

            <div className="rounded-lg border border-gray-100 bg-gray-50 divide-y divide-gray-100 mb-4">
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-2">
                  <Ticket size={14} className="text-blue-400" />
                  <span className="text-xs font-mono text-gray-400">{ticketData.id}</span>
                </div>
                {ticketData.used ? (
                  <span className="text-xs font-semibold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                    Já utilizado
                  </span>
                ) : (
                  <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                    Válido
                  </span>
                )}
              </div>

              <div className="px-4 py-3">
                <p className="text-xs text-gray-400 mb-0.5">Titular</p>
                <p className="text-sm font-semibold text-gray-900">{ticketData.ownerName}</p>
                <p className="text-xs text-gray-500">{ticketData.ownerEmail}</p>
              </div>

              <div className="px-4 py-3">
                <p className="text-xs text-gray-400 mb-0.5">Evento</p>
                <p className="text-sm font-semibold text-gray-900">{ticketData.eventName}</p>
                <p className="text-xs text-gray-500">{ticketData.eventDate} · {ticketData.eventLocation}</p>
                {ticketData.seatInfo && (
                  <p className="text-xs text-blue-500 font-mono mt-1">{ticketData.seatInfo}</p>
                )}
              </div>
            </div>

            {status === "error" && (
              <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-4">
                <XCircle size={16} className="text-red-400 mt-0.5 shrink-0" />
                <p className="text-sm text-red-600">{errorMsg}</p>
              </div>
            )}

            {!ticketData.used ? (
              <div className="flex gap-2">
                <button
                  onClick={handleReset}
                  className="flex-1 border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-lg
                             py-2.5 text-sm font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleValidate}
                  disabled={isValidating}
                  className="flex-1 bg-[#2563eb] hover:bg-[#1d4ed8] disabled:opacity-50 disabled:cursor-not-allowed
                             text-white rounded-lg py-2.5 text-sm font-semibold transition-colors
                             flex items-center justify-center gap-2"
                >
                  {isValidating ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      Validando...
                    </>
                  ) : (
                    "Confirmar entrada"
                  )}
                </button>
              </div>
            ) : (
              <button
                onClick={handleReset}
                className="w-full border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-lg
                           py-2.5 text-sm font-medium transition-colors"
              >
                Buscar outro ingresso
              </button>
            )}
          </>
        )}

        {/* Success */}
        {status === "success" && (
          <div className="flex flex-col items-center text-center py-4">
            <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200
                            flex items-center justify-center mb-4">
              <CheckCircle size={28} className="text-emerald-500" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 mb-1">Entrada confirmada!</h2>
            <p className="text-sm text-gray-500 mb-0.5">{ticketData?.ownerName}</p>
            <p className="text-xs text-gray-400 font-mono mb-6">{ticketData?.id}</p>
            <button
              onClick={handleReset}
              className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white rounded-lg px-6 py-2.5
                         text-sm font-semibold transition-colors"
            >
              Validar próximo
            </button>
          </div>
        )}
      </div>
    </div>
  );
}