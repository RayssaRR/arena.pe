"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login } from "@/lib/api";
import { getUserFromToken } from "@/lib/jwt-utils";
import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";

interface FieldErrors {
  email?: string;
  password?: string;
}

interface Touched {
  email?: boolean;
  password?: boolean;
}

export default function LoginForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Touched>({});
  const [rememberMe, setRememberMe] = useState(false);

  const buttonStyle =
    "flex-1 bg-white/0 border-2 border-gray-300 text-gray-500 cursor-pointer";

  const validateField = (id: string, value: string): string | undefined => {
    if (id === "email") {
      if (!value.trim()) return "E-mail é obrigatório";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "E-mail inválido";
    }
    if (id === "password") {
      if (!value.trim()) return "Senha é obrigatória";
    }
    return undefined;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked } = e.target;
    if (type === "checkbox") {
      setRememberMe(checked);
      return;
    }
    setFormData((prev) => ({ ...prev, [id]: value }));
    // Só valida em tempo real se o campo já foi tocado
    if (touched[id as keyof Touched]) {
      setFieldErrors((prev) => ({ ...prev, [id]: validateField(id, value) }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setTouched((prev) => ({ ...prev, [id]: true }));
    setFieldErrors((prev) => ({ ...prev, [id]: validateField(id, value) }));
  };

  const validate = (): FieldErrors => {
    return {
      email: validateField("email", formData.email),
      password: validateField("password", formData.password),
    };
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    // Marca tudo como tocado e valida tudo
    setTouched({ email: true, password: true });
    const errors = validate();
    const hasErrors = Object.values(errors).some(Boolean);
    setFieldErrors(errors);
    if (hasErrors) return;

    setIsLoading(true);
    try {
      const response = await login({ email: formData.email, password: formData.password });
      localStorage.setItem("authToken", response.token);
      if (rememberMe) {
        localStorage.setItem("rememberEmail", formData.email);
      } else {
        localStorage.removeItem("rememberEmail");
      }
      const userInfo = getUserFromToken();
      const redirectUrl = userInfo?.role === "ADMIN" ? "/dashboard-admin" : "/dashboard-user";
      router.push(redirectUrl);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao fazer login. Verifique suas credenciais.";
      setError(errorMessage);
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

      {/* Email */}
      <div className="mt-5 flex flex-col space-y-1">
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

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Input
            id="remember"
            type="checkbox"
            className="w-fit"
            checked={rememberMe}
            onChange={handleChange}
            disabled={isLoading}
          />
          <Label htmlFor="remember" className="text-sm">Lembrar email</Label>
        </div>
        <a href="#" className="text-sm text-(--blue) font-bold hover:pointer">
          Esqueceu sua senha?
        </a>
      </div>

      <Button className="bg-(--blue) py-4 cursor-pointer" type="submit" disabled={isLoading}>
        {isLoading ? "Entrando..." : "Entrar"}
      </Button>
    </form>
  );
}