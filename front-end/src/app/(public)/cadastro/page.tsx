"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { postJson } from "@/lib/api";

const CADASTRO_URL =
  process.env.NEXT_PUBLIC_CADASTRO_URL ?? "http://localhost:8080/auth/register";

export default function CadastroPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = {
      name: String(formData.get("nome") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      password: String(formData.get("senha") ?? ""),
    };

    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      await postJson(CADASTRO_URL, payload);
      setSuccessMessage("Cadastro enviado com sucesso.");
      form.reset();
    } catch {
      setErrorMessage("Nao foi possivel enviar o cadastro. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-linear-to-b from-background via-background to-muted/40 px-4 py-10 sm:py-16">
      <section className="mx-auto w-full max-w-md">
        <Card className="shadow-sm">
          <CardHeader className="space-y-2 text-center">
            <CardTitle className="text-2xl font-semibold tracking-tight">Criar conta</CardTitle>
            <CardDescription>
              Preencha os dados abaixo para cadastrar um novo usuario.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="nome">Nome</Label>
                <Input
                  id="nome"
                  name="nome"
                  type="text"
                  placeholder="Seu nome completo"
                  autoComplete="name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="voce@exemplo.com"
                  autoComplete="email"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="senha">Senha</Label>
                <Input
                  id="senha"
                  name="senha"
                  type="password"
                  placeholder="Crie uma senha"
                  autoComplete="new-password"
                  minLength={8}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Enviando..." : "Cadastrar"}
              </Button>

              {errorMessage ? (
                <p className="text-sm text-destructive">{errorMessage}</p>
              ) : null}

              {successMessage ? (
                <p className="text-sm text-green-700">{successMessage}</p>
              ) : null}
            </form>

            <p className="mt-4 text-center text-sm text-muted-foreground">
              Ja tem conta?{" "}
              <Link href="/login" className="font-medium text-foreground underline underline-offset-4">
                Entrar
              </Link>
            </p>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
