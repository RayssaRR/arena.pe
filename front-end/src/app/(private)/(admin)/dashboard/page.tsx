import Link from "next/link";
import HomeCard from "../components/HomeCard";
import RecentEventsCard from "../components/RecentEventsCard";
import { Button } from "@/components/ui/button";

export default function AdminDashboard() {
  return (
    <main className="p-8 min-h-screen">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="title-h1">Bem vindo de volta, Emanoel!</h1>
          <p className="subtitle">
            Veja o que está acontecendo com seus eventos hoje.
          </p>
        </div>
        <Link href="/events">
          <Button className="bg-(--blue) px-10 py-5 cursor-pointer">
            Criar Evento
          </Button>
        </Link>
      </header>

      {/* Estátisticas */}
      <section>
        <div className="flex gap-5 mt-7">
          <HomeCard />
          <HomeCard />
          <HomeCard />
        </div>
      </section>

      {/* Eventos Recentes */}
      <section>
        <h3 className="title-h3">Eventos Recentes</h3>
        <RecentEventsCard />
      </section>
    </main>
  );
}
