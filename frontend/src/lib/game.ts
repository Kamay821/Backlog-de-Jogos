export type Game = {
  id: string
  title: string
  genre: string
  status: 'Jogando' | 'Zerado' | 'Dropado' | 'Planejado'
  rating: number
  coverUrl?: string | null
  metacritic?: number | null
  platform?: string | null
  timePlayed?: number | null
}

export type ExternalGameResult = {
  title: string
  coverUrl: string | null
  genre: string
  metacritic: number | null
}
