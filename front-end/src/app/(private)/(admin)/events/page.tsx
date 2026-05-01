import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ClipboardClock, Coins, ImageDown, Info } from "lucide-react";
import Link from "next/link";

export default function EventForm() {
  return (
    <main className="p-8 min-h-screen">
      <form className="space-y-8">
        {/* Header */}
        <header className="space-y-1">
          <h1 className="title-h1">
            Criar novo evento
          </h1>
          <p className="subtitle">
            Configure os detalhes do evento, programação e preços.
          </p>
        </header>

        {/* Basic Info */}
        <section className="bg-white p-6 rounded-xl border space-y-6">
          <h3 className="flex items-center gap-2 body-lg">
            <Info className="w-5 h-5 text-blue-600" />
            Informações Básicas
          </h3>

          <div className="flex flex-col md:flex-row gap-5">
            <div className="flex flex-col space-y-1 flex-1">
              <Label htmlFor="eventName">Nome do evento</Label>
              <Input id="eventName" name="eventName" placeholder="Ex: Campeonato de Verão 2026"/>
            </div>

            <div className="flex flex-col space-y-1 flex-1">
              <Label htmlFor="category">Categoria</Label>
              <Input placeholder="Digite a categoria"/>
            </div>
            
          </div>

          <div className="flex flex-col space-y-1">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Descreva o evento..."
              className="min-h-30 resize-none"
            />
          </div>
        </section>

        {/* Schedule */}
        <section className="bg-white p-6 rounded-xl border  space-y-6">
          <h3 className="flex items-center gap-2 text-gray-800 font-medium">
            <ClipboardClock className="w-5 h-5 text-blue-600" />
            Agendamento
          </h3>

          <div className="flex flex-col md:flex-row gap-5">
            <div className="flex flex-col space-y-1 flex-1">
              <Label htmlFor="date">Data</Label>
              <Input id="date" name="date" type="date" />
            </div>

            <div className="flex flex-col space-y-1 flex-1">
              <Label htmlFor="startTime">Hora de início</Label>
              <Input id="startTime" name="startTime" type="time" />
            </div>

            <div className="flex flex-col space-y-1 flex-1">
              <Label htmlFor="endTime">Hora de término</Label>
              <Input id="endTime" name="endTime" type="time" />
            </div>
          </div>
        </section>

        {/* Bottom Sections */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Capacity & Pricing */}
          <section className="bg-white p-6 rounded-xl border flex-1 space-y-4">
            <h3 className="flex items-center gap-2 text-gray-800 font-medium">
              <Coins className="w-5 h-5 text-blue-600" />
              Capacidade e Preço
            </h3>

            <div className="flex flex-col space-y-1">
              <Label htmlFor="capacity">Capacidade total</Label>
              <Input id="capacity" name="capacity" type="number" placeholder="500" />
            </div>

            <div className="flex flex-col space-y-1">
              <Label htmlFor="price">Preço do ingresso</Label>
              <Input id="price" name="price" type="number" placeholder="0,00" />
              <span className="text-xs text-gray-400">
                Deixe 0 para eventos gratuitos
              </span>
            </div>
          </section>

          {/* Media */}
          <section className="bg-white p-6 rounded-xl border flex-1 space-y-4">
            <h3 className="flex items-center gap-2 text-gray-800 font-medium">
              <ImageDown className="w-5 h-5 text-blue-600" />
              Mídia
            </h3>

            <label htmlFor="fileUpload" className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-sm text-gray-500 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition">
              <p className="text-blue-600 font-medium">Clique para enviar</p>
              <p>ou arraste e solte</p>
              <p className="text-xs mt-1">PNG, JPG até 10MB</p>
              <input id="fileUpload" name="fileUpload" type="file" className="hidden"/>
            </label>
          </section>
        </div>

        {/* Actions */}
        <footer className="flex justify-end gap-3">
          <Link href="/dashboard">
            <Button variant="secondary" className="px-8 py-4 cursor-pointer">Cancelar</Button>
          </Link>
          <Button className="bg-(--blue) px-10 py-5 cursor-pointer" type="submit">
            Salvar evento
          </Button>
        </footer>
      </form>
    </main>
  );
}