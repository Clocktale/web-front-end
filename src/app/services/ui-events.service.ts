import { Injectable, signal } from '@angular/core';

/**
 * Eventos de UI desacoplados das controllers (ex.: login bem-sucedido → toast).
 */
@Injectable({ providedIn: 'root' })
export class UiEventsService {
  /** Incrementa a cada login bem-sucedido; consumidores usam em `effect`. */
  readonly loginSuccessTick = signal(0);

  emitLoginSuccess(): void {
    this.loginSuccessTick.update(n => n + 1);
  }
}
