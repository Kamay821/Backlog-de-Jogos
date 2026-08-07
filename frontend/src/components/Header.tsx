import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { Sun, Moon, Gamepad2, Network } from "lucide-react";

export function Header() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 glass-cyber text-slate-100 px-6 py-4 transition-colors">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center max-w-7xl gap-4">
        <div className="flex items-center gap-3">
          <Gamepad2 className="w-8 h-8 text-[var(--color-neon-cyan)] drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]" />
          <h1 className="text-2xl font-orbitron font-bold tracking-widest text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
            BACKLOG <span className="text-[var(--color-neon-cyan)]">JOGOS</span>
          </h1>
        </div>
        
        {user && (
          <div className="flex items-center gap-4 sm:gap-6 bg-[#0a0e1a]/80 py-2 px-6 rounded-full border border-[rgba(0,240,255,0.2)] shadow-[0_0_15px_rgba(0,0,0,0.5)] relative overflow-hidden">
            {/* Tech Decoration */}
            <div className="absolute top-0 left-0 w-8 h-[2px] bg-[var(--color-neon-purple)]" />
            <div className="absolute bottom-0 right-0 w-8 h-[2px] bg-[var(--color-neon-cyan)]" />

            <nav className="flex gap-6 uppercase tracking-wider text-sm">
              <Link 
                to="/" 
                className={`relative flex items-center gap-2 transition-all duration-300 hover:text-[var(--color-neon-cyan)] hover:drop-shadow-[0_0_8px_rgba(0,240,255,0.5)] ${
                  location.pathname === "/" 
                    ? "text-[var(--color-neon-cyan)] drop-shadow-[0_0_8px_rgba(0,240,255,0.5)]" 
                    : "text-slate-400"
                }`}
              >
                <Gamepad2 className="w-4 h-4" />
                Meu Backlog
              </Link>
              <Link 
                to="/dashboard" 
                className={`relative flex items-center gap-2 transition-all duration-300 hover:text-[var(--color-neon-purple)] hover:drop-shadow-[0_0_8px_rgba(213,0,249,0.5)] ${
                  location.pathname === "/dashboard" 
                    ? "text-[var(--color-neon-purple)] drop-shadow-[0_0_8px_rgba(213,0,249,0.5)]" 
                    : "text-slate-400"
                }`}
              >
                <Network className="w-4 h-4" />
                Dashboard
              </Link>
            </nav>
            <div className="flex items-center gap-4 border-l border-[rgba(0,240,255,0.2)] pl-4 ml-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="text-slate-400 hover:text-[#00f0ff] hover:bg-[#00f0ff]/10 rounded-full transition-colors"
              >
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
              <span className="text-sm text-slate-300 hidden sm:inline flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[var(--color-neon-cyan)] shadow-[0_0_8px_var(--color-neon-cyan)] animate-pulse" />
                Olá, {user.name}
              </span>
              <button 
                onClick={logout} 
                className="cyber-button text-xs py-1 px-4 ml-2"
              >
                Sair
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}