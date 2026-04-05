import { Component, inject } from '@angular/core';
import { ToastService } from '../../services/toast.service';
import { ToastComponent } from '../design_system/molecules';

@Component({
  selector: 'app-toast-host',
  standalone: true,
  imports: [ToastComponent],
  template: `
    @if (toastService.toastState(); as t) {
      <div class="toast-host">
        <app-toast
          [variant]="t.variant"
          [message]="t.message"
          (closed)="toastService.dismiss()"
        />
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
      width: min(90vw, 600px);
      max-width: 600px;
      box-shadow: 0 var(--space-8) var(--space-24) var(--color-white-muted-10);
    }
  `,
})
export class ToastHostComponent {
  readonly toastService = inject(ToastService);
}
