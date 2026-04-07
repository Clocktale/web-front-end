import { Injectable, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { TranslocoService } from '@jsverse/transloco';
import {
  validatePasswordSignupRulesUseCase,
  allPasswordSignupRulesPass,
} from '../use-cases/auth/password/validate-password-signup-rules.use-case';
import { RegisterAccountUseCase } from '../use-cases/auth/register-account.use-case';
import { isFieldValidationError } from '../errors';
import { resolveUserFacingErrorMessage } from '../utils/error-handling/resolve-user-facing-error';
import { isValidEmail } from '../utils/validation/is-valid-email';
import { ToastService } from '../services/toast.service';

type RegisterField = 'username' | 'nickname' | 'email' | 'password';

@Injectable({ providedIn: 'root' })
export class RegisterController {
  private readonly router = inject(Router);
  private readonly transloco = inject(TranslocoService);
  private readonly registerUseCase = inject(RegisterAccountUseCase);
  private readonly toastService = inject(ToastService);

  username = signal('');
  nickname = signal('');
  email = signal('');
  password = signal('');
  passwordVisible = signal(false);
  loading = signal(false);

  usernameBlurred = signal(false);
  nicknameBlurred = signal(false);
  emailBlurred = signal(false);
  passwordBlurred = signal(false);

  /** Erros devolvidos pela API (422) por campo. */
  private readonly serverFieldErrors = signal<
    Partial<Record<RegisterField, string>>
  >({});

  /** Erro genérico (rede, 5xx, 4xx sem mapa de campos); mostrado no campo senha. */
  private readonly generalError = signal<string | null>(null);

  passwordFieldType = computed<'text' | 'password'>(() =>
    this.passwordVisible() ? 'text' : 'password'
  );

  passwordRules = computed(() =>
    validatePasswordSignupRulesUseCase(this.password())
  );

  private readonly usernameTrimmed = computed(() => this.username().trim());
  private readonly nicknameTrimmed = computed(() => this.nickname().trim());
  private readonly emailTrimmed = computed(() => this.email().trim());

  private usernameValid = computed(
    () => this.usernameTrimmed().length >= 3
  );
  private nicknameValid = computed(
    () => this.nicknameTrimmed().length >= 3
  );
  private emailValid = computed(() =>
    isValidEmail(this.emailTrimmed())
  );
  private passwordValid = computed(() =>
    allPasswordSignupRulesPass(this.passwordRules())
  );

  canSubmit = computed(() => {
    if (this.loading()) {
      return false;
    }
    return (
      this.usernameValid() &&
      this.nicknameValid() &&
      this.emailValid() &&
      this.passwordValid()
    );
  });

  usernameError = computed(() => {
    const server = this.serverFieldErrors()['username'];
    if (server) {
      return server;
    }
    if (!this.usernameBlurred()) {
      return null;
    }
    if (!this.usernameValid()) {
      return this.transloco.translate('auth.register.validationUsernameMin');
    }
    return null;
  });

  nicknameError = computed(() => {
    const server = this.serverFieldErrors()['nickname'];
    if (server) {
      return server;
    }
    if (!this.nicknameBlurred()) {
      return null;
    }
    if (!this.nicknameValid()) {
      return this.transloco.translate('auth.register.validationNicknameMin');
    }
    return null;
  });

  emailError = computed(() => {
    const server = this.serverFieldErrors()['email'];
    if (server) {
      return server;
    }
    if (!this.emailBlurred()) {
      return null;
    }
    if (!this.emailValid()) {
      return this.transloco.translate('auth.register.validationEmailInvalid');
    }
    return null;
  });

  passwordError = computed(() => {
    const server = this.serverFieldErrors()['password'];
    if (server) {
      return server;
    }
    if (this.generalError()) {
      return this.generalError();
    }
    if (!this.passwordBlurred()) {
      return null;
    }
    if (!this.passwordValid()) {
      return this.transloco.translate('auth.register.validationPasswordRules');
    }
    return null;
  });

  togglePasswordVisibility(): void {
    if (this.loading()) {
      return;
    }
    this.passwordVisible.update(v => !v);
  }

  onUsernameBlur(): void {
    if (this.loading()) {
      return;
    }
    this.usernameBlurred.set(true);
  }

  onNicknameBlur(): void {
    if (this.loading()) {
      return;
    }
    this.nicknameBlurred.set(true);
  }

  onEmailBlur(): void {
    if (this.loading()) {
      return;
    }
    this.emailBlurred.set(true);
  }

  onPasswordBlur(): void {
    if (this.loading()) {
      return;
    }
    this.passwordBlurred.set(true);
  }

  setUsername(value: string): void {
    if (this.loading()) {
      return;
    }
    this.username.set(value);
    this.clearServerField('username');
    this.generalError.set(null);
  }

  setNickname(value: string): void {
    if (this.loading()) {
      return;
    }
    this.nickname.set(value);
    this.clearServerField('nickname');
    this.generalError.set(null);
  }

  setEmail(value: string): void {
    if (this.loading()) {
      return;
    }
    this.email.set(value);
    this.clearServerField('email');
    this.generalError.set(null);
  }

  setPassword(value: string): void {
    if (this.loading()) {
      return;
    }
    this.password.set(value);
    this.clearServerField('password');
    this.generalError.set(null);
  }

  navigateToLogin(): void {
    if (this.loading()) {
      return;
    }
    void this.router.navigate(['/login']);
  }

  register(): void {
    if (this.loading() || !this.canSubmit()) {
      return;
    }

    this.usernameBlurred.set(true);
    this.nicknameBlurred.set(true);
    this.emailBlurred.set(true);
    this.passwordBlurred.set(true);
    this.serverFieldErrors.set({});
    this.generalError.set(null);

    this.loading.set(true);

    this.registerUseCase
      .execute({
        username: this.usernameTrimmed(),
        nickname: this.nicknameTrimmed(),
        email: this.emailTrimmed(),
        password: this.password(),
      })
      .subscribe({
        next: () => {
          this.loading.set(false);
          this.toastService.showTranslated(
            'auth.register.successToast',
            'success'
          );
          void this.router.navigate(['/login']);
        },
        error: (err: unknown) => {
          this.loading.set(false);
          if (isFieldValidationError(err)) {
            this.applyLaravelFieldErrors(err.fieldErrors);
            return;
          }
          this.generalError.set(
            resolveUserFacingErrorMessage(
              err,
              key => this.transloco.translate(key),
              'auth.register.registerFailed'
            )
          );
        },
      });
  }

  private applyLaravelFieldErrors(
    fieldErrors: Record<string, string>
  ): void {
    const next: Partial<Record<RegisterField, string>> = {};
    const keys: RegisterField[] = [
      'username',
      'nickname',
      'email',
      'password',
    ];
    for (const k of keys) {
      const msg = fieldErrors[k];
      if (typeof msg === 'string' && msg.trim()) {
        next[k] = msg.trim();
      }
    }
    this.serverFieldErrors.set(next);
  }

  private clearServerField(field: RegisterField): void {
    this.serverFieldErrors.update(prev => {
      if (!(field in prev)) {
        return prev;
      }
      const copy = { ...prev };
      delete copy[field];
      return copy;
    });
  }
}
