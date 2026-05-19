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
      {/* Lado esquerdo */}
      <section className=" bg-[#545454] p-10 flex flex-col justify-between">
        <h1 className="text-white font-bold text-2xl">Arena.pe</h1>
        <div>
          <h2 className="title-h1 text-white">
            Conecte-se com o coração de Pernambuco
          </h2>
          <p className="text-white font-normal">
            Acesse seus eventos, ingressos e serviços do estádio, tudo em um só
            lugar. Sinta a energia da arena.
          </p>
        </div>
      </section>

      {/* Lado Direito */}
      <section className="flex flex-col justify-center items-cenetr p-10">
        <h2 className="title-h1">Bem vindo</h2>
        <p>
          Acesse seus eventos, ingressos e serviços do estádio, tudo em um só
          lugar. Sinta a energia da arena.
        </p>

        {/* Alerta de Sucesso */}
        {showSuccessAlert && successMessage && (
          <div className="mt-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded animate-in fade-in">
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

        {/* Tabs */}
        <nav className="flex bg-gray-300 rounded-lg p-0.5 mt-5">
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

        {/* Conteúdo */}
        <section>
          {type === "login" && <Login />}
          {type === "register" && (
            <Register
              onSuccess={(message) => setSuccessMessage(message)}
              onError={(error) => console.error(error)}
            />
          )}
        </section>

        {/* Rodapé */}
        <footer className="flex gap-10 self-center mt-10 text-gray-500">
          <p>TERMOS</p>
          <p>PRIVACIDADE</p>
          <p>COOKIES</p>
        </footer>
      </section>
    </main>
  );
}