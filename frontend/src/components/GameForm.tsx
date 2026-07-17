import { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { Game, ExternalGameResult } from "@/lib/game"
import { searchExternalGames } from "@/lib/api"
import { Loader2 } from "lucide-react"

type Props = {
  initial?: Omit<Game, "id">
  onSubmit: (game: Omit<Game, "id">) => void
  onCancel?: () => void
}

export function GameForm({ initial, onSubmit, onCancel }: Props) {
  const [title, setTitle] = useState(initial?.title ?? "")
  const [genre, setGenre] = useState(initial?.genre ?? "")
  const [status, setStatus] = useState<Game["status"]>(initial?.status ?? "Jogando")
  const [rating, setRating] = useState(initial?.rating ?? 0)
  const [platform, setPlatform] = useState(initial?.platform ?? "")
  const [timePlayed, setTimePlayed] = useState(initial?.timePlayed ?? 0)
  const [coverUrl, setCoverUrl] = useState<string | null>(initial?.coverUrl ?? null)
  const [metacritic, setMetacritic] = useState<number | null>(initial?.metacritic ?? null)

  const [debouncedTitle, setDebouncedTitle] = useState(title)
  const [showSuggestions, setShowSuggestions] = useState(false)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedTitle(title)
    }, 500)
    return () => clearTimeout(handler)
  }, [title])

  const { data: suggestions = [], isFetching } = useQuery({
    queryKey: ["rawgSearch", debouncedTitle],
    queryFn: () => searchExternalGames(debouncedTitle),
    enabled: debouncedTitle.length > 2 && showSuggestions,
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSubmit({ 
      title, 
      genre, 
      status, 
      rating, 
      coverUrl, 
      metacritic,
      platform: platform || null,
      timePlayed
    })
  }

  function handleSelectSuggestion(game: ExternalGameResult) {
    setTitle(game.title)
    setGenre(game.genre)
    setCoverUrl(game.coverUrl)
    setMetacritic(game.metacritic)
    setShowSuggestions(false)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-md dark:shadow-lg border border-zinc-200 dark:border-zinc-700 relative"
    >
      <div className="relative">
        <Input
          placeholder="Título do Jogo"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value)
            setShowSuggestions(true)
          }}
          onFocus={() => setShowSuggestions(true)}
          required
          className="bg-zinc-50 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white"
        />
        {showSuggestions && debouncedTitle.length > 2 && (
          <div className="absolute z-10 w-full mt-1 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md shadow-lg max-h-60 overflow-y-auto">
            {isFetching ? (
              <div className="p-3 text-sm text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" /> Buscando na RAWG...
              </div>
            ) : suggestions.length > 0 ? (
              suggestions.map((game, i) => (
                <div
                  key={i}
                  className="p-3 hover:bg-zinc-100 dark:hover:bg-zinc-700 cursor-pointer flex items-center gap-3 border-b border-zinc-100 dark:border-zinc-700/50 last:border-0 transition-colors"
                  onClick={() => handleSelectSuggestion(game)}
                >
                  {game.coverUrl ? (
                    <img src={game.coverUrl} alt="Cover" className="w-10 h-10 object-cover rounded" />
                  ) : (
                    <div className="w-10 h-10 bg-zinc-200 dark:bg-zinc-600 rounded flex items-center justify-center text-xs text-center text-zinc-500 dark:text-zinc-400">Sem Imagem</div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{game.title}</p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">{game.genre}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-3 text-sm text-zinc-500 dark:text-zinc-400">Nenhum jogo encontrado.</div>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          placeholder="Gênero"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          required
          className="bg-zinc-50 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white"
        />
        <select
          className="w-full p-3 rounded-xl border border-zinc-300 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
        >
          <option value="">Selecione a Plataforma...</option>
          <option value="PC">PC</option>
          <option value="PlayStation">PlayStation</option>
          <option value="Xbox">Xbox</option>
          <option value="Nintendo">Nintendo</option>
          <option value="Mobile">Mobile</option>
          <option value="Outro">Outro</option>
        </select>
      </div>

      <select
        className="w-full p-3 rounded-xl border border-zinc-300 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
        value={status}
        onChange={(e) => setStatus(e.target.value as Game["status"])}
      >
        <option>Jogando</option>
        <option>Zerado</option>
        <option>Dropado</option>
        <option>Planejado</option>
      </select>
      
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="text-sm text-zinc-500 dark:text-zinc-400 mb-1 block">Nota (0-10)</label>
          <Input
            type="number"
            min={0}
            max={10}
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            required
            className="bg-zinc-50 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white"
          />
        </div>
        <div className="flex-1">
          <label className="text-sm text-zinc-500 dark:text-zinc-400 mb-1 block">Horas Jogadas</label>
          <Input
            type="number"
            min={0}
            value={timePlayed}
            onChange={(e) => setTimePlayed(Number(e.target.value))}
            className="bg-zinc-50 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white"
          />
        </div>
      </div>
      
      {coverUrl && (
        <div className="flex gap-2 items-center text-sm text-green-400 bg-green-400/10 p-2 rounded border border-green-500/20">
          <span>✓ Capa oficial vinculada</span>
          {metacritic && <span>• Metacritic: {metacritic}</span>}
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <Button type="submit" className="bg-primary">
          Salvar
        </Button>
        {onCancel && (
          <Button variant="secondary" onClick={onCancel}>
            Cancelar
          </Button>
        )}
      </div>
    </form>
  )
}
