'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function BuyTicketCard() {
  return (
    <article className="border-2 rounded-sm p-7 space-y-7 shadow-xl">
      <h3 className="title-h3">Comprar Ingresso</h3>

      <div className="space-y-2">
        <h4 className="body-md font-bold">
          Selecione o tipo do ingresso
        </h4>

        <select className="input">
            <option value="" disabled>Escolha o ingresso...</option>
            <option value="inteira">Arquibancada Setor sul</option>
            <option value="meia">Meia</option>
            <option value="vip">VIP</option>
        </select>
      </div>


      <div className="space-y-2">
        <h4 className="body-md font-bold">
          Quantidade
        </h4>
        <Input 
          type="number" min="1"
        />
      </div>

      <div className="flex flex-col space-y-2">
        <div className="flex justify-between">
            <p className="body">Subtotal</p>
            <p className="body">R$ 90,00</p>
        </div>

        <div className="flex justify-between">
            <p className="body">Impostos</p>
            <p className="body">R$ 15,00</p>
        </div>

        <div className="flex justify-between">
            <p className="body-lg">Total</p>
            <p className="body-lg">R$ 105,00</p>
        </div>
      </div>
      <Button className="bg-(--blue) px-10 py-5 cursor-pointer w-full">Finalizar a Compra</Button>
    </article>
  )
}