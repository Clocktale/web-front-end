import type { ApiLaravelPaginated } from './api-laravel-paginated.type';

/** Item em GET /authors (lista). */
export interface ApiAuthorListItem {
  id: number;
  name: string;
  created_at: string | null;
  updated_at: string | null;
  deleted_at: string | null;
}

/** Corpo completo da resposta GET /authors (envelope da API). */
export interface ApiAuthorListResponse {
  success: boolean;
  message: string;
  data: ApiLaravelPaginated<ApiAuthorListItem>;
}
