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
          <p className="subtitle">
            Id do Evento: #AR-2026-081
          </p>
          <h1 className="title-h1">
            Santa Cruz vs Figueirense
          </h1>
          <p className="subtitle">
            Outubro 11, 2026 - Arena Pernambuco
          </p>
        </header>

        

      </form>
    </main>
  );
}