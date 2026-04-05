import { Injectable, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { TranslocoService } from '@jsverse/transloco';
import { resolveLoginErrorMessage } from '../utils/http';
import { AuthSessionController } from './auth-session.controller';
import { LoginUseCase } from '../use-cases/auth/login.use-case';
import { UiEventsService } from '../services/ui-events.service';

/**
 * Estado e ações do fluxo de login (formulário, lembrar-me, convidado).
 * Sucesso: persiste sessão, emite toast e navega para Explorar; aceder a /login
 * com sessão válida é tratado por `redirectIfAuthenticatedGuard`.
 */
@Injectable({ providedIn: 'root' })
export class LoginController {
  private readonly router = inject(Router);
  private readonly transloco = inject(TranslocoService);
  private readonly loginUseCase = inject(LoginUseCase);
  private readonly authSession = inject(AuthSessionController);
  private readonly uiEvents = inject(UiEventsService);

  email = signal('');
  password = signal('');
  rememberMe = signal(false);
  passwordVisible = signal(false);
  loading = signal(false);
  error = signal<string | null>(null);

  passwordFieldType = computed<'text' | 'password'>(() =>
    this.passwordVisible() ? 'text' : 'password'
  );

  togglePasswordVisibility(): void {
    if (this.loading()) {
      return;
    }
    this.passwordVisible.update(v => !v);
  }

  setEmail(value: string): void {
    if (this.loading()) {
      return;
    }
    this.email.set(value);
    this.error.set(null);
  }

  setPassword(value: string): void {
    if (this.loading()) {
      return;
    }
    this.password.set(value);
    this.error.set(null);
  }

  setRememberMe(checked: boolean): void {
    if (this.loading()) {
      return;
    }
    this.rememberMe.set(checked);
  }

  navigateToSignUp(): void {
    if (this.loading()) {
      return;
    }
    this.router.navigate(['/signup']);
  }

  continueAsGuest(): void {
    if (this.loading()) {
      return;
    }
    this.router.navigate(['/explore']);
  }

  login(): void {
    if (this.loading()) {
      return;
    }

    const email = this.email().trim();
    const password = this.password();

    if (!email || !password) {
      this.error.set(
        this.transloco.translate('auth.login.validationRequired')
      );
      return;
    }

    this.error.set(null);
    this.loading.set(true);

    this.loginUseCase.execute({ email, password }).subscribe({
      next: session => {
        this.authSession.setSession(session, this.rememberMe());
        this.loading.set(false);
        this.uiEvents.emitLoginSuccess();
        void this.router.navigate(['/explore']);
      },
      error: (err: unknown) => {
        this.loading.set(false);
        this.error.set(
          resolveLoginErrorMessage(
            err,
            key => this.transloco.translate(key),
            'auth.login.loginFailed'
          )
        );
      },
    });
  }
}
