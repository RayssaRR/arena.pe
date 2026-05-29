"use client";

import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import Login from "./components/LoginForm";
import Register from "./components/RegisterForm";
import { useState, useEffect } from "react";

export default function Page() {
  const searchParams = useSearchParams();
  const [type, setType] = useState<"login" | "register">(
    searchParams.get("tab") === "register" ? "register" : "login"
  );
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  useEffect(() => {
    if (successMessage) {
      setShowSuccessAlert(true);
      const timer = setTimeout(() => {
        setShowSuccessAlert(false);
        setSuccessMessage(null);
        setType("login");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const tabClass = (active: boolean) =>
    `flex-1 font-bold transition ${
      active
        ? "bg-white text-(--blue)"
        : "bg-transparent text-gray-600 hover:text-black cursor-pointer"
    }`;

  return (
    <main className="flex h-screen">
      {/* Lado esquerdo — imagem fixa */}
      <section
        className="hidden md:flex w-1/2 relative p-10 flex-col justify-between bg-cover bg-center"
        style={{ backgroundImage: "url('/ArenaPernambuco2.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/55" />

        <h1 className="relative z-10 text-white font-bold text-2xl">Arena.pe</h1>

        <div className="relative z-10">
          <h2 className="text-white text-3xl font-bold leading-tight mb-3">
            Conecte-se com o coração de Pernambuco
          </h2>
          <p className="text-white/80">
            Acesse seus eventos, ingressos e serviços do estádio, tudo em um só
            lugar. Sinta a energia da arena.
          </p>
        </div>
      </section>

      {/* Lado Direito */}
      <section className="flex flex-col justify-center items-center p-10 w-full md:w-1/2 overflow-y-auto">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold mb-1">Bem vindo</h2>
          <p className="text-gray-500 text-sm mb-4">
            Acesse seus eventos, ingressos e serviços do estádio, tudo em um só
            lugar. Sinta a energia da arena.
          </p>

          {showSuccessAlert && successMessage && (
            <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded animate-in fade-in">
              <div className="flex items-center justify-between">
                <span>{successMessage}</span>
                <button
                  onClick={() => {
                    setShowSuccessAlert(false);
                    setSuccessMessage(null);
                  }}
                  className="font-bold text-green-700 hover:text-green-900"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          <nav className="flex bg-gray-200 rounded-lg p-0.5 mb-5">
            <Button
              onClick={() => setType("login")}
              className={tabClass(type === "login")}
            >
              Login
            </Button>
            <Button
              onClick={() => setType("register")}
              className={tabClass(type === "register")}
            >
              Register
            </Button>
          </nav>

          <section>
            {type === "login" && <Login />}
            {type === "register" && (
              <Register
                onSuccess={(message) => setSuccessMessage(message)}
                onError={(error) => console.error(error)}
              />
            )}
          </section>

          <footer className="flex gap-10 justify-center mt-10 text-gray-400 text-xs">
            <p>TERMOS</p>
            <p>PRIVACIDADE</p>
            <p>COOKIES</p>
          </footer>
        </div>
      </section>
    </main>
  );
}