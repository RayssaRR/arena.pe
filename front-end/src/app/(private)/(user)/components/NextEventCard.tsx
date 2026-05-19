'use client';

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use } from "react";

export default function NextEventCard() {

  const router = useRouter(); 

  return (
    <Card className="mx-auto w-full pt-0">
      {/* Header (título + categoria) */}
      <CardHeader className="bg-black/70 text-white p-5">
        <p className="bg-white p-1 rounded-md text-(--blue) font-bold w-fit px-4">
          Esporte
        </p>
      </CardHeader>

      {/* Conteúdo */}
      <CardContent className="space-y-2 p-5">
        <p className="text-(--blue) font-bold">OUT 11 - 16:30</p>

        <h4 className="body-lg font-semibold">Maracatu e Rock com NZ</h4>

        <p className="text-(--gray) text-sm">Acompanhe o show da Nação Zumbi, uma das maiores referências sa música...</p>
      </CardContent>

      {/* Footer */}
      <CardFooter className="flex justify-end gap-5 bg-white p-5">
        <h4 className="body-lg font-semibold">R$ 80,00 +</h4>

        <Button onClick={() => router.push("/event-details")} className="bg-(--blue) hover:bg-(--blue-hover) cursor-pointer">
          Detalhes
        </Button>
      </CardFooter>
    </Card>
  );
}
