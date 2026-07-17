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
      <main className="flex-1 p-4 sm:p-6 max-w-5xl mx-auto w-full space-y-6">
        <h2 className="text-3xl font-bold mb-6">Dashboard de Estatísticas</h2>

        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl shadow-sm dark:shadow-lg">
            <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Total de Jogos</h3>
            <p className="text-4xl font-extrabold text-zinc-900 dark:text-white mt-2">{totalGames}</p>
          </div>
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl shadow-sm dark:shadow-lg">
            <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Jogos Zerados</h3>
            <p className="text-4xl font-extrabold text-green-600 dark:text-green-400 mt-2">{completedGames}</p>
          </div>
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl shadow-sm dark:shadow-lg">
            <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">% Concluído</h3>
            <p className="text-4xl font-extrabold text-blue-600 dark:text-blue-400 mt-2">{completedPercentage}%</p>
          </div>
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl shadow-sm dark:shadow-lg">
            <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Nota Média (Geral)</h3>
            <p className="text-4xl font-extrabold text-primary mt-2">{averageRating}</p>
          </div>
        </div>

        {/* Charts */}
        {totalGames > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl shadow-sm dark:shadow-lg">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">Status dos Jogos</h3>
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

            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl shadow-sm dark:shadow-lg">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">Top 5 Gêneros</h3>
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
