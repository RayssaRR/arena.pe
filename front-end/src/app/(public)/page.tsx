import { Button } from "@/components/ui/button";
import EventForm from "../(private)/events/EventForm";
import MyEvents from "../(private)/events/MyEvents";
import Login from "./Login";
import Register from "./Register";

export default function Page() {
  return (
    <main className="flex h-screen">
      <section className=" bg-[#545454] p-10 flex flex-col justify-between">
        <h1 className="text-white font-bold text-2xl">Arena.pe</h1>
        <div>
          <h2 className="title-h1 text-white">
          Conecte-se com o coração de Pernambuco
        </h2>
        <p className="text-white font-normal">
          Acesse seus eventos, ingressos e serviços do estádio, tudo em um só lugar. Sinta a energia da arena.
        </p>
        </div>
      </section>

      <section className="flex flex-col justify-center items-cenetr p-10">
        <h2 className="title-h1">
          Bem vindo
        </h2>
        <p>
          Acesse seus eventos, ingressos e serviços do estádio, tudo em um só lugar. Sinta a energia da arena.
        </p>

        <section className="flex bg-gray-300 rounded-lg p-0.5 mt-5">
          <Button className="flex-1 bg-white text-blue-600 font-bold">Login</Button>
          <Button className="flex-1 bg-white/0 text-gray-600 font-bold">Register</Button>
        </section>

        <Login/>

        <footer className="flex gap-10 self-center mt-10 text-gray-500">
          <p>TERMOS</p>
          <p>PRIVACIDADE</p>
          <p>COOKIES</p>
        </footer>
      </section>


    </main>
  );
}
