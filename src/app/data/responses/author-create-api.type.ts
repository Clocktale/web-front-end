/** Corpo de POST /admin/authors. */
export interface ApiAuthorCreateRequestBody {
  name: string;
}

/** `data` da resposta de criação de autor. */
export interface ApiAuthorCreateData {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

/** Resposta de POST /admin/authors (sucesso). */
export interface ApiAuthorCreateResponse {
  success: boolean;
  message: string;
  data: ApiAuthorCreateData;
}
