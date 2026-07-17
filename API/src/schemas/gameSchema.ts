import { z } from 'zod';

export const gameStatus = z.enum(['Jogando', 'Zerado', 'Dropado', 'Planejado']);

export const bodySchema = z.object({
  title: z.string(),
  genre: z.string(),
  status: gameStatus,
  rating: z.number().min(0).max(10),
  coverUrl: z.string().optional(),
  metacritic: z.number().optional(),
  platform: z.string().optional(),
  timePlayed: z.number().optional(),
});

export const gameSchema = z.object({
  id: z.string(),
  title: z.string(),
  genre: z.string(),
  status: gameStatus,
  rating: z.number(),
  coverUrl: z.string().nullable().optional(),
  metacritic: z.number().nullable().optional(),
  platform: z.string().nullable().optional(),
  timePlayed: z.number().nullable().optional(),
});

export const idParamSchema = z.object({
  id: z.string().uuid(),
});

export const searchQuerySchema = z.object({
  title: z.string().optional(),
  status: gameStatus.optional(),
  genre: z.string().optional(),
});

export const rawgSearchQuerySchema = z.object({
  q: z.string().min(1),
});
