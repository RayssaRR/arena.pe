"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { postJson } from "@/lib/api";

const LOGIN_URL =
  process.env.NEXT_PUBLIC_LOGIN_URL ?? "http://localhost:8080/auth/login";

function extractJwtToken(response: unknown): string | null {
  if (!response || typeof response !== "object") {
    return null;
  }

  const record = response as Record<string, unknown>;

  const directToken = record.token ?? record.accessToken ?? record.jwt;
  if (typeof directToken === "string" && directToken.trim()) {
    return directToken;
  }

  const nestedData = record.data;
  if (!nestedData || typeof nestedData !== "object") {
    return null;
  }

  const nestedRecord = nestedData as Record<string, unknown>;
  const nestedToken = nestedRecord.token ?? nestedRecord.accessToken ?? nestedRecord.jwt;

  if (typeof nestedToken === "string" && nestedToken.trim()) {
    return nestedToken;
  }

  return null;
}

export default function LoginPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = {
      email: String(formData.get("email") ?? "").trim(),
      password: String(formData.get("senha") ?? ""),
    };

    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const response = await postJson<unknown, typeof payload>(LOGIN_URL, payload);
      const token = extractJwtToken(response);

      if (!token) {
        setErrorMessage("Login retornou sem token JWT.");
        return;
      }

      localStorage.setItem("authToken", token);
      setSuccessMessage("Login realizado com sucesso.");
      form.reset();
      router.push("/events/registro");
    } catch {
      setErrorMessage("Nao foi possivel fazer login. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-linear-to-b from-background via-background to-muted/40 px-4 py-10 sm:py-16">
      <section className="mx-auto w-full max-w-md">
        <Card className="shadow-sm">
          <CardHeader className="space-y-2 text-center">
            <CardTitle className="text-2xl font-semibold tracking-tight">Entrar</CardTitle>
            <CardDescription>
              Informe seu email e senha para acessar sua conta.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
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
                  placeholder="Sua senha"
                  autoComplete="current-password"
                  minLength={8}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Entrando..." : "Entrar"}
              </Button>

              {errorMessage ? (
                <p className="text-sm text-destructive">{errorMessage}</p>
              ) : null}

              {successMessage ? (
                <p className="text-sm text-green-700">{successMessage}</p>
              ) : null}
            </form>

            <p className="mt-4 text-center text-sm text-muted-foreground">
              Nao tem conta?{" "}
              <Link href="/cadastro" className="font-medium text-foreground underline underline-offset-4">
                Cadastre-se
              </Link>
            </p>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
