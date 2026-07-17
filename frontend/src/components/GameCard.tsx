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
    <Card className="bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-700 shadow-lg hover:scale-[1.02] transition overflow-hidden">
      {game.coverUrl && (
        <img
          src={game.coverUrl}
          alt={`${game.title} capa`}
          className="w-full h-48 object-cover"
        />
      )}
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-bold truncate pr-2">{game.title}</CardTitle>
        <div className="flex gap-2 shrink-0">
          {game.metacritic && (
            <div className="text-sm font-bold bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 px-2 py-1 rounded border border-green-300 dark:border-green-500/30 flex items-center justify-center">
              MC {game.metacritic}
            </div>
          )}
          <div className="text-xl font-extrabold text-primary bg-zinc-100 dark:bg-zinc-700 px-3 py-1 rounded border border-zinc-200 dark:border-zinc-600">
            {game.rating}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="grid grid-cols-2 gap-2 text-sm mt-2">
          <p><span className="font-semibold text-zinc-500 dark:text-zinc-400">Gênero:</span> {game.genre}</p>
          <p><span className="font-semibold text-zinc-500 dark:text-zinc-400">Status:</span> {game.status}</p>
          {game.platform && <p><span className="font-semibold text-zinc-500 dark:text-zinc-400">Plataforma:</span> {game.platform}</p>}
          {(game.timePlayed !== undefined && game.timePlayed !== null) && <p><span className="font-semibold text-zinc-500 dark:text-zinc-400">Tempo:</span> {game.timePlayed}h</p>}
        </div>
        <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-700">
          <Button variant="outline" size="sm" onClick={onEdit} className="bg-white dark:bg-zinc-700 border-zinc-300 dark:border-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-600 text-zinc-900 dark:text-white">
            Editar
          </Button>
          <Button variant="destructive" size="sm" onClick={onDelete}>
            Remover
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
