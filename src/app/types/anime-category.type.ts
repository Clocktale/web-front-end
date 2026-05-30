import type { PaginatedResult } from './paginated-result.type';

export interface AnimeCategory {
  id: number;
  name: string;
  description: string;
}

export type AnimeCategoryPaginatedResult = PaginatedResult<AnimeCategory>;

export interface AnimeCategoryListQuery {
  page?: number;
  pageSize?: number;
  name?: string;
}

export type AnimeCategoryCreateInput = Omit<AnimeCategory, 'id'>;
