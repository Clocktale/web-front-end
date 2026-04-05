import { Component, inject } from '@angular/core';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast-host',
  standalone: true,
  template: `
    @if (toast.message(); as text) {
      <div class="toast-host" role="status" aria-live="polite">
        {{ text }}
      </div>
    }
  `,
  styles: `
    .toast-host {
      position: fixed;
      bottom: var(--space-24);
      left: 50%;
      transform: translateX(-50%);
      z-index: 9999;
      max-width: min(90vw, 24rem);
      padding: var(--space-12) var(--space-20);
      border-radius: var(--radius-12);
      background-color: var(--color-surface-modal);
      color: var(--color-text-primary);
      font-size: var(--font-size-14);
      line-height: 1.4;
      box-shadow: 0 var(--space-8) var(--space-24) var(--color-white-muted-10);
      pointer-events: none;
    }
  `,
})
export class ToastHostComponent {
  readonly toast = inject(ToastService);
}
