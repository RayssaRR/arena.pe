import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

export default function NextEventCard() {
  return (
    <Card className="mx-auto w-full pt-0">
      {/* Header (título + categoria) */}
      <CardHeader className="bg-black/70 text-white p-5">
        <p className="bg-white p-1 rounded-md text-(--blue) font-bold w-fit px-4">
          Esporte
        </p>

        <CardTitle className="text-xl mt-4">
          Santa Cruz vs. Figueirense
        </CardTitle>

        <CardDescription className="text-white">
          Acompanhe a partida válida pela Série C 2026.
        </CardDescription>
      </CardHeader>

      {/* Conteúdo */}
      <CardContent className="space-y-2 p-5">
        <p className="text-(--blue) font-bold">OUT 11 - 16:30</p>

        <h4 className="body-lg font-semibold">Informações do assento</h4>

        <p className="text-(--gray) text-sm">Arquibancada Setor Sul.</p>
      </CardContent>

      {/* Footer */}
      <CardFooter className="flex justify-end gap-5 bg-white p-5">
        <Button className="bg-(--red) hover:bg-(--red-hover) cursor-pointer">
          Cancelar
        </Button>
        <Button className="bg-(--blue) hover:bg-(--blue-hover) cursor-pointer">
          Obter ingresso
        </Button>
      </CardFooter>
    </Card>
  );
}
