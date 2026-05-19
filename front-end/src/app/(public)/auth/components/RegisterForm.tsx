"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { register } from "@/lib/api";
import { useState, FormEvent } from "react";

interface RegisterFormProps {
  onSuccess?: (message: string) => void;
  onError?: (error: string) => void;
}

export default function RegisterForm({ onSuccess, onError }: RegisterFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const buttonStyle =
    "flex-1 bg-white/0 border-2 border-gray-300 text-gray-500 cursor-pointer";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Validação básica
      if (!formData.name.trim()) {
        throw new Error("Nome é obrigatório");
      }
      if (!formData.email.trim()) {
        throw new Error("Email é obrigatório");
      }
      if (!formData.password.trim()) {
        throw new Error("Senha é obrigatória");
      }

      // Validação de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        throw new Error("Email inválido");
      }

      // Validação de senha
      if (formData.password.length < 6) {
        throw new Error("Senha deve ter no mínimo 6 caracteres");
      }

      // Fazer requisição
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      // Sucesso
      const successMsg =
        "Conta criada com sucesso! Faça login para continuar.";
      setFormData({ name: "", email: "", password: "" });
      if (onSuccess) {
        onSuccess(successMsg);
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao criar conta";
      setError(errorMessage);
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
      {/* Mensagem de erro */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Nome */}
      <div className="mt-5 flex flex-col space-y-2">
        <Label htmlFor="name">Nome</Label>
        <Input
          id="name"
          type="text"
          placeholder="Informe seu nome"
          required
          value={formData.name}
          onChange={handleChange}
          disabled={isLoading}
        />
      </div>

      {/* Email */}
      <div className="flex flex-col space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <Input
          id="email"
          type="email"
          placeholder="Informe seu email"
          required
          value={formData.email}
          onChange={handleChange}
          disabled={isLoading}
        />
      </div>

      {/* Senha */}
      <div className="flex flex-col space-y-2">
        <Label htmlFor="password">Senha</Label>
        <Input
          id="password"
          type="password"
          placeholder="Informe sua senha"
          required
          value={formData.password}
          onChange={handleChange}
          disabled={isLoading}
        />
      </div>

      {/* Criar conta */}
      <Button
        className="bg-(--blue) py-4 cursor-pointer"
        type="submit"
        disabled={isLoading}
      >
        {isLoading ? "Criando conta..." : "Criar uma conta"}
      </Button>
      <p className="self-center text-gray-500">Ou continue com</p>

      {/* Google e Facebook */}
      <div className="flex gap-5">
        <Button type="button" className={buttonStyle} disabled={isLoading}>
          Google
        </Button>
        <Button type="button" className={buttonStyle} disabled={isLoading}>
          Facebook
        </Button>
      </div>
    </form>
  );
}