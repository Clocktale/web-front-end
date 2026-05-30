import type { PaginatedResult } from './paginated-result.type';

export interface Studio {
  id: number;
  name: string;
}

export type StudioPaginatedResult = PaginatedResult<Studio>;

export interface StudioListQuery {
  page?: number;
  pageSize?: number;
  name?: string;
}

export type StudioCreateInput = Omit<Studio, 'id'>;
