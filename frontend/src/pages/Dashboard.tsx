import { useQuery } from "@tanstack/react-query";
import { getGames } from "@/lib/api";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Loader2 } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444"];

export default function Dashboard() {
  const { data: games = [], isLoading, isError } = useQuery({
    queryKey: ["games"],
    queryFn: getGames,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-transparent transition-colors">
        <Header />
        <main className="flex-1 flex justify-center items-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </main>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-transparent transition-colors">
        <Header />
        <main className="flex-1 flex justify-center items-center text-red-500 dark:text-red-400">
          Erro ao carregar os dados estatísticos.
        </main>
      </div>
    );
  }

  // KPIs
  const totalGames = games.length;
  const completedGames = games.filter((g) => g.status === "Zerado").length;
  const averageRating =
    games.length > 0
      ? (games.reduce((acc, g) => acc + g.rating, 0) / games.length).toFixed(1)
      : "0";
  const completedPercentage =
    totalGames > 0 ? Math.round((completedGames / totalGames) * 100) : 0;

  // Status Data for PieChart
  const statusCounts = games.reduce((acc, game) => {
    acc[game.status] = (acc[game.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const statusData = Object.keys(statusCounts).map((key) => ({
    name: key,
    value: statusCounts[key],
  }));

  // Genre Data for BarChart
  const genreCounts = games.reduce((acc, game) => {
    acc[game.genre] = (acc[game.genre] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const genreData = Object.keys(genreCounts)
    .map((key) => ({ name: key, count: genreCounts[key] }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5); // Top 5

  return (
    <div className="flex flex-col min-h-screen text-zinc-900 dark:text-white bg-zinc-50 dark:bg-transparent transition-colors">
      <Header />
      <main className="flex-1 py-10 sm:py-16 px-6 max-w-6xl mx-auto w-full space-y-10">
        <h2 className="text-2xl font-medium tracking-tight mb-8">Dashboard de Estatísticas</h2>

        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800/50 p-8 rounded-2xl">
            <h3 className="text-xs font-light text-zinc-400 mb-2 uppercase tracking-wider">Total de Jogos</h3>
            <p className="text-4xl font-light text-zinc-900 dark:text-white mt-1">{totalGames}</p>
          </div>
          <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800/50 p-8 rounded-2xl">
            <h3 className="text-xs font-light text-zinc-400 mb-2 uppercase tracking-wider">Jogos Zerados</h3>
            <p className="text-4xl font-light text-green-600 dark:text-green-500 mt-1">{completedGames}</p>
          </div>
          <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800/50 p-8 rounded-2xl">
            <h3 className="text-xs font-light text-zinc-400 mb-2 uppercase tracking-wider">% Concluído</h3>
            <p className="text-4xl font-light text-blue-600 dark:text-blue-500 mt-1">{completedPercentage}%</p>
          </div>
          <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800/50 p-8 rounded-2xl">
            <h3 className="text-xs font-light text-zinc-400 mb-2 uppercase tracking-wider">Nota Média</h3>
            <p className="text-4xl font-light text-zinc-900 dark:text-zinc-100 mt-1">{averageRating}</p>
          </div>
        </div>

        {/* Charts */}
        {totalGames > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800/50 p-8 rounded-2xl">
              <h3 className="text-xs font-light text-zinc-400 uppercase tracking-wider mb-6 block">Status dos Jogos</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent = 0 }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {statusData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: "var(--color-bg)", borderColor: "var(--color-border)", color: "var(--color-text)" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800/50 p-8 rounded-2xl">
              <h3 className="text-xs font-light text-zinc-400 uppercase tracking-wider mb-6 block">Top 5 Gêneros</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={genreData}>
                    <XAxis dataKey="name" stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip 
                      cursor={{ fill: "rgba(161, 161, 170, 0.1)" }}
                      contentStyle={{ backgroundColor: "var(--color-bg)", borderColor: "var(--color-border)", color: "var(--color-text)" }}
                    />
                    <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-20 text-zinc-500 dark:text-zinc-400 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl mt-8 shadow-sm">
            Cadastre alguns jogos para ver suas estatísticas!
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
