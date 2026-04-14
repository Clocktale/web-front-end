import type { ApiLaravelPaginated } from './api-laravel-paginated.type';

export interface ApiStreamingListItem {
  id: number;
  name: string;
  url: string;
  logo_url: string;
  created_at: string | null;
  updated_at: string | null;
  deleted_at: string | null;
}

export interface ApiStreamingListResponse {
  success: boolean;
  message: string;
  data: ApiLaravelPaginated<ApiStreamingListItem>;
}
