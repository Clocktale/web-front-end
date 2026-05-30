import type { PaginatedResult } from './paginated-result.type';

export interface AnimeGenre {
  id: number;
  name: string;
  imageUrl: string;
}

export type AnimeGenrePaginatedResult = PaginatedResult<AnimeGenre>;

export interface AnimeGenreListQuery {
  page?: number;
  pageSize?: number;
  name?: string;
}

export type AnimeGenreCreateInput = Omit<AnimeGenre, 'id'>;
