import { useState } from "react";
import { registerUser } from "@/lib/api";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await registerUser({ name, email, password });
      toast.success("Conta criada com sucesso! Faça login.");
      navigate("/login");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Erro ao criar conta");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center justify-center p-6 transition-colors">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-light tracking-tight text-zinc-900 dark:text-white mb-2">Cadastre-se</h1>
          <p className="text-sm font-light text-zinc-500 dark:text-zinc-400">Crie seu Backlog de Jogos</p>
        </div>
        
        <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800/50 p-8 rounded-3xl shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="text"
              placeholder="Seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="bg-transparent border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 font-light rounded-xl h-11"
            />
          </div>
          <div>
            <Input
              type="email"
              placeholder="Seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-transparent border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 font-light rounded-xl h-11"
            />
          </div>
          <div>
            <Input
              type="password"
              placeholder="Sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="bg-transparent border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 font-light rounded-xl h-11"
            />
          </div>
          <Button type="submit" className="w-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 h-11 rounded-xl font-medium mt-6" disabled={isLoading}>
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Criar Conta
          </Button>
        </form>
        
        <p className="text-sm font-light text-zinc-500 mt-6 text-center">
          Já tem uma conta? <Link to="/login" className="text-zinc-900 dark:text-white hover:underline font-normal">Faça login</Link>
        </p>
      </div>
    </div>
  );
}
