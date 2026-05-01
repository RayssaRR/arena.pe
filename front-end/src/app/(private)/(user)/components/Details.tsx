'use client'
import { useState } from "react";
import Overview from "./Overview";
import Lineups from "./Lineups";
import Location from "./Location";

export default function Details(){
    const [type, setType] = useState<"overview" | "lineups" | "location">("overview");

    const tabClass = (active: boolean) =>
    `font-bold transition ${
      active
        ? " text-(--blue) "
        : "text-gray-600 hover:text-black cursor-pointer"
    }`;
    
    return(
        <>
            <div className="flex gap-10">
                <button
                    onClick={() => setType("overview")}
                    className={tabClass(type === "overview")}
                >
                    Visão Geral
                </button>
                <button
                    onClick={() => setType("lineups")}
                    className={tabClass(type === "lineups")}
                >
                    Escalações
                </button>
                <button
                    onClick={() => setType("location")}
                    className={tabClass(type === "location")}
                >
                    Localização
                </button>
            </div>
            

            {/* Conteúdo */}
                {type === "overview" && <Overview/>}
                {type === "lineups" && <Lineups/>}
                {type === "location" && <Location/>}
        </>
    )
}