import { useState, useMemo } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getGames, createGame, updateGame, deleteGame } from "@/lib/api"
import type { Game } from "@/lib/game"
import { GameCard } from "@/components/GameCard"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { GameForm } from "@/components/GameForm"
import { toast } from "sonner"
import { Loader2, Filter, ArrowUpDown } from "lucide-react"

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
      toast.success("Jogo criado com sucesso!")
    },
    onError: (error: any) => {
      const msg = error.response?.data?.error || "Erro ao criar jogo"
      toast.error(msg)
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, game }: { id: string, game: Omit<Game, "id"> }) => updateGame(id, game),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["games"] })
      setEditing(null)
      toast.success("Jogo atualizado com sucesso!")
    },
    onError: (error: any) => {
      const msg = error.response?.data?.error || "Erro ao atualizar jogo"
      toast.error(msg)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteGame,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["games"] })
      toast.success("Jogo deletado com sucesso!")
    },
    onError: (error: any) => {
      const msg = error.response?.data?.error || "Erro ao deletar jogo"
      toast.error(msg)
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
    deleteMutation.mutate(id)
  }

  return (
    <div className="flex flex-col min-h-screen text-zinc-900 dark:text-white bg-zinc-50 dark:bg-transparent transition-colors">
      <Header />
      <main className="flex-1 py-10 sm:py-16 px-6 max-w-6xl mx-auto w-full space-y-10">
        <section className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1 flex gap-3">
            <Input
              placeholder="Buscar por título..."
              className="bg-transparent border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 w-full font-light h-11 rounded-xl"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button 
              variant={showFilters ? "default" : "outline"}
              onClick={() => setShowFilters(!showFilters)}
              className="shrink-0 border-zinc-200 dark:border-zinc-800 bg-transparent text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 h-11 rounded-xl font-light"
            >
              <Filter className="w-4 h-4 mr-2" /> Filtros
            </Button>
          </div>
          <Button
            onClick={() => {
              setCreating(true)
              setEditing(null)
            }}
            disabled={createMutation.isPending || updateMutation.isPending}
            className={`w-full sm:w-auto bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 h-11 px-6 rounded-xl font-medium transition-all ${
              creating ? "opacity-70 scale-95" : ""
            }`}
          >
            {creating ? "Adicionando..." : "Adicionar Jogo"}
          </Button>
        </section>

        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 p-6 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800/50 rounded-2xl shadow-sm">
            <div>
              <label className="text-xs font-light text-zinc-400 mb-2 block uppercase tracking-wider">Status</label>
              <select 
                className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent text-zinc-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-zinc-400 font-light transition-all"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="Todos">Todos</option>
                <option value="Jogando">Jogando</option>
                <option value="Zerado">Zerado</option>
                <option value="Dropado">Dropado</option>
                <option value="Planejado">Planejado</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-light text-zinc-400 mb-2 block uppercase tracking-wider">Plataforma</label>
              <select 
                className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent text-zinc-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-zinc-400 font-light transition-all"
                value={filterPlatform}
                onChange={(e) => setFilterPlatform(e.target.value)}
              >
                <option value="Todas">Todas</option>
                <option value="PC">PC</option>
                <option value="PlayStation">PlayStation</option>
                <option value="Xbox">Xbox</option>
                <option value="Nintendo">Nintendo</option>
                <option value="Mobile">Mobile</option>
                <option value="Outro">Outro</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-light text-zinc-400 mb-2 block uppercase tracking-wider">Ordenar Por</label>
              <select 
                className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent text-zinc-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-zinc-400 font-light transition-all"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
              >
                <option value="title">Título</option>
                <option value="rating">Nota</option>
                <option value="timePlayed">Horas Jogadas</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-light text-zinc-400 mb-2 block uppercase tracking-wider">Ordem</label>
              <div className="flex">
                <Button 
                  variant="outline"
                  className="w-full border-zinc-200 dark:border-zinc-800 bg-transparent text-zinc-900 dark:text-white hover:bg-zinc-50 dark:hover:bg-zinc-800/50 font-light rounded-xl h-[38px]"
                  onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                >
                  <ArrowUpDown className="w-3 h-3 mr-2" />
                  {sortOrder === "asc" ? "Crescente" : "Decrescente"}
                </Button>
              </div>
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
          <div className="flex justify-center items-center py-20 text-zinc-500 font-light">
            <Loader2 className="w-6 h-6 animate-spin mr-3 text-zinc-300" />
            <span>Carregando...</span>
          </div>
        ) : isError ? (
          <div className="text-center py-20 text-red-500 font-light">
            Ocorreu um erro ao carregar os jogos.
          </div>
        ) : processedGames.length === 0 ? (
          <div className="text-center py-32 text-zinc-500 dark:text-zinc-500">
            <p className="text-xl font-light text-zinc-400 mb-2">Nenhum jogo encontrado</p>
            <p className="text-sm font-light">Tente mudar os filtros ou adicione um novo jogo.</p>
          </div>
        ) : (
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
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