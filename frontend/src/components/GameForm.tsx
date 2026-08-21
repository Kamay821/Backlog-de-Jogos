import { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Game, ExternalGameResult } from "@/lib/game"
import { searchExternalGames } from "@/lib/api"
import { Loader2, Search, Gamepad2, Trophy, Clock } from "lucide-react"

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

  const isTitleChanged = !initial || title !== initial.title;

  const { data: suggestions = [], isFetching } = useQuery({
    queryKey: ["rawgSearch", debouncedTitle],
    queryFn: () => searchExternalGames(debouncedTitle),
    enabled: debouncedTitle.length > 2 && showSuggestions && isTitleChanged,
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
    <Dialog open={true} onOpenChange={(open) => { if (!open && onCancel) onCancel() }}>
      <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden bg-transparent border-0 shadow-2xl">
        <div className="relative glass-cyber p-6 rounded-xl border border-[rgba(0,240,255,0.3)] shadow-[0_0_30px_rgba(0,0,0,0.8),inset_0_0_20px_rgba(213,0,249,0.1)]">
          
          {/* Tech Decorators */}
          <div className="absolute top-0 left-4 w-12 h-1 bg-[var(--color-neon-cyan)]" />
          <div className="absolute top-0 right-4 w-12 h-1 bg-[var(--color-neon-purple)]" />
          
          <DialogHeader className="mb-6">
            <DialogTitle className="text-2xl font-orbitron font-bold text-white flex items-center gap-3 tracking-wide drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
              <Gamepad2 className="w-6 h-6 text-[var(--color-neon-purple)] drop-shadow-[0_0_5px_rgba(213,0,249,0.8)]" />
              {initial ? "EDITAR REGISTRO" : "NOVO REGISTRO"}
            </DialogTitle>
            <DialogDescription className="text-slate-400 font-rajdhani text-base">
              INSERIR DADOS DO JOGO NO SISTEMA CENTRAL
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-neon-cyan)]" />
                <input
                  placeholder="TÍTULO DO JOGO..."
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value)
                    setShowSuggestions(true)
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  required
                  className="w-full pl-10 h-11 cyber-input rounded-md uppercase font-orbitron text-sm tracking-wider"
                />
              </div>
              
              {showSuggestions && debouncedTitle.length > 2 && isTitleChanged && (
                <div className="absolute z-50 w-full mt-1 bg-[#0a0e1a] border border-[var(--color-neon-cyan)] rounded-md shadow-[0_0_15px_rgba(0,240,255,0.2)] max-h-60 overflow-y-auto">
                  {isFetching ? (
                    <div className="p-4 text-sm text-[var(--color-neon-cyan)] flex items-center justify-center gap-2 font-orbitron">
                      <Loader2 className="w-4 h-4 animate-spin" /> PROCESSANDO...
                    </div>
                  ) : suggestions.length > 0 ? (
                    suggestions.map((game, i) => (
                      <div
                        key={i}
                        className="p-3 hover:bg-[rgba(0,240,255,0.1)] cursor-pointer flex items-center gap-4 border-b border-[rgba(0,240,255,0.2)] last:border-0 transition-colors"
                        onClick={() => handleSelectSuggestion(game)}
                      >
                        {game.coverUrl ? (
                          <img src={game.coverUrl} alt="Cover" className="w-12 h-16 object-cover rounded shadow-[0_0_5px_rgba(255,255,255,0.2)]" />
                        ) : (
                          <div className="w-12 h-16 bg-[rgba(255,255,255,0.05)] rounded flex items-center justify-center text-xs text-center text-slate-500">SEM DADOS</div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-white truncate font-orbitron tracking-wider">{game.title}</p>
                          <p className="text-xs text-[var(--color-neon-purple)] truncate mt-0.5 uppercase tracking-widest">{game.genre}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-sm text-center text-slate-400 font-orbitron">NENHUM RESULTADO ENCONTRADO.</div>
                  )}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-[10px] font-orbitron text-[var(--color-neon-cyan)] uppercase tracking-widest block drop-shadow-[0_0_5px_rgba(0,240,255,0.5)]">Gênero</label>
                <input
                  placeholder="EX: RPG, AÇÃO..."
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  required
                  className="w-full cyber-input h-11 rounded-md px-3 uppercase text-sm tracking-wide"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-orbitron text-[var(--color-neon-cyan)] uppercase tracking-widest block drop-shadow-[0_0_5px_rgba(0,240,255,0.5)]">Plataforma</label>
                <Select value={platform} onValueChange={setPlatform}>
                  <SelectTrigger className="w-full cyber-input h-11 rounded-md px-3 font-orbitron text-xs tracking-wider">
                    <SelectValue placeholder="SELECIONE..." />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0a0e1a] border border-[var(--color-neon-cyan)] shadow-[0_0_15px_rgba(0,240,255,0.3)]">
                    <SelectItem value="PC" className="text-white hover:bg-[rgba(0,240,255,0.2)] focus:bg-[rgba(0,240,255,0.2)] font-orbitron text-xs cursor-pointer">PC</SelectItem>
                    <SelectItem value="PlayStation" className="text-white hover:bg-[rgba(0,240,255,0.2)] focus:bg-[rgba(0,240,255,0.2)] font-orbitron text-xs cursor-pointer">PLAYSTATION</SelectItem>
                    <SelectItem value="Xbox" className="text-white hover:bg-[rgba(0,240,255,0.2)] focus:bg-[rgba(0,240,255,0.2)] font-orbitron text-xs cursor-pointer">XBOX</SelectItem>
                    <SelectItem value="Nintendo" className="text-white hover:bg-[rgba(0,240,255,0.2)] focus:bg-[rgba(0,240,255,0.2)] font-orbitron text-xs cursor-pointer">NINTENDO</SelectItem>
                    <SelectItem value="Mobile" className="text-white hover:bg-[rgba(0,240,255,0.2)] focus:bg-[rgba(0,240,255,0.2)] font-orbitron text-xs cursor-pointer">MOBILE</SelectItem>
                    <SelectItem value="Outro" className="text-white hover:bg-[rgba(0,240,255,0.2)] focus:bg-[rgba(0,240,255,0.2)] font-orbitron text-xs cursor-pointer">OUTRO</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-orbitron text-[var(--color-neon-cyan)] uppercase tracking-widest block drop-shadow-[0_0_5px_rgba(0,240,255,0.5)]">Status</label>
              <Select value={status} onValueChange={(val) => setStatus(val as Game["status"])}>
                <SelectTrigger className="w-full cyber-input h-11 rounded-md px-3 font-orbitron text-xs tracking-wider">
                  <SelectValue placeholder="STATUS" />
                </SelectTrigger>
                <SelectContent className="bg-[#0a0e1a] border border-[var(--color-neon-cyan)] shadow-[0_0_15px_rgba(0,240,255,0.3)]">
                  <SelectItem value="Jogando" className="text-white hover:bg-[rgba(0,240,255,0.2)] focus:bg-[rgba(0,240,255,0.2)] font-orbitron text-xs cursor-pointer">JOGANDO</SelectItem>
                  <SelectItem value="Zerado" className="text-white hover:bg-[rgba(0,240,255,0.2)] focus:bg-[rgba(0,240,255,0.2)] font-orbitron text-xs cursor-pointer">ZERADO</SelectItem>
                  <SelectItem value="Dropado" className="text-white hover:bg-[rgba(0,240,255,0.2)] focus:bg-[rgba(0,240,255,0.2)] font-orbitron text-xs cursor-pointer">DROPADO</SelectItem>
                  <SelectItem value="Planejado" className="text-white hover:bg-[rgba(0,240,255,0.2)] focus:bg-[rgba(0,240,255,0.2)] font-orbitron text-xs cursor-pointer">PLANEJADO</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex gap-5">
              <div className="flex-1 space-y-2">
                <label className="text-[10px] font-orbitron text-[var(--color-neon-purple)] uppercase tracking-widest flex items-center gap-2 drop-shadow-[0_0_5px_rgba(213,0,249,0.5)]">
                  <Trophy className="w-3.5 h-3.5" /> AVALIAÇÃO (0-10)
                </label>
                <input
                  type="number"
                  min={0}
                  max={10}
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  required
                  className="w-full cyber-input h-11 rounded-md px-3 font-orbitron text-lg"
                />
              </div>
              <div className="flex-1 space-y-2">
                <label className="text-[10px] font-orbitron text-[var(--color-neon-cyan)] uppercase tracking-widest flex items-center gap-2 drop-shadow-[0_0_5px_rgba(0,240,255,0.5)]">
                  <Clock className="w-3.5 h-3.5" /> TEMPO (HORAS)
                </label>
                <input
                  type="number"
                  min={0}
                  value={timePlayed}
                  onChange={(e) => setTimePlayed(Number(e.target.value))}
                  className="w-full cyber-input h-11 rounded-md px-3 font-orbitron text-lg"
                />
              </div>
            </div>
            
            {coverUrl && (
              <div className="flex gap-3 items-center text-xs font-orbitron text-[var(--color-neon-cyan)] bg-[rgba(0,240,255,0.05)] p-4 rounded-md border border-[rgba(0,240,255,0.2)] shadow-[inset_0_0_10px_rgba(0,240,255,0.1)]">
                <span className="flex-1 flex items-center gap-2 tracking-wider">
                  <div className="w-2 h-2 rounded-full bg-[var(--color-neon-cyan)] animate-pulse" />
                  DADOS DE CAPA SINCRONIZADOS
                </span>
                {metacritic && <span className="flex items-center gap-2 tracking-wider text-[var(--color-neon-purple)] drop-shadow-[0_0_3px_rgba(213,0,249,0.5)]"><Trophy className="w-3 h-3" /> MC: {metacritic}</span>}
              </div>
            )}

            <div className="flex justify-end gap-4 pt-6 mt-4">
              {onCancel && (
                <button type="button" onClick={onCancel} className="font-orbitron text-xs tracking-wider text-slate-400 hover:text-white transition-colors uppercase">
                  Abortar
                </button>
              )}
              <button type="submit" className="cyber-button text-sm py-2 px-8 font-bold">
                EXECUTAR
              </button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
