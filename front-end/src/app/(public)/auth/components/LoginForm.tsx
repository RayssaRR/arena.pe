"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";

export default function LoginForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);

  const buttonStyle =
    "flex-1 bg-white/0 border-2 border-gray-300 text-gray-500 cursor-pointer";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked } = e.target;
    if (type === "checkbox") {
      setRememberMe(checked);
    } else {
      setFormData((prev) => ({
        ...prev,
        [id]: value,
      }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Validação básica
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

      // Fazer requisição
      const response = await login({
        email: formData.email,
        password: formData.password,
      });

      // Armazenar token e role
      localStorage.setItem("authToken", response.token);
      localStorage.setItem("userRole", response.role);
      
      if (rememberMe) {
        localStorage.setItem("rememberEmail", formData.email);
      } else {
        localStorage.removeItem("rememberEmail");
      }

      // Redirecionar baseado no role
      const redirectUrl = response.role === "ADMIN" ? "/dashboard-admin" : "/dashboard-user";
      router.push(redirectUrl);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Erro ao fazer login. Verifique suas credenciais.";
      setError(errorMessage);
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

      {/* Email */}
      <div className="mt-5 flex flex-col space-y-2">
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
      <div className="my-0 flex flex-col space-y-2">
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

      <div className="flex items-center justify-between">
        {/* Lembrar a senha */}
        <div className="flex items-center space-x-2">
          <Input
            id="remember"
            type="checkbox"
            className="w-fit"
            checked={rememberMe}
            onChange={handleChange}
            disabled={isLoading}
          />
          <Label htmlFor="remember" className="text-sm">
            Lembrar email
          </Label>
        </div>

        <a
          href="#"
          className="text-sm text-(--blue) font-bold hover:pointer"
        >
          Esqueceu sua senha?
        </a>
      </div>

      {/* Entrar */}
      <Button
        className="bg-(--blue) py-4 cursor-pointer"
        type="submit"
        disabled={isLoading}
      >
        {isLoading ? "Entrando..." : "Entrar"}
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