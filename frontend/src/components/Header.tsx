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
    <header className="bg-white/90 dark:bg-black/90 text-zinc-900 dark:text-white p-4 shadow border-b border-zinc-200 dark:border-zinc-800 transition-colors">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center max-w-4xl gap-4">
        <h1 className="text-xl font-bold">Backlog de Jogos</h1>
        {user && (
          <div className="flex items-center gap-4 sm:gap-6">
            <nav className="flex gap-4">
              <Link 
                to="/" 
                className={`text-sm font-medium hover:text-primary transition-colors ${location.pathname === "/" ? "text-primary" : "text-zinc-500 dark:text-zinc-400"}`}
              >
                Meu Backlog
              </Link>
              <Link 
                to="/dashboard" 
                className={`text-sm font-medium hover:text-primary transition-colors ${location.pathname === "/dashboard" ? "text-primary" : "text-zinc-500 dark:text-zinc-400"}`}
              >
                Dashboard
              </Link>
            </nav>
            <div className="flex items-center gap-4 border-l border-zinc-300 dark:border-zinc-700 pl-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              <span className="text-sm text-zinc-600 dark:text-zinc-400 hidden sm:inline">Olá, {user.name}</span>
              <Button variant="outline" size="sm" onClick={logout} className="border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-900 dark:text-white bg-white dark:bg-zinc-900">
                Sair
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}