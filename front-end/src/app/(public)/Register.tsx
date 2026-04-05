import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Register() {
  const buttonStyle = "flex-1 bg-white/0 border-2 border-gray-300 text-gray-500 cursor-pointer"
  return (
    <form className="flex flex-col space-y-4">
      
      {/* Nome */}
      <div className="mt-5 flex flex-col space-y-2">
        <Label htmlFor="name">Nome</Label>
        <Input
          id="name"
          type="name"
          placeholder="Informe seu nome"
          required
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
        />
      </div>

      {/* Senha */}
      <div className=" flex flex-col space-y-2">
        <Label htmlFor="password">Senha</Label>
        <Input
          id="password"
          type="password"
          placeholder="Informe sua senha"
          required
        />
      </div>

      {/* Criar conta */}
      <Button className="bg-blue-600 py-4 cursor-pointer">Criar uma conta</Button>
      <p className="self-center text-gray-500">Ou continue com</p>

      {/* Google e Facebook */}
      <div className="flex gap-5">
        <Button className={buttonStyle}>Google</Button>
        <Button className={buttonStyle}>Facebook</Button>
      </div>
    </form>
  );
}