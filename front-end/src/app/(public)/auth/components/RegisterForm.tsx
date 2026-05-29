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

interface FieldErrors {
  name?: string;
  email?: string;
  password?: string;
}

interface Touched {
  name?: boolean;
  email?: boolean;
  password?: boolean;
}

export default function RegisterForm({ onSuccess, onError }: RegisterFormProps) {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Touched>({});

  const buttonStyle =
    "flex-1 bg-white/0 border-2 border-gray-300 text-gray-500 cursor-pointer";

  const validateField = (id: string, value: string): string | undefined => {
    if (id === "name") {
      if (!value.trim()) return "Nome é obrigatório";
    }
    if (id === "email") {
      if (!value.trim()) return "E-mail é obrigatório";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "E-mail inválido";
    }
    if (id === "password") {
      if (!value.trim()) return "Senha é obrigatória";
      if (value.length < 6) return "Senha deve ter no mínimo 6 caracteres";
    }
    return undefined;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (touched[id as keyof Touched]) {
      setFieldErrors((prev) => ({ ...prev, [id]: validateField(id, value) }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setTouched((prev) => ({ ...prev, [id]: true }));
    setFieldErrors((prev) => ({ ...prev, [id]: validateField(id, value) }));
  };

  const validate = (): FieldErrors => ({
    name: validateField("name", formData.name),
    email: validateField("email", formData.email),
    password: validateField("password", formData.password),
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    setTouched({ name: true, email: true, password: true });
    const errors = validate();
    const hasErrors = Object.values(errors).some(Boolean);
    setFieldErrors(errors);
    if (hasErrors) return;

    setIsLoading(true);
    try {
      await register({ name: formData.name, email: formData.email, password: formData.password });
      const successMsg = "Conta criada com sucesso! Faça login para continuar.";
      setFormData({ name: "", email: "", password: "" });
      setFieldErrors({});
      setTouched({});
      if (onSuccess) onSuccess(successMsg);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao criar conta";
      setError(errorMessage);
      if (onError) onError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = (field: keyof FieldErrors) =>
    fieldErrors[field] ? "border-red-400 focus-visible:ring-red-400" : "";

  return (
    <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Nome */}
      <div className="mt-5 flex flex-col space-y-1">
        <Label htmlFor="name">Nome</Label>
        <Input
          id="name"
          type="text"
          placeholder="Informe seu nome"
          value={formData.name}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={isLoading}
          className={inputClass("name")}
        />
        {fieldErrors.name && (
          <p className="text-sm text-red-500">{fieldErrors.name}</p>
        )}
      </div>

      {/* Email */}
      <div className="flex flex-col space-y-1">
        <Label htmlFor="email">E-mail</Label>
        <Input
          id="email"
          type="email"
          placeholder="Informe seu email"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={isLoading}
          className={inputClass("email")}
        />
        {fieldErrors.email && (
          <p className="text-sm text-red-500">{fieldErrors.email}</p>
        )}
      </div>

      {/* Senha */}
      <div className="flex flex-col space-y-1">
        <Label htmlFor="password">Senha</Label>
        <Input
          id="password"
          type="password"
          placeholder="Informe sua senha"
          value={formData.password}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={isLoading}
          className={inputClass("password")}
        />
        {fieldErrors.password && (
          <p className="text-sm text-red-500">{fieldErrors.password}</p>
        )}
      </div>

      <Button className="bg-(--blue) py-4 cursor-pointer" type="submit" disabled={isLoading}>
        {isLoading ? "Criando conta..." : "Criar uma conta"}
      </Button>
      <p className="self-center text-gray-500">Ou continue com</p>

      <div className="flex gap-5">
        <Button type="button" className={buttonStyle} disabled={isLoading}>Google</Button>
        <Button type="button" className={buttonStyle} disabled={isLoading}>Facebook</Button>
      </div>
    </form>
  );
}