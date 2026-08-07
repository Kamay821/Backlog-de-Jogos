import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PlayCircle, Clock, Trash2, Edit2, Gamepad2 } from "lucide-react"
import type { Game } from "@/lib/game"

interface Props {
  game: Game
  onDelete: () => void
  onEdit: () => void
}

export function GameCard({ game, onDelete, onEdit }: Props) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Zerado": return "border-[#00f0ff] text-[#00f0ff] shadow-[0_0_8px_rgba(0,240,255,0.4)]";
      case "Jogando": return "border-[#d500f9] text-[#d500f9] shadow-[0_0_8px_rgba(213,0,249,0.4)]";
      case "Dropado": return "border-red-500 text-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]";
      case "Planejado": return "border-yellow-500 text-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.4)]";
      default: return "border-slate-500 text-slate-400";
    }
  }

  // Create SVG circle for rating
  const circleRadius = 18;
  const circumference = 2 * Math.PI * circleRadius;
  const strokeDashoffset = circumference - (game.rating / 10) * circumference;

  return (
    <div className="cyber-card-hover h-full animate-in-fade relative">
      <Card className="cyber-card flex flex-col h-full bg-transparent border-0 rounded-none">
        
        {/* Cover Image */}
        {game.coverUrl ? (
          <div className="relative h-56 overflow-hidden">
            <img
              src={game.coverUrl}
              alt={`${game.title} capa`}
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e1a] via-transparent to-transparent" />
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none mix-blend-overlay" />
          </div>
        ) : (
          <div className="h-56 bg-[#0a0e1a] flex items-center justify-center border-b border-[rgba(0,240,255,0.2)]">
            <Gamepad2 className="w-16 h-16 text-[var(--color-neon-purple)] opacity-50" />
          </div>
        )}
        
        <CardHeader className="pb-3 pt-4 px-5 relative z-10 flex-none bg-[#0a0e1a]/90 backdrop-blur-md">
          <div className="flex justify-between items-start gap-4 mb-2">
            <Badge variant="outline" className={`font-orbitron text-[10px] uppercase tracking-wider bg-transparent border ${getStatusColor(game.status)}`}>
              {game.status}
            </Badge>
            {game.metacritic && (
              <Badge variant="outline" className="font-orbitron text-[10px] bg-transparent border-[#d500f9] text-[#d500f9] shadow-[0_0_8px_rgba(213,0,249,0.3)]">
                MC {game.metacritic}
              </Badge>
            )}
          </div>
          <CardTitle className="text-xl font-orbitron font-bold tracking-wider text-white line-clamp-2 drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]">
            {game.title}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="px-5 pb-5 flex flex-col flex-1 justify-between bg-[#0a0e1a]/90 backdrop-blur-md border-t border-[rgba(0,240,255,0.1)]">
          <div className="flex justify-between items-center mt-2">
            <div className="space-y-3 text-xs font-orbitron tracking-widest text-slate-400">
              <div className="flex items-center">
                <Gamepad2 className="w-3.5 h-3.5 mr-2 text-[var(--color-neon-cyan)]" />
                <span className="uppercase text-slate-300">{game.genre}</span>
              </div>
              {game.platform && (
                <div className="flex items-center">
                  <PlayCircle className="w-3.5 h-3.5 mr-2 text-[var(--color-neon-purple)]" />
                  <span className="uppercase text-slate-300">{game.platform}</span>
                </div>
              )}
              {(game.timePlayed !== undefined && game.timePlayed !== null) && (
                <div className="flex items-center">
                  <Clock className="w-3.5 h-3.5 mr-2 text-[var(--color-neon-cyan)]" />
                  <span className="uppercase text-slate-300">{game.timePlayed}H</span>
                </div>
              )}
            </div>

            {/* Circular Rating Indicator */}
            <div className="relative flex items-center justify-center w-14 h-14 shrink-0">
              <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                <circle
                  cx="28" cy="28" r="18"
                  fill="transparent"
                  stroke="rgba(0,240,255,0.1)"
                  strokeWidth="3"
                />
                <circle
                  cx="28" cy="28" r="18"
                  fill="transparent"
                  stroke="var(--color-neon-cyan)"
                  strokeWidth="3"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  className="drop-shadow-[0_0_5px_rgba(0,240,255,0.8)] transition-all duration-1000"
                />
              </svg>
              <span className="font-orbitron font-bold text-lg text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">
                {game.rating}
              </span>
            </div>
          </div>
          
          <div className="flex gap-3 mt-6 pt-4 border-t border-[rgba(213,0,249,0.2)]">
            <button 
              onClick={onEdit} 
              className="flex-1 cyber-button text-[10px] py-1.5 flex items-center justify-center"
            >
              <Edit2 className="w-3 h-3 mr-1.5" /> EDITAR
            </button>
            <button 
              onClick={onDelete} 
              className="cyber-button text-[10px] py-1.5 px-3 flex items-center justify-center border-red-500 text-red-500 hover:shadow-[0_0_15px_rgba(239,68,68,0.6)] before:bg-red-500"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
