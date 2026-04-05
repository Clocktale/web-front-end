import { Injectable, inject, signal, effect } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import type { ToastVariant } from '../ui/design_system/molecules';
import { UiEventsService } from './ui-events.service';

const TOAST_DURATION_MS = 3500;

export type ActiveToast = { message: string; variant: ToastVariant };

/**
 * Toasts globais; reage a `UiEventsService` (ex.: mensagem após login).
 */
@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly transloco = inject(TranslocoService);
  private readonly uiEvents = inject(UiEventsService);

  /** Conteúdo visível ou `null` quando não há toast. Variante e mensagem são sempre definidas juntas. */
  readonly toastState = signal<ActiveToast | null>(null);

  private hideTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    effect(() => {
      const tick = this.uiEvents.loginSuccessTick();
      if (tick <= 0) {
        return;
      }
      this.showTranslated('auth.login.successToast', 'success');
    });
  }

  /** Mostra uma mensagem já traduzida. */
  show(options: { message: string; variant: ToastVariant }): void {
    this.clearTimer();
    this.toastState.set({ message: options.message, variant: options.variant });
    this.hideTimer = setTimeout(() => {
      this.toastState.set(null);
      this.hideTimer = null;
    }, TOAST_DURATION_MS);
  }

  showTranslated(key: string, variant: ToastVariant): void {
    this.show({
      message: this.transloco.translate(key),
      variant,
    });
  }

  dismiss(): void {
    this.clearTimer();
    this.toastState.set(null);
  }

  private clearTimer(): void {
    if (this.hideTimer !== null) {
      clearTimeout(this.hideTimer);
      this.hideTimer = null;
    }
  }
}
