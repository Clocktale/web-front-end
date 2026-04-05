export interface Author {
  id: number;
  name: string;
}

/** Resultado paginado de listagem ou pesquisa de autores. */
export interface AuthorPaginatedResult {
  authors: Author[];
  total: number;
}

export interface AuthorListQuery {
  page?: number;
  pageSize?: number;
}

export interface AuthorSearchQuery {
  query: string;
  page?: number;
  pageSize?: number;
}

export type AuthorCreateInput = Omit<Author, 'id'>;
