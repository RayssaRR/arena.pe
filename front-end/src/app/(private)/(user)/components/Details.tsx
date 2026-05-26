'use client'
import { useState } from "react";
import Overview from "./Overview";
import Location from "./Location";

interface DetailsProps {
  description?: string;
}

export default function Details({ description }: DetailsProps) {
  const [type, setType] = useState<"overview" | "location">("overview");

  const tabClass = (active: boolean) =>
    `font-bold transition ${
      active
        ? "text-(--blue)"
        : "text-gray-600 hover:text-black cursor-pointer"
    }`;

  return (
    <>
      <div className="flex gap-10">
        <button
          onClick={() => setType("overview")}
          className={tabClass(type === "overview")}
        >
          Visão Geral
        </button>
        <button
          onClick={() => setType("location")}
          className={tabClass(type === "location")}
        >
          Localização
        </button>
      </div>

      {type === "overview" && <Overview description={description} />}
      {type === "location" && <Location />}
    </>
  );
}