import { Injectable, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { TranslocoService } from '@jsverse/transloco';
import {
  RegisterAccountFailureReason,
  registerAccountUseCase,
} from '../use-cases/auth/register-account.use-case';
import {
  validatePasswordSignupRulesUseCase,
  allPasswordSignupRulesPass,
} from '../use-cases/auth/password/validate-password-signup-rules.use-case';

@Injectable({ providedIn: 'root' })
export class RegisterController {
  private readonly router = inject(Router);
  private readonly transloco = inject(TranslocoService);

  username = signal('');
  nickname = signal('');
  email = signal('');
  password = signal('');
  passwordVisible = signal(false);
  loading = signal(false);
  error = signal<string | null>(null);

  passwordFieldType = computed<'text' | 'password'>(() =>
    this.passwordVisible() ? 'text' : 'password'
  );

  passwordRules = computed(() =>
    validatePasswordSignupRulesUseCase(this.password())
  );

  canSubmit = computed(() => {
    const u = this.username().trim();
    const n = this.nickname().trim();
    const e = this.email().trim();
    const p = this.password();
    if (!u || !n || !e || !p) {
      return false;
    }
    return allPasswordSignupRulesPass(this.passwordRules());
  });

  togglePasswordVisibility(): void {
    if (this.loading()) {
      return;
    }
    this.passwordVisible.update(v => !v);
  }

  setUsername(value: string): void {
    if (this.loading()) {
      return;
    }
    this.username.set(value);
    this.error.set(null);
  }

  setNickname(value: string): void {
    if (this.loading()) {
      return;
    }
    this.nickname.set(value);
    this.error.set(null);
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

  navigateToLogin(): void {
    if (this.loading()) {
      return;
    }
    this.router.navigate(['/login']);
  }

  register(): void {
    if (this.loading()) {
      return;
    }

    const result = registerAccountUseCase({
      username: this.username(),
      nickname: this.nickname(),
      email: this.email(),
      password: this.password(),
    });

    if (!result.ok) {
      this.showError(result.reason);
      return;
    }

    this.error.set(null);
    this.loading.set(true);

    // TODO: quando existir chamada HTTP, mover loading/error para a subscrição
    this.loading.set(false);
  }

  private showError(reason: RegisterAccountFailureReason): void {
    switch (reason) {
      case 'EMPTY_FIELDS':
        this.error.set(
          this.transloco.translate('auth.register.validationRequired')
        );
        break;
      case 'INVALID_PASSWORD':
        this.error.set(
          this.transloco.translate('auth.register.validationPasswordRules')
        );
        break;
      default:
        this.error.set(
          this.transloco.translate('auth.register.validationRequired')
        );
        break;
    }
  }
}
