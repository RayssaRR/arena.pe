"use client";
import { Button } from "@/components/ui/button";

import Login from "./components/LoginForm";
import Register from "./components/RegisterForm";
import { useState } from "react";

export default function Page() {
  const [type, setType] = useState<"login" | "register">("login");

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
          {type === "register" && <Register />}
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
