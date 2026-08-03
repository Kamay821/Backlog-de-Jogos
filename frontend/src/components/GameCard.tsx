import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Game } from "@/lib/game"

interface Props {
  game: Game
  onDelete: () => void
  onEdit: () => void
}

export function GameCard({ game, onDelete, onEdit }: Props) {
  return (
    <Card className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border border-zinc-100 dark:border-zinc-800/50 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden rounded-xl">
      {game.coverUrl && (
        <img
          src={game.coverUrl}
          alt={`${game.title} capa`}
          className="w-full h-48 object-cover"
        />
      )}
      <CardHeader className="flex flex-row items-center justify-between pb-4 pt-5 px-5">
        <CardTitle className="text-lg font-medium tracking-tight truncate pr-2">{game.title}</CardTitle>
        <div className="flex gap-2 shrink-0">
          {game.metacritic && (
            <div className="text-xs font-medium text-green-600 dark:text-green-500 border border-green-200 dark:border-green-900/50 px-2 py-0.5 rounded flex items-center justify-center">
              MC {game.metacritic}
            </div>
          )}
          <div className="text-sm font-medium text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 px-2 py-0.5 rounded">
            {game.rating}/10
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 px-5 pb-5">
        <div className="flex flex-col gap-1.5 text-xs font-light mt-2">
          <p className="flex justify-between border-b border-zinc-50 dark:border-zinc-800/50 pb-1.5"><span className="text-zinc-400">Gênero</span> <span className="text-zinc-700 dark:text-zinc-300">{game.genre}</span></p>
          <p className="flex justify-between border-b border-zinc-50 dark:border-zinc-800/50 pb-1.5"><span className="text-zinc-400">Status</span> <span className="text-zinc-700 dark:text-zinc-300">{game.status}</span></p>
          {game.platform && <p className="flex justify-between border-b border-zinc-50 dark:border-zinc-800/50 pb-1.5"><span className="text-zinc-400">Plataforma</span> <span className="text-zinc-700 dark:text-zinc-300">{game.platform}</span></p>}
          {(game.timePlayed !== undefined && game.timePlayed !== null) && <p className="flex justify-between"><span className="text-zinc-400">Tempo</span> <span className="text-zinc-700 dark:text-zinc-300">{game.timePlayed}h</span></p>}
        </div>
        <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800/50">
          <Button variant="outline" size="sm" onClick={onEdit} className="bg-transparent border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 text-zinc-600 dark:text-zinc-300 font-light text-xs h-7">
            Editar
          </Button>
          <Button variant="ghost" size="sm" onClick={onDelete} className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 font-light text-xs h-7">
            Remover
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
