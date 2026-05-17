import { Calendar } from "lucide-react";
import { MapPin } from 'lucide-react';
import BuyTicketCard from "../components/BuyTicketCard";
import Details from "../components/Details";


export default function EventDetails(){
    return(
        <main className="p-8 min-h-screen">
            <section className="bg-black/70 text-white p-10 rounded-3xl h-[50vh] flex flex-col justify-end gap-3 shadow-xl">
                <p className="bg-(--blue) p-1 rounded-full font-bold w-fit px-4">
                Campeonato Brasileiro Série C
                </p>

                <p className="title-h1 text-white">
                Santa Cruz vs. Figueirense
                </p>

                <div className="flex gap-10">
                    <div className="flex gap-2">
                        <Calendar/>
                        <p className="inline">OUT 11, 2026 - 16:30</p>
                    </div>

                    <div className="flex gap-2">
                       <MapPin/>
                        <p className="inline">Arena Pernambuco, recife</p>
                    </div>
                </div>
            </section>
            <section className="flex gap-10 py-7">
                <div className="w-full">
                    <Details></Details>
                </div>

                <div className="w-full">
                    <BuyTicketCard></BuyTicketCard>
                </div>
            </section>

        </main>
    )
}