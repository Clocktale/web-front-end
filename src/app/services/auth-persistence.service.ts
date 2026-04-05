import { Injectable } from '@angular/core';
import type { AuthSession } from '../types/auth-session.type';
import type { User } from '../types/user.type';

const STORAGE_KEY = 'clocktale_auth';

interface PersistedPayload {
  token: string;
  expiresAt: string;
  user: User;
}

/**
 * Persistência da sessão (localStorage se "lembrar", senão sessionStorage).
 * Mantém cache em memória do token para o interceptor HTTP (sem HttpClient).
 */
@Injectable({ providedIn: 'root' })
export class AuthPersistenceService {
  private tokenCache: string | null = null;

  getAccessToken(): string | null {
    return this.tokenCache;
  }

  saveSession(session: AuthSession, rememberMe: boolean): void {
    const payload: PersistedPayload = {
      token: session.token,
      expiresAt: session.expiresAt,
      user: session.user,
    };
    const json = JSON.stringify(payload);
    if (rememberMe) {
      localStorage.setItem(STORAGE_KEY, json);
      sessionStorage.removeItem(STORAGE_KEY);
    } else {
      sessionStorage.setItem(STORAGE_KEY, json);
      localStorage.removeItem(STORAGE_KEY);
    }
    this.tokenCache = session.token;
  }

  /** Carrega sessão persistida; remove se o token estiver expirado. */
  loadSession(): AuthSession | null {
    const json =
      localStorage.getItem(STORAGE_KEY) ??
      sessionStorage.getItem(STORAGE_KEY);
    if (!json) {
      this.tokenCache = null;
      return null;
    }
    try {
      const payload = JSON.parse(json) as PersistedPayload;
      if (this.isExpired(payload.expiresAt)) {
        this.clear();
        return null;
      }
      this.tokenCache = payload.token;
      return {
        token: payload.token,
        expiresAt: payload.expiresAt,
        user: payload.user,
      };
    } catch {
      this.clear();
      return null;
    }
  }

  clear(): void {
    localStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(STORAGE_KEY);
    this.tokenCache = null;
  }

  private isExpired(expiresAtIso: string): boolean {
    const expireTimestamp = Date.parse(expiresAtIso);
    if (Number.isNaN(expireTimestamp)) {
      return true;
    }
    return expireTimestamp <= Date.now();
  }
}
