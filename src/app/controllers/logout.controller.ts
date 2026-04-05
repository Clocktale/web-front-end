import { Injectable, inject, signal } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { finalize } from 'rxjs/operators';

import { AuthSessionController } from './auth-session.controller';
import { ToastService } from '../services/toast.service';
import { LogoutUseCase } from '../use-cases/auth/logout.use-case';
import { resolveUserFacingErrorMessage } from '../utils/http';

@Injectable({ providedIn: 'root' })
export class LogoutController {
  private readonly logoutUseCase = inject(LogoutUseCase);
  private readonly authSession = inject(AuthSessionController);
  private readonly toastService = inject(ToastService);
  private readonly transloco = inject(TranslocoService);

  /** True enquanto o pedido POST /auth/logout está em curso (modal de loading). */
  readonly loading = signal(false);

  logout(): void {
    if (this.loading()) {
      return;
    }

    this.loading.set(true);
    this.logoutUseCase
      .execute()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => {
          this.authSession.logout();
          this.toastService.showTranslated('auth.logout.successToast', 'success');
        },
        error: (err: unknown) => {
          this.authSession.logout();
          this.toastService.show({
            message: resolveUserFacingErrorMessage(
              err,
              key => this.transloco.translate(key),
              'auth.logout.apiError'
            ),
            variant: 'error',
          });
        },
      });
  }
}
