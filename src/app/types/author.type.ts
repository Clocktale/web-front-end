import type { PaginatedResult } from './paginated-result.type';

export interface Author {
  id: number;
  name: string;
}

/** Resultado paginado de listagem ou pesquisa de autores. */
export type AuthorPaginatedResult = PaginatedResult<Author>;

/** Parâmetros de listagem: `name` opcional filtra no servidor. */
export interface AuthorListQuery {
  page?: number;
  pageSize?: number;
  name?: string;
}

export type AuthorCreateInput = Omit<Author, 'id'>;
