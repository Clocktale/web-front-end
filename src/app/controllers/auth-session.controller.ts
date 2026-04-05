import { Injectable, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import type { AuthSession } from '../types/auth-session.type';
import type { User } from '../types/user.type';
import { AuthPersistenceService } from '../services/auth-persistence.service';

@Injectable({ providedIn: 'root' })
export class AuthSessionController {
  private readonly persistence = inject(AuthPersistenceService);
  private readonly router = inject(Router);

  user = signal<User | null>(null);
  token = signal<string | null>(null);
  expiresAt = signal<string | null>(null);

  isAuthenticated = computed(() => {
    const t = this.token();
    const exp = this.expiresAt();
    if (!t || !exp) {
      return false;
    }
    return !this.isExpired(exp);
  });

  /** Restaura estado a partir do storage (arranque da app ou após refresh). */
  hydrateFromStorage(): void {
    const session = this.persistence.loadSession();
    if (!session) {
      this.clearSignals();
      return;
    }
    this.applySession(session);
  }

  setSession(session: AuthSession, rememberMe: boolean): void {
    this.persistence.saveSession(session, rememberMe);
    this.applySession(session);
  }

  logout(options?: { navigateToLogin?: boolean }): void {
    this.persistence.clear();
    this.clearSignals();
    if (options?.navigateToLogin !== false) {
      this.router.navigate(['/login']);
    }
  }

  private applySession(session: AuthSession): void {
    this.user.set(session.user);
    this.token.set(session.token);
    this.expiresAt.set(session.expiresAt);
  }

  private clearSignals(): void {
    this.user.set(null);
    this.token.set(null);
    this.expiresAt.set(null);
  }

  private isExpired(expiresAtIso: string): boolean {
    const t = Date.parse(expiresAtIso);
    if (Number.isNaN(t)) {
      return true;
    }
    return t <= Date.now();
  }
}
