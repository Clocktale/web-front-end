/** Utilizador no payload JSON da API (snake_case). */
export interface ApiAuthUser {
  id: number;
  profile_picture: string;
  nickname: string;
  username: string;
  email: string;
  created_at: string;
  updated_at: string;
}

/** `data` da resposta de POST /auth/login. */
export interface ApiAuthLoginData {
  user: ApiAuthUser;
  token: string;
  expire_at: string;
}

/** Corpo completo da resposta de login. */
export interface ApiAuthLoginResponse {
  success: boolean;
  message: string;
  data: ApiAuthLoginData;
}
