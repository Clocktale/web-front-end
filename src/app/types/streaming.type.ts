import type { PaginatedResult } from './paginated-result.type';

export interface Streaming {
  id: number;
  name: string;
  url: string;
  logo_url: string;
}

export type StreamingPaginatedResult = PaginatedResult<Streaming>;

export interface StreamingListQuery {
  page?: number;
  pageSize?: number;
  name?: string;
}
