import type { Metadata } from "next";
import { Lexend, Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

const lexendSans = Lexend({
  variable: "--font-lexend-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Arena.pe",
  description: "Plataforma de eventos Arena.pe",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", lexendSans.variable, "font-sans", inter.variable)}
    >
      <body className="min-h-full flex flex-col">
        <header className="border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
          <nav className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-2 px-4 py-3 sm:gap-4">
            <Link href="/" className="text-sm font-semibold text-foreground hover:opacity-80">
              Arena.pe
            </Link>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
                Home
              </Link>
              <Link href="/cadastro" className="text-sm text-muted-foreground hover:text-foreground">
                Cadastro
              </Link>
              <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground">
                Login
              </Link>
              <Link href="/events" className="text-sm text-muted-foreground hover:text-foreground">
                Eventos
              </Link>
              <Link href="/events/registro" className="text-sm text-muted-foreground hover:text-foreground">
                Registrar Evento
              </Link>
            </div>
          </nav>
        </header>

        <div className="flex-1">{children}</div>
      </body>
    </html>
  );
}
