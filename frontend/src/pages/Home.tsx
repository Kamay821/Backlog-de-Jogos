import { useState, useMemo } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getGames, createGame, updateGame, deleteGame } from "@/lib/api"
import type { Game } from "@/lib/game"
import { GameCard } from "@/components/GameCard"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { GameForm } from "@/components/GameForm"
import { toast } from "sonner"
import { Loader2, Filter, Search, Plus, Terminal } from "lucide-react"

export default function Home() {
  const [search, setSearch] = useState("")
  const [creating, setCreating] = useState(false)
  const [editing, setEditing] = useState<Game | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  
  // Filtros Avançados
  const [filterStatus, setFilterStatus] = useState<string>("Todos")
  const [filterPlatform, setFilterPlatform] = useState<string>("Todas")
  const [sortBy, setSortBy] = useState<"title" | "rating" | "timePlayed">("title")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")

  const queryClient = useQueryClient()

  const { data: games = [], isLoading, isError } = useQuery({
    queryKey: ["games"],
    queryFn: getGames,
  })

  const createMutation = useMutation({
    mutationFn: createGame,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["games"] })
      setCreating(false)
      toast.success("REGISTRO INSERIDO COM SUCESSO.", { className: "bg-[#0a0e1a] text-[#00f0ff] border border-[#00f0ff] font-orbitron" })
    },
    onError: (error: any) => {
      const msg = error.response?.data?.error || "FALHA NA CRIAÇÃO"
      toast.error(msg, { className: "bg-[#0a0e1a] text-red-500 border border-red-500 font-orbitron" })
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, game }: { id: string, game: Omit<Game, "id"> }) => updateGame(id, game),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["games"] })
      setEditing(null)
      toast.success("REGISTRO ATUALIZADO COM SUCESSO.", { className: "bg-[#0a0e1a] text-[#d500f9] border border-[#d500f9] font-orbitron" })
    },
    onError: (error: any) => {
      const msg = error.response?.data?.error || "FALHA NA ATUALIZAÇÃO"
      toast.error(msg, { className: "bg-[#0a0e1a] text-red-500 border border-red-500 font-orbitron" })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteGame,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["games"] })
      toast.success("REGISTRO DELETADO DO SISTEMA.", { className: "bg-[#0a0e1a] text-red-500 border border-red-500 font-orbitron" })
    },
    onError: (error: any) => {
      const msg = error.response?.data?.error || "ERRO DE DELEÇÃO"
      toast.error(msg, { className: "bg-[#0a0e1a] text-red-500 border border-red-500 font-orbitron" })
    },
  })

  const processedGames = useMemo(() => {
    let result = games.filter(game =>
      game.title.toLowerCase().includes(search.toLowerCase())
    )

    if (filterStatus !== "Todos") {
      result = result.filter(game => game.status === filterStatus)
    }

    if (filterPlatform !== "Todas") {
      result = result.filter(game => game.platform === filterPlatform)
    }

    result = result.sort((a, b) => {
      let valA: any = a[sortBy]
      let valB: any = b[sortBy]

      if (valA === null || valA === undefined) valA = sortBy === 'title' ? '' : 0
      if (valB === null || valB === undefined) valB = sortBy === 'title' ? '' : 0

      if (sortBy === 'title') {
        return sortOrder === "asc" 
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA)
      } else {
        return sortOrder === "asc" ? valA - valB : valB - valA
      }
    })

    return result
  }, [games, search, filterStatus, filterPlatform, sortBy, sortOrder])

  function handleCreate(newGame: Omit<Game, "id">) {
    createMutation.mutate(newGame)
  }

  function handleEdit(game: Game) {
    setEditing(game)
  }

  function handleUpdate(updatedGame: Omit<Game, "id">) {
    if (!editing) return
    updateMutation.mutate({ id: editing.id, game: updatedGame })
  }

  function handleDelete(id: string) {
    if (confirm("ATENÇÃO: DESEJA EXCLUIR ESTE REGISTRO PERMANENTEMENTE?")) {
      deleteMutation.mutate(id)
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-10 sm:py-16 px-6 max-w-7xl mx-auto w-full space-y-10 animate-in-fade">
        <section className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative">
          <div className="space-y-2">
            <h2 className="text-4xl font-orbitron font-bold tracking-widest text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">
              SISTEMA_DE_<span className="text-[var(--color-neon-purple)]">BACKLOG</span>
            </h2>
            <p className="text-[var(--color-neon-cyan)] font-rajdhani text-lg uppercase tracking-wider drop-shadow-[0_0_5px_rgba(0,240,255,0.5)]">
              Gerencie e acompanhe a sua progressão.
            </p>
          </div>
          <button
            onClick={() => {
              setCreating(true)
              setEditing(null)
            }}
            disabled={createMutation.isPending || updateMutation.isPending}
            className="w-full md:w-auto cyber-button font-orbitron font-bold text-sm px-8 py-3 flex items-center justify-center gap-2"
          >
            {creating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
            {creating ? "INICIANDO PROCESSO..." : "NOVO REGISTRO"}
          </button>
        </section>

        <section className="glass-cyber p-3 rounded-lg flex flex-col sm:flex-row gap-4 transition-all">
          <div className="relative flex-1 flex items-center">
            <Search className="absolute left-4 text-[var(--color-neon-cyan)] w-5 h-5 drop-shadow-[0_0_5px_rgba(0,240,255,0.5)]" />
            <input
              placeholder="BUSCAR DADOS..."
              className="w-full pl-12 bg-transparent border-0 border-b-2 border-transparent focus:border-[var(--color-neon-cyan)] focus:outline-none focus:ring-0 text-white h-11 placeholder:text-slate-500 font-orbitron tracking-wider transition-colors"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="w-px bg-[rgba(0,240,255,0.2)] hidden sm:block mx-1 my-2" />
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`shrink-0 h-11 px-6 font-orbitron font-bold text-xs uppercase tracking-widest transition-all border ${showFilters ? 'bg-[rgba(0,240,255,0.1)] border-[var(--color-neon-cyan)] text-[var(--color-neon-cyan)] shadow-[0_0_10px_rgba(0,240,255,0.3)]' : 'border-[rgba(255,255,255,0.1)] text-slate-400 hover:border-[var(--color-neon-purple)] hover:text-[var(--color-neon-purple)]'} flex items-center justify-center`}
          >
            <Filter className="w-4 h-4 mr-2" /> PARÂMETROS
          </button>
        </section>

        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 p-6 glass-cyber border-t-2 border-t-[var(--color-neon-purple)] animate-in-fade">
            <div className="space-y-2">
              <label className="text-[10px] font-orbitron text-[var(--color-neon-cyan)] uppercase tracking-widest block drop-shadow-[0_0_5px_rgba(0,240,255,0.5)]">Status</label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full cyber-input h-11 rounded-md px-3 font-orbitron text-xs tracking-wider">
                  <SelectValue placeholder="TODOS" />
                </SelectTrigger>
                <SelectContent className="bg-[#0a0e1a] border border-[var(--color-neon-cyan)] shadow-[0_0_15px_rgba(0,240,255,0.3)]">
                  <SelectItem value="Todos" className="text-white hover:bg-[rgba(0,240,255,0.2)] focus:bg-[rgba(0,240,255,0.2)] font-orbitron text-xs cursor-pointer">TODOS</SelectItem>
                  <SelectItem value="Jogando" className="text-white hover:bg-[rgba(0,240,255,0.2)] focus:bg-[rgba(0,240,255,0.2)] font-orbitron text-xs cursor-pointer">JOGANDO</SelectItem>
                  <SelectItem value="Zerado" className="text-white hover:bg-[rgba(0,240,255,0.2)] focus:bg-[rgba(0,240,255,0.2)] font-orbitron text-xs cursor-pointer">ZERADO</SelectItem>
                  <SelectItem value="Dropado" className="text-white hover:bg-[rgba(0,240,255,0.2)] focus:bg-[rgba(0,240,255,0.2)] font-orbitron text-xs cursor-pointer">DROPADO</SelectItem>
                  <SelectItem value="Planejado" className="text-white hover:bg-[rgba(0,240,255,0.2)] focus:bg-[rgba(0,240,255,0.2)] font-orbitron text-xs cursor-pointer">PLANEJADO</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-orbitron text-[var(--color-neon-cyan)] uppercase tracking-widest block drop-shadow-[0_0_5px_rgba(0,240,255,0.5)]">Plataforma</label>
              <Select value={filterPlatform} onValueChange={setFilterPlatform}>
                <SelectTrigger className="w-full cyber-input h-11 rounded-md px-3 font-orbitron text-xs tracking-wider">
                  <SelectValue placeholder="TODAS" />
                </SelectTrigger>
                <SelectContent className="bg-[#0a0e1a] border border-[var(--color-neon-cyan)] shadow-[0_0_15px_rgba(0,240,255,0.3)]">
                  <SelectItem value="Todas" className="text-white hover:bg-[rgba(0,240,255,0.2)] focus:bg-[rgba(0,240,255,0.2)] font-orbitron text-xs cursor-pointer">TODAS</SelectItem>
                  <SelectItem value="PC" className="text-white hover:bg-[rgba(0,240,255,0.2)] focus:bg-[rgba(0,240,255,0.2)] font-orbitron text-xs cursor-pointer">PC</SelectItem>
                  <SelectItem value="PlayStation" className="text-white hover:bg-[rgba(0,240,255,0.2)] focus:bg-[rgba(0,240,255,0.2)] font-orbitron text-xs cursor-pointer">PLAYSTATION</SelectItem>
                  <SelectItem value="Xbox" className="text-white hover:bg-[rgba(0,240,255,0.2)] focus:bg-[rgba(0,240,255,0.2)] font-orbitron text-xs cursor-pointer">XBOX</SelectItem>
                  <SelectItem value="Nintendo" className="text-white hover:bg-[rgba(0,240,255,0.2)] focus:bg-[rgba(0,240,255,0.2)] font-orbitron text-xs cursor-pointer">NINTENDO</SelectItem>
                  <SelectItem value="Mobile" className="text-white hover:bg-[rgba(0,240,255,0.2)] focus:bg-[rgba(0,240,255,0.2)] font-orbitron text-xs cursor-pointer">MOBILE</SelectItem>
                  <SelectItem value="Outro" className="text-white hover:bg-[rgba(0,240,255,0.2)] focus:bg-[rgba(0,240,255,0.2)] font-orbitron text-xs cursor-pointer">OUTRO</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-orbitron text-[var(--color-neon-cyan)] uppercase tracking-widest block drop-shadow-[0_0_5px_rgba(0,240,255,0.5)]">Ordenar Por</label>
              <Select value={sortBy} onValueChange={(val: any) => setSortBy(val)}>
                <SelectTrigger className="w-full cyber-input h-11 rounded-md px-3 font-orbitron text-xs tracking-wider">
                  <SelectValue placeholder="TÍTULO" />
                </SelectTrigger>
                <SelectContent className="bg-[#0a0e1a] border border-[var(--color-neon-cyan)] shadow-[0_0_15px_rgba(0,240,255,0.3)]">
                  <SelectItem value="title" className="text-white hover:bg-[rgba(0,240,255,0.2)] focus:bg-[rgba(0,240,255,0.2)] font-orbitron text-xs cursor-pointer">TÍTULO</SelectItem>
                  <SelectItem value="rating" className="text-white hover:bg-[rgba(0,240,255,0.2)] focus:bg-[rgba(0,240,255,0.2)] font-orbitron text-xs cursor-pointer">NOTA</SelectItem>
                  <SelectItem value="timePlayed" className="text-white hover:bg-[rgba(0,240,255,0.2)] focus:bg-[rgba(0,240,255,0.2)] font-orbitron text-xs cursor-pointer">HORAS JOGADAS</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-orbitron text-[var(--color-neon-cyan)] uppercase tracking-widest block drop-shadow-[0_0_5px_rgba(0,240,255,0.5)]">Ordem</label>
              <Select value={sortOrder} onValueChange={(val: any) => setSortOrder(val)}>
                <SelectTrigger className="w-full cyber-input h-11 rounded-md px-3 font-orbitron text-xs tracking-wider">
                  <SelectValue placeholder="CRESCENTE" />
                </SelectTrigger>
                <SelectContent className="bg-[#0a0e1a] border border-[var(--color-neon-cyan)] shadow-[0_0_15px_rgba(0,240,255,0.3)]">
                  <SelectItem value="asc" className="text-white hover:bg-[rgba(0,240,255,0.2)] focus:bg-[rgba(0,240,255,0.2)] font-orbitron text-xs cursor-pointer">CRESCENTE</SelectItem>
                  <SelectItem value="desc" className="text-white hover:bg-[rgba(0,240,255,0.2)] focus:bg-[rgba(0,240,255,0.2)] font-orbitron text-xs cursor-pointer">DECRESCENTE</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {creating && (
          <GameForm
            onSubmit={handleCreate}
            onCancel={() => setCreating(false)}
          />
        )}

        {editing && (
          <GameForm
            initial={editing}
            onSubmit={handleUpdate}
            onCancel={() => setEditing(null)}
          />
        )}

        {isLoading ? (
          <div className="flex flex-col justify-center items-center py-32 text-[var(--color-neon-cyan)] font-orbitron tracking-widest">
            <Loader2 className="w-12 h-12 animate-spin mb-4 drop-shadow-[0_0_10px_rgba(0,240,255,0.8)]" />
            <span>SINCRONIZANDO DADOS...</span>
          </div>
        ) : isError ? (
          <div className="text-center py-20 text-red-500 font-orbitron tracking-widest bg-[rgba(239,68,68,0.1)] border border-red-500 rounded-lg shadow-[inset_0_0_15px_rgba(239,68,68,0.2)]">
            FALHA CRÍTICA AO ACESSAR OS DADOS.
          </div>
        ) : processedGames.length === 0 ? (
          <div className="text-center py-24 bg-[#050710] border border-[rgba(0,240,255,0.3)] rounded-lg flex flex-col items-center shadow-[inset_0_0_20px_rgba(0,0,0,1)] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[var(--color-neon-purple)] to-transparent opacity-50" />
            <Terminal className="w-12 h-12 text-[var(--color-neon-purple)] mb-4 drop-shadow-[0_0_10px_rgba(213,0,249,0.8)]" />
            <p className="text-2xl font-orbitron font-bold text-white mb-2 tracking-widest drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]">SISTEMA VAZIO</p>
            <p className="text-sm font-rajdhani text-[var(--color-neon-cyan)] max-w-sm mb-8 uppercase tracking-widest opacity-80">
              Nenhum dado encontrado nos parâmetros especificados.
            </p>
            {!search && filterStatus === "Todos" && filterPlatform === "Todas" ? (
              <button onClick={() => setCreating(true)} className="cyber-button text-xs py-2 px-6 font-bold">
                INICIALIZAR PRIMEIRO REGISTRO
              </button>
            ) : (
              <button onClick={() => { setSearch(""); setFilterStatus("Todos"); setFilterPlatform("Todas"); }} className="cyber-button text-xs py-2 px-6 font-bold border-[var(--color-neon-purple)] text-[var(--color-neon-purple)] before:bg-[var(--color-neon-purple)]">
                RESETAR PARÂMETROS
              </button>
            )}
          </div>
        ) : (
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {processedGames.map((game) => (
              <GameCard
                key={game.id}
                game={game}
                onDelete={() => handleDelete(game.id)}
                onEdit={() => handleEdit(game)}
              />
            ))}
          </section>
        )}
      </main>
      <Footer />
    </div>
  )
}