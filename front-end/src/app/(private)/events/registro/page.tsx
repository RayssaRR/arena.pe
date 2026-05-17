"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { postJsonWithAuth, uploadImageToPublicAssets } from "@/lib/api";

const EVENTO_URL =
  process.env.NEXT_PUBLIC_EVENTO_URL ?? "http://localhost:8080/events";

function toLocalDateTime(value: string): string {
  return `${value}T00:00:00`;
}

export default function RegistroEventoPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const token = localStorage.getItem("authToken");
    if (!token) {
      setErrorMessage("Voce precisa estar autenticado para registrar eventos.");
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);
    const imagem = formData.get("imagem");
    const dataEvento = String(formData.get("dataEvento") ?? "").trim();

    if (!(imagem instanceof File) || imagem.size === 0) {
      setErrorMessage("Selecione uma imagem valida.");
      return;
    }

    if (!dataEvento) {
      setErrorMessage("Informe a data do evento.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const imageUrl = await uploadImageToPublicAssets(imagem, token);

      const payload = {
        title: String(formData.get("titulo") ?? "").trim(),
        description: String(formData.get("descricao") ?? "").trim(),
        eventDate: toLocalDateTime(dataEvento),
        capacity: Number(formData.get("capacidade") ?? 0),
        status: String(formData.get("statusEvento") ?? ""),
        imageUrl,
      };

      await postJsonWithAuth(EVENTO_URL, payload, token);
      setSuccessMessage("Evento registrado com sucesso.");
      form.reset();
    } catch {
      setErrorMessage("Nao foi possivel registrar o evento. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-linear-to-b from-background via-background to-muted/40 px-4 py-10 sm:py-16">
      <section className="mx-auto w-full max-w-2xl">
        <Card className="shadow-sm">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl font-semibold tracking-tight">
              Registro de evento
            </CardTitle>
            <CardDescription>
              Preencha os dados para cadastrar um novo evento.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="titulo">Titulo</Label>
                <Input
                  id="titulo"
                  name="titulo"
                  type="text"
                  placeholder="Ex: Torneio de Inverno"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="descricao">Descricao</Label>
                <Textarea
                  id="descricao"
                  name="descricao"
                  placeholder="Descreva os detalhes do evento"
                  className="min-h-28 resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="dataEvento">Data do evento</Label>
                  <Input id="dataEvento" name="dataEvento" type="date" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="capacidade">Capacidade</Label>
                  <Input
                    id="capacidade"
                    name="capacidade"
                    type="number"
                    min={1}
                    placeholder="Ex: 300"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="statusEvento">Status do evento</Label>
                <select
                  id="statusEvento"
                  name="statusEvento"
                  required
                  className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Selecione o status
                  </option>
                  <option value="UPCOMING">UPCOMING</option>
                  <option value="ONGOING">ONGOING</option>
                  <option value="COMPLETED">COMPLETED</option>
                  <option value="CANCELED">CANCELED</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="imagem">Imagem</Label>
                <Input
                  id="imagem"
                  name="imagem"
                  type="file"
                  accept="image/*"
                  required
                />
              </div>

              <Button type="submit" className="w-full sm:w-auto" disabled={isSubmitting}>
                {isSubmitting ? "Enviando..." : "Registrar evento"}
              </Button>

              {errorMessage ? (
                <p className="text-sm text-destructive">{errorMessage}</p>
              ) : null}

              {successMessage ? (
                <p className="text-sm text-green-700">{successMessage}</p>
              ) : null}
            </form>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
