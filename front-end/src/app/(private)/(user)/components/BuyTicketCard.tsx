'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LOCATION_LABELS } from "@/app/(private)/(admin)/components/TicketLocations"

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8080"
const TAX_RATE = 0.1667

type TicketSector = {
  location: string
  price: number
  capacity: number
  sold?: number
}

interface BuyTicketCardProps {
  sectors?: TicketSector[]
  eventId?: string
  eventTitle?: string
  eventDate?: string
}

export default function BuyTicketCard({ sectors = [], eventId, eventTitle, eventDate }: BuyTicketCardProps) {
  const router = useRouter()
  const [selectedLocation, setSelectedLocation] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const selectedSector = sectors.find((s) => s.location === selectedLocation)
  const available = selectedSector ? selectedSector.capacity - (selectedSector.sold ?? 0) : 0
  const subtotal = selectedSector ? selectedSector.price * quantity : 0
  const taxes = subtotal * TAX_RATE
  const total = subtotal + taxes

  const fmt = (value: number) =>
    value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })

  const handleBuy = async () => {
    if (!selectedSector || !eventId) return
    setIsSubmitting(true)
    setError(null)

    try {
      const token = localStorage.getItem("authToken")
      if (!token) throw new Error("Faça login para comprar ingressos")

      const response = await fetch(`${BACKEND_URL}/reservation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          eventId,
          location: selectedLocation,
          quantity,
        }),
      })

      if (!response.ok) throw new Error("Erro ao processar compra")

      const params = new URLSearchParams({
        eventId: eventId ?? "",
        eventTitle: eventTitle ?? "",
        eventDate: eventDate ?? "",
        sector: selectedLocation,
        sectorLabel: LOCATION_LABELS[selectedLocation] ?? selectedLocation,
        quantity: String(quantity),
        total: String(total.toFixed(2)),
      })

      router.push(`/ticket?${params.toString()}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao processar compra")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <article className="border-2 rounded-sm p-7 space-y-7 shadow-xl">
      <h3 className="title-h3">Comprar Ingresso</h3>

      <div className="space-y-2">
        <h4 className="body-md font-bold">Selecione o setor</h4>
        {sectors.length === 0 ? (
          <p className="text-sm text-gray-400">Nenhum setor disponível.</p>
        ) : (
          <select
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedLocation}
            onChange={(e) => { setSelectedLocation(e.target.value); setQuantity(1) }}
          >
            <option value="" disabled>Escolha o setor...</option>
            {sectors.map((s) => {
              const avail = s.capacity - (s.sold ?? 0)
              return (
                <option key={s.location} value={s.location} disabled={avail <= 0}>
                  {LOCATION_LABELS[s.location] ?? s.location} — {fmt(s.price)}{avail <= 0 ? " (Esgotado)" : ""}
                </option>
              )
            })}
          </select>
        )}
        {selectedSector && (
          <p className="text-xs text-gray-500">
            {available.toLocaleString("pt-BR")} ingressos disponíveis de {selectedSector.capacity.toLocaleString("pt-BR")}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <h4 className="body-md font-bold">Quantidade</h4>
        <Input
          type="number"
          min="1"
          max={available}
          value={quantity}
          onChange={(e) => {
            const val = Math.max(1, Math.min(available, parseInt(e.target.value) || 1))
            setQuantity(val)
          }}
          disabled={!selectedLocation}
        />
      </div>

      <div className="flex flex-col space-y-2">
        <div className="flex justify-between">
          <p className="body">Subtotal</p>
          <p className="body">{fmt(subtotal)}</p>
        </div>
        <div className="flex justify-between">
          <p className="body">Impostos</p>
          <p className="body">{fmt(taxes)}</p>
        </div>
        <div className="flex justify-between border-t pt-2">
          <p className="body-lg font-bold">Total</p>
          <p className="body-lg font-bold">{fmt(total)}</p>
        </div>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <Button
        onClick={handleBuy}
        disabled={!selectedLocation || available <= 0 || isSubmitting}
        className="bg-(--blue) px-10 py-5 cursor-pointer w-full disabled:opacity-50"
      >
        {isSubmitting ? "Processando..." : "Finalizar a Compra"}
      </Button>
    </article>
  )
}