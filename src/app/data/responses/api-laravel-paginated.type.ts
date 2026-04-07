/**
 * Bloco `data` de uma resposta paginada estilo Laravel (LengthAwarePaginator).
 * O array de linhas fica em `data` (nome infelizmente colide com o envelope da API).
 */
export interface ApiLaravelPaginated<TItem> {
  current_page: number;
  data: TItem[];
  first_page_url: string;
  from: number | null;
  last_page: number;
  last_page_url: string;
  links: unknown[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number | null;
  total: number;
}
