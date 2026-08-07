import { Terminal } from "lucide-react";

export function Footer() {
  return (
    <footer className="py-6 mt-auto border-t border-[rgba(0,240,255,0.2)] bg-[#050710] relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[var(--color-neon-cyan)] to-transparent opacity-50" />
      <div className="container mx-auto max-w-7xl px-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2 text-[var(--color-neon-cyan)] opacity-70">
          <Terminal className="w-4 h-4" />
          <span className="font-orbitron text-xs tracking-widest uppercase">Projeto Trainee SerraJr. Engenharia</span>
        </div>
        <p className="text-slate-500 font-rajdhani text-sm tracking-wider uppercase">
          © {new Date().getFullYear()} BACKLOG DE JOGOS. <span className="text-[var(--color-neon-purple)]">TODOS OS DIREITOS RESERVADOS.</span>
        </p>
      </div>
    </footer>
  );
}
