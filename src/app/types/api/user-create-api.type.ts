/** `data` da resposta de POST /users (sucesso). Alinhado a ApiAuthUser. */
export interface ApiUserCreateData {
  id: number;
  profile_picture: string;
  nickname: string;
  username: string;
  email: string;
  created_at: string;
  updated_at: string;
}

/** Corpo completo da resposta de criação de utilizador. */
export interface ApiUserCreateResponse {
  success: boolean;
  message: string;
  data: ApiUserCreateData;
}
