import type { User } from './user.type';

/** Sessão após login bem-sucedido (token + utilizador + expiração). */
export interface AuthSession {
  user: User;
  token: string;
  expiresAt: Date;
}
