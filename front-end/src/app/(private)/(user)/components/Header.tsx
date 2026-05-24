import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 px-8 py-4">
      <div className="max-w-7xl mx-auto grid grid-cols-3 items-center">

        {/* Logo */}
        <Link href="/home" className="font-bold text-lg text-gray-900">
          Arena.pe
        </Link>

        {/* Nav — centralizado */}
        <nav className="flex items-center justify-center gap-6">
          <Link href="/event-discover" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
            Eventos
          </Link>
          <Link href="/about" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
            Sobre
          </Link>
        </nav>

        {/* Auth buttons */}
        <div className="flex items-center justify-end gap-3">
          <Link href="/auth?tab=register" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
            Cadastre-se
          </Link>
          <Button asChild className="bg-(--blue) hover:bg-(--blue-hover) text-white text-sm px-5">
            <Link href="/auth?tab=login">Entrar</Link>
          </Button>
        </div>

      </div>
    </header>
  );
}