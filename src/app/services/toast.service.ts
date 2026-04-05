import { Injectable, inject, signal, effect } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { UiEventsService } from './ui-events.service';

const TOAST_DURATION_MS = 3500;

/**
 * Toasts globais; reage a `UiEventsService` (ex.: mensagem após login).
 */
@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly transloco = inject(TranslocoService);
  private readonly uiEvents = inject(UiEventsService);

  /** Texto visível ou `null` quando não há toast. */
  readonly message = signal<string | null>(null);

  private hideTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    effect(() => {
      const tick = this.uiEvents.loginSuccessTick();
      if (tick <= 0) {
        return;
      }
      this.showTranslated('auth.login.successToast');
    });
  }

  showTranslated(key: string): void {
    this.clearTimer();
    this.message.set(this.transloco.translate(key));
    this.hideTimer = setTimeout(() => {
      this.message.set(null);
      this.hideTimer = null;
    }, TOAST_DURATION_MS);
  }

  dismiss(): void {
    this.clearTimer();
    this.message.set(null);
  }

  private clearTimer(): void {
    if (this.hideTimer !== null) {
      clearTimeout(this.hideTimer);
      this.hideTimer = null;
    }
  }
}
