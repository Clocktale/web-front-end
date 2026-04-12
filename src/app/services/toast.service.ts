import { Injectable, inject, signal, effect, computed } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import type { ToastVariant } from '../ui/design_system/molecules';
import { UiEventsService } from './ui-events.service';

const TOAST_DURATION_MS = 3500;
/** Alinhar com `transition` de opacidade em `toast-host.component.ts`. */
const TOAST_EXIT_DURATION_MS = 220;

export type ActiveToast = { message: string; variant: ToastVariant };

type ToastInternal =
  | { phase: 'visible'; toast: ActiveToast }
  | { phase: 'exiting'; toast: ActiveToast };

/**
 * Toasts globais; reage a `UiEventsService` (ex.: mensagem após login).
 */
@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly transloco = inject(TranslocoService);
  private readonly uiEvents = inject(UiEventsService);

  private readonly toastInternal = signal<ToastInternal | null>(null);

  /** Conteúdo visível ou `null` quando não há toast. Variante e mensagem são sempre definidas juntas. */
  readonly toastState = computed(() => this.toastInternal()?.toast ?? null);

  /** `true` durante o fade-out antes do toast ser removido do DOM. */
  readonly toastExiting = computed(
    () => this.toastInternal()?.phase === 'exiting',
  );

  private hideTimer: ReturnType<typeof setTimeout> | null = null;
  private exitTimer: ReturnType<typeof setTimeout> | null = null;

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
    this.clearTimers();
    this.toastInternal.set({
      phase: 'visible',
      toast: { message: options.message, variant: options.variant },
    });
    this.hideTimer = setTimeout(() => {
      this.hideTimer = null;
      this.beginExit();
    }, TOAST_DURATION_MS);
  }

  showTranslated(key: string, variant: ToastVariant): void {
    this.show({
      message: this.transloco.translate(key),
      variant,
    });
  }

  dismiss(): void {
    if (this.toastInternal() === null) {
      return;
    }
    this.clearHideTimer();
    this.beginExit();
  }

  private beginExit(): void {
    const v = this.toastInternal();
    if (v === null || v.phase === 'exiting') {
      return;
    }

    if (this.prefersReducedMotionExit()) {
      this.toastInternal.set(null);
      return;
    }

    this.toastInternal.set({ phase: 'exiting', toast: v.toast });
    this.exitTimer = setTimeout(() => {
      this.exitTimer = null;
      this.toastInternal.set(null);
    }, TOAST_EXIT_DURATION_MS);
  }

  private prefersReducedMotionExit(): boolean {
    if (typeof globalThis === 'undefined' || !('matchMedia' in globalThis)) {
      return false;
    }
    return globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  private clearTimers(): void {
    this.clearHideTimer();
    if (this.exitTimer !== null) {
      clearTimeout(this.exitTimer);
      this.exitTimer = null;
    }
  }

  private clearHideTimer(): void {
    if (this.hideTimer !== null) {
      clearTimeout(this.hideTimer);
      this.hideTimer = null;
    }
  }
}
