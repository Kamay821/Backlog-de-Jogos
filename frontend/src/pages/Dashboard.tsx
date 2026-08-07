import { useQuery } from "@tanstack/react-query";
import { getGames } from "@/lib/api";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { TrendingUp, Trophy, Target, Gamepad2, Terminal } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
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

const COLORS = ["#00f0ff", "#d500f9", "#3b82f6", "#f59e0b", "#ef4444"];

export default function Dashboard() {
  const { data: games = [], isLoading, isError } = useQuery({
    queryKey: ["games"],
    queryFn: getGames,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 py-10 sm:py-16 px-6 max-w-7xl mx-auto w-full space-y-10 animate-in-fade">
          <Skeleton className="h-10 w-64 rounded-lg bg-[rgba(0,240,255,0.1)] border border-[rgba(0,240,255,0.2)]" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Skeleton className="h-32 w-full rounded-xl bg-[rgba(0,240,255,0.05)] border border-[rgba(0,240,255,0.1)]" />
            <Skeleton className="h-32 w-full rounded-xl bg-[rgba(0,240,255,0.05)] border border-[rgba(0,240,255,0.1)]" />
            <Skeleton className="h-32 w-full rounded-xl bg-[rgba(0,240,255,0.05)] border border-[rgba(0,240,255,0.1)]" />
            <Skeleton className="h-32 w-full rounded-xl bg-[rgba(0,240,255,0.05)] border border-[rgba(0,240,255,0.1)]" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">
            <Skeleton className="h-[400px] w-full rounded-2xl bg-[rgba(213,0,249,0.05)] border border-[rgba(213,0,249,0.1)]" />
            <Skeleton className="h-[400px] w-full rounded-2xl bg-[rgba(0,240,255,0.05)] border border-[rgba(0,240,255,0.1)]" />
          </div>
        </main>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex justify-center items-center">
          <div className="text-center py-20 px-10 text-red-500 font-orbitron tracking-widest bg-[rgba(239,68,68,0.1)] rounded-2xl border border-red-500 shadow-[inset_0_0_15px_rgba(239,68,68,0.2)]">
            FALHA CRÍTICA AO PROCESSAR ESTATÍSTICAS.
          </div>
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
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-10 sm:py-16 px-6 max-w-7xl mx-auto w-full space-y-10 animate-in-fade">
        <div className="space-y-2">
          <h2 className="text-4xl font-orbitron font-bold tracking-widest text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">
            DASHBOARD_DE_<span className="text-[var(--color-neon-cyan)]">ANÁLISE</span>
          </h2>
          <p className="text-[var(--color-neon-purple)] font-rajdhani text-lg uppercase tracking-wider drop-shadow-[0_0_5px_rgba(213,0,249,0.5)]">
            Estatísticas detalhadas da sua base de dados.
          </p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="cyber-card p-6 border-[var(--color-neon-cyan)] hover:shadow-[0_0_20px_rgba(0,240,255,0.3)]">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-[rgba(0,240,255,0.1)] text-[var(--color-neon-cyan)] rounded-lg border border-[rgba(0,240,255,0.3)]">
                <Gamepad2 className="w-5 h-5 drop-shadow-[0_0_5px_rgba(0,240,255,0.8)]" />
              </div>
              <h3 className="text-xs font-orbitron text-slate-400 uppercase tracking-widest">Registros Totais</h3>
            </div>
            <p className="text-4xl font-orbitron font-bold text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]">{totalGames}</p>
          </div>
          
          <div className="cyber-card p-6 border-[#10b981] hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-[rgba(16,185,129,0.1)] text-[#10b981] rounded-lg border border-[rgba(16,185,129,0.3)]">
                <Target className="w-5 h-5 drop-shadow-[0_0_5px_rgba(16,185,129,0.8)]" />
              </div>
              <h3 className="text-xs font-orbitron text-slate-400 uppercase tracking-widest">Missões Cumpridas</h3>
            </div>
            <p className="text-4xl font-orbitron font-bold text-[#10b981] drop-shadow-[0_0_5px_rgba(16,185,129,0.5)]">{completedGames}</p>
          </div>
          
          <div className="cyber-card p-6 border-[var(--color-neon-purple)] hover:shadow-[0_0_20px_rgba(213,0,249,0.3)]">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-[rgba(213,0,249,0.1)] text-[var(--color-neon-purple)] rounded-lg border border-[rgba(213,0,249,0.3)]">
                <TrendingUp className="w-5 h-5 drop-shadow-[0_0_5px_rgba(213,0,249,0.8)]" />
              </div>
              <h3 className="text-xs font-orbitron text-slate-400 uppercase tracking-widest">Progresso Total</h3>
            </div>
            <p className="text-4xl font-orbitron font-bold text-[var(--color-neon-purple)] drop-shadow-[0_0_5px_rgba(213,0,249,0.5)]">{completedPercentage}%</p>
          </div>
          
          <div className="cyber-card p-6 border-[#f59e0b] hover:shadow-[0_0_20px_rgba(245,158,11,0.3)]">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-[rgba(245,158,11,0.1)] text-[#f59e0b] rounded-lg border border-[rgba(245,158,11,0.3)]">
                <Trophy className="w-5 h-5 drop-shadow-[0_0_5px_rgba(245,158,11,0.8)]" />
              </div>
              <h3 className="text-xs font-orbitron text-slate-400 uppercase tracking-widest">Score Médio</h3>
            </div>
            <p className="text-4xl font-orbitron font-bold text-[#f59e0b] drop-shadow-[0_0_5px_rgba(245,158,11,0.5)]">{averageRating}</p>
          </div>
        </div>

        {/* Charts */}
        {totalGames > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">
            <div className="glass-cyber rounded-xl p-8 border border-[rgba(0,240,255,0.2)]">
              <h3 className="text-sm font-orbitron font-bold text-[var(--color-neon-cyan)] uppercase tracking-widest mb-8 block text-center drop-shadow-[0_0_5px_rgba(0,240,255,0.5)]">
                Distribuição de Status
              </h3>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent = 0 }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {statusData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: "rgba(10, 14, 26, 0.95)", borderColor: "var(--color-neon-cyan)", color: "#fff", borderRadius: "8px", boxShadow: "0 0 15px rgba(0,240,255,0.3)", fontFamily: "Orbitron" }}
                      itemStyle={{ color: "#fff" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="glass-cyber rounded-xl p-8 border border-[rgba(213,0,249,0.2)]">
              <h3 className="text-sm font-orbitron font-bold text-[var(--color-neon-purple)] uppercase tracking-widest mb-8 block text-center drop-shadow-[0_0_5px_rgba(213,0,249,0.5)]">
                Top 5 Gêneros
              </h3>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={genreData} margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} fontFamily="Orbitron" />
                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} fontFamily="Orbitron" />
                    <Tooltip 
                      cursor={{ fill: "rgba(213, 0, 249, 0.1)" }}
                      contentStyle={{ backgroundColor: "rgba(10, 14, 26, 0.95)", borderColor: "var(--color-neon-purple)", color: "#fff", borderRadius: "8px", boxShadow: "0 0 15px rgba(213,0,249,0.3)", fontFamily: "Orbitron" }}
                    />
                    <Bar dataKey="count" fill="var(--color-neon-purple)" radius={[6, 6, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-24 bg-[#050710] border border-[rgba(0,240,255,0.3)] rounded-lg flex flex-col items-center shadow-[inset_0_0_20px_rgba(0,0,0,1)] relative overflow-hidden mt-8">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[var(--color-neon-cyan)] to-transparent opacity-50" />
            <Terminal className="w-12 h-12 text-slate-500 mb-4 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]" />
            <p className="text-2xl font-orbitron font-bold text-white mb-2 tracking-widest drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]">DADOS INSUFICIENTES</p>
            <p className="text-sm font-rajdhani text-[var(--color-neon-purple)] max-w-sm uppercase tracking-widest opacity-80">
              Cadastre registros no sistema para compilar estatísticas.
            </p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
