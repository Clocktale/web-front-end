import { Component, inject } from '@angular/core';
import { ToastService } from '../../services/toast.service';
import { ToastComponent } from '../design_system/molecules';

@Component({
  selector: 'app-toast-host',
  standalone: true,
  imports: [ToastComponent],
  template: `
    @if (toastService.toastState(); as t) {
      <div
        class="toast-host"
        [class.toast-host--exiting]="toastService.toastExiting()"
      >
        <app-toast [variant]="t.variant" [message]="t.message" (closed)="toastService.dismiss()" />
      </div>
    }
  `,
  styles: `
    @keyframes toast-host-enter {
      from {
        transform: translateX(100%);
      }
      to {
        transform: translateX(0);
      }
    }

    .toast-host {
      position: fixed;
      bottom: var(--space-24);
      left: var(--space-24);
      right: auto;
      z-index: 9999;
      width: min(90vw, 600px);
      max-width: 600px;
      box-shadow: 0 var(--space-8) var(--space-24) var(--color-surface-modal-shadow);
      opacity: 1;
      transition: opacity 200ms ease-out;
      animation: toast-host-enter 320ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
    }

    .toast-host--exiting {
      opacity: 0;
      pointer-events: none;
    }

    @media (prefers-reduced-motion: reduce) {
      .toast-host {
        animation: none;
        opacity: 1;
        transform: none;
        transition: none;
      }

      .toast-host--exiting {
        opacity: 0;
      }
    }
  `,
})
export class ToastHostComponent {
  readonly toastService = inject(ToastService);
}
