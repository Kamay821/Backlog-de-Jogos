import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { Sun, Moon } from "lucide-react";

export function Header() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const location = useLocation();

  return (
    <header className="bg-transparent text-zinc-900 dark:text-zinc-100 p-6 border-b border-zinc-100 dark:border-zinc-900/50 transition-colors">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center max-w-5xl gap-4">
        <h1 className="text-xl font-medium tracking-tight">Backlog de Jogos</h1>
        {user && (
          <div className="flex items-center gap-4 sm:gap-6">
            <nav className="flex gap-4">
              <Link 
                to="/" 
                className={`text-sm font-light hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors ${location.pathname === "/" ? "text-zinc-900 dark:text-zinc-100 font-normal" : "text-zinc-500 dark:text-zinc-400"}`}
              >
                Meu Backlog
              </Link>
              <Link 
                to="/dashboard" 
                className={`text-sm font-light hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors ${location.pathname === "/dashboard" ? "text-zinc-900 dark:text-zinc-100 font-normal" : "text-zinc-500 dark:text-zinc-400"}`}
              >
                Dashboard
              </Link>
            </nav>
            <div className="flex items-center gap-4 border-l border-zinc-200 dark:border-zinc-800 pl-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50"
              >
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
              <span className="text-sm font-light text-zinc-500 dark:text-zinc-400 hidden sm:inline">Olá, {user.name}</span>
              <Button variant="outline" size="sm" onClick={logout} className="border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 text-zinc-600 dark:text-zinc-300 bg-transparent font-light">
                Sair
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}