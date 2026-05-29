"use client";

import { useState } from "react";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8080";

export default function PromoteUserPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handlePromote() {
    if (!email.trim()) return;

    try {
      setIsLoading(true);
      setSuccess(null);
      setError(null);

      const token = localStorage.getItem("authToken") ?? "";
      const res = await fetch(
        `${BACKEND_URL}/auth/promote?email=${encodeURIComponent(email)}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message ?? "Erro ao promover usuário.");
      }

      setSuccess(`${email} foi promovido para ADMIN com sucesso.`);
      setEmail("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao promover usuário.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F7F8]">
      <main className="p-8 max-w-lg mx-auto space-y-6">

        <div className="flex items-center gap-3">
          <Shield className="w-6 h-6 text-blue-600" />
          <h1 className="text-2xl font-bold">Promover Usuário</h1>
        </div>

        <div className="bg-white rounded-2xl border p-6 space-y-4">
          <p className="text-sm text-gray-500">
            Informe o email do usuário que deseja promover para <strong>ADMIN</strong>.
          </p>

          <Input
            type="email"
            placeholder="email@exemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handlePromote()}
          />

          {success && (
            <p className="text-sm text-green-600 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
              {success}
            </p>
          )}

          {error && (
            <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              {error}
            </p>
          )}

          <Button
            onClick={handlePromote}
            disabled={isLoading || !email.trim()}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
          >
            {isLoading ? "Promovendo..." : "Promover para ADMIN"}
          </Button>
        </div>

      </main>
    </div>
  );
}