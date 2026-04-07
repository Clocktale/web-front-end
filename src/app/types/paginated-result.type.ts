/** Resultado paginado no domínio (após mapear resposta da API + envelope). */
export interface PaginatedResult<T> {
  items: T[];
  total: number;
  currentPage: number;
  lastPage: number;
  perPage: number;
  from: number | null;
  to: number | null;
}
