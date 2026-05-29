"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { CheckCircle, MapPin, Tag, Users, Calendar } from "lucide-react"
import { QRCodeSVG } from "qrcode.react"
import { getTicketById, UserTicketResponse } from "@/lib/api"

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8080";

function formatDate(dateStr: string): string {
  if (!dateStr) return ""
  const date = new Date(dateStr)
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function fmt(value: number): string {
  if (isNaN(value)) return "R$ 0,00"
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
}

function getTicketStatusLabel(status: string): string {
  const statusMap: Record<string, string> = {
    VALIDO: "Válido",
    RESGATADO: "Resgatado",
    CANCELADO: "Cancelado",
    EXPIRADO: "Expirado",
  }
  return statusMap[status] || "Desconhecido"
}

function getTicketStatusColor(status: string): string {
  const colorMap: Record<string, string> = {
    VALIDO: "text-green-600",
    RESGATADO: "text-blue-600",
    CANCELADO: "text-red-600",
    EXPIRADO: "text-gray-600",
  }
  return colorMap[status] || "text-gray-600"
}

function TicketContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const ticketId = searchParams?.get("ticketId") ?? ""

  const [ticket, setTicket] = useState<UserTicketResponse | null>(null)
  const [isLoading, setIsLoading] = useState(!!ticketId)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!ticketId) return

    async function fetchTicket() {
      try {
        setIsLoading(true)
        setError(null)
        const token = localStorage.getItem("authToken")
        if (!token) {
          setError("Não autorizado")
          return
        }
        const ticketData = await getTicketById(ticketId, token)
        setTicket(ticketData)
      } catch (err) {
        setError("Não foi possível carregar o ingresso")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTicket()
  }, [ticketId])

  const qrValue = ticket?.ticketId
    ? `${BACKEND_URL}/reservation/tickets/${ticket.ticketId}/consume`
    : "pending"

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F7F8]">
        <p className="text-gray-500 animate-pulse">Carregando ingresso...</p>
      </div>
    )
  }

  if (error || !ticket) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F7F8]">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || "Ingresso não encontrado"}</p>
          <Button onClick={() => router.push("/dashboard-user")} className="cursor-pointer">
            Voltar para Meus Ingressos
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F5F7F8]">
      <main className="flex flex-col items-center p-8">

        {/* Confirmação */}
        <div className="flex flex-col items-center gap-2 mb-8 mt-4">
          <CheckCircle className="w-12 h-12 text-green-500" />
          <h1 className="title-h1 text-center">Ingresso Confirmado!</h1>
          <p className="subtitle text-center">Guarde-o para o dia do evento.</p>
        </div>

        {/* Ticket visual */}
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">

          {/* Header azul */}
          <div className="bg-blue-600 p-8 text-white space-y-1">
            <p className="text-white/70 text-xs uppercase tracking-widest font-medium">Arena Pernambuco</p>
            <h2 className="text-2xl font-bold">{ticket.eventTitle}</h2>
            <p className="text-white/80 text-sm">{formatDate(ticket.eventDate)}</p>
          </div>

          {/* Separador estilo ingresso */}
          <div className="relative h-0">
            <div className="absolute -left-4 w-8 h-8 bg-[#F5F7F8] rounded-full -top-4 z-10" />
            <div className="absolute -right-4 w-8 h-8 bg-[#F5F7F8] rounded-full -top-4 z-10" />
          </div>
          <div className="border-t-2 border-dashed border-gray-200 mx-4" />

          {/* Detalhes */}
          <div className="p-8 space-y-5">
            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-gray-400 text-xs uppercase tracking-wide">
                  <MapPin className="w-3 h-3" />
                  <span>Local</span>
                </div>
                <p className="font-semibold text-gray-800 text-sm">Arena Pernambuco</p>
                <p className="text-xs text-gray-500">São Lourenço da Mata, PE</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-gray-400 text-xs uppercase tracking-wide">
                  <Tag className="w-3 h-3" />
                  <span>Setor</span>
                </div>
                <p className="font-semibold text-gray-800 text-sm">{ticket.location}</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-gray-400 text-xs uppercase tracking-wide">
                  <Users className="w-3 h-3" />
                  <span>Preço</span>
                </div>
                <p className="font-semibold text-gray-800 text-sm">{fmt(ticket.price)}</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-gray-400 text-xs uppercase tracking-wide">
                  <Calendar className="w-3 h-3" />
                  <span>Status</span>
                </div>
                <p className={`font-semibold text-sm ${getTicketStatusColor(ticket.ticketStatus)}`}>
                  {getTicketStatusLabel(ticket.ticketStatus)}
                </p>
              </div>
            </div>

            {/* QR Code */}
            <div className="flex flex-col items-center gap-3 pt-4 border-t">
              {ticket.ticketId && ticket.ticketId !== "pending" ? (
                <>
                  <QRCodeSVG value={qrValue} size={128} bgColor="#ffffff" fgColor="#000000" level="H" includeMargin />
                  <p className="text-xs text-gray-400 font-mono">{ticket.ticketId}</p>
                </>
              ) : (
                <div className="w-32 h-32 bg-gray-100 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300">
                  <p className="text-xs text-gray-400 text-center px-2">QR Code disponível em breve</p>
                </div>
              )}
              <p className="text-xs text-gray-400">Apresente na entrada do evento</p>
            </div>
          </div>
        </div>

        {/* Ações */}
        <div className="flex gap-4 mt-8">
          <Button
            onClick={() => router.push("/dashboard-user")}
            variant="secondary"
            className="cursor-pointer px-6"
          >
            Ir para Meus Ingressos
          </Button>
        </div>

      </main>
    </div>
  )
}

export default function TicketPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 animate-pulse">Carregando ingresso...</p>
      </div>
    }>
      <TicketContent />
    </Suspense>
  )
}