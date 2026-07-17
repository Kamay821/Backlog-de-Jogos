import axios from "axios";
import type { Game, ExternalGameResult } from "./game";

const API_BASE_URL = "http://localhost:3000";

const api = axios.create({
  baseURL: API_BASE_URL,
});

export function setAuthToken(token: string | null) {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
}

export async function getGames(): Promise<Game[]> {
  const response = await api.get<Game[]>("/Games");
  return response.data;
}

export async function createGame(game: Omit<Game, "id">): Promise<Game> {
  const response = await api.post<Game>("/Games", game);
  return response.data;
}

export async function updateGame(id: string, game: Omit<Game, "id">): Promise<Game> {
  const response = await api.put<Game>(`/Games/${encodeURIComponent(id)}`, game);
  return response.data;
}

export async function deleteGame(id: string): Promise<{ message: string }> {
  const response = await api.delete<{ message: string }>(
    `/Games/${encodeURIComponent(id)}`
  );
  return response.data;
}

export async function searchGames(filters: {
  title?: string;
  genre?: string;
  status?: Game["status"];
}): Promise<Game[]> {
  const params = new URLSearchParams();
  if (filters.title) params.append("title", filters.title);
  if (filters.genre) params.append("genre", filters.genre);
  if (filters.status) params.append("status", filters.status);

  const response = await api.get<Game[]>(`/Games/search?${params.toString()}`);
  return response.data;
}

export async function searchExternalGames(query: string): Promise<ExternalGameResult[]> {
  const response = await api.get<ExternalGameResult[]>(`/Games/rawg-search?q=${encodeURIComponent(query)}`);
  return response.data;
}

// User Auth APIs
export async function loginUser(data: any): Promise<any> {
  const response = await axios.post(`${API_BASE_URL}/users/login`, data);
  return response.data;
}

export async function registerUser(data: any): Promise<any> {
  const response = await axios.post(`${API_BASE_URL}/users/register`, data);
  return response.data;
}
