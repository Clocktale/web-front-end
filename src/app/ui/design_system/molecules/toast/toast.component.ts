import {
  Component,
  input,
  output,
  ChangeDetectionStrategy,
  computed,
} from '@angular/core';
import { ToastVariant } from './toast-variant';

@Component({
  selector: 'app-toast',
  standalone: true,
  host: {
    '[class.ds-toast--warning]': 'variant() === "warning"',
    '[class.ds-toast--error]': 'variant() === "error"',
    '[class.ds-toast--success]': 'variant() === "success"',
    '[class.ds-toast--info]': 'variant() === "info"',
  },
  template: `
    <div
      class="ds-toast"
      [attr.role]="ariaRole()"
      [attr.aria-live]="ariaLive()"
    >
      <div class="ds-toast__icon-cell" aria-hidden="true">
        @switch (variant()) {
          @case ('warning') {
            <svg
              class="ds-toast__icon"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 3.5L20.5 19.5H3.5L12 3.5Z"
                stroke="currentColor"
                stroke-width="1.75"
                stroke-linejoin="round"
              />
              <path
                d="M12 9.5V13.25"
                class="ds-toast__warn-mark"
                stroke-width="1.75"
                stroke-linecap="round"
              />
              <circle cx="12" cy="16.25" r="0.9" class="ds-toast__warn-mark-fill" />
            </svg>
          }
          @case ('error') {
            <svg
              class="ds-toast__icon"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="12"
                cy="12"
                r="8.25"
                stroke="currentColor"
                stroke-width="1.75"
              />
              <path
                d="M9 9L15 15M15 9L9 15"
                stroke="currentColor"
                stroke-width="1.75"
                stroke-linecap="round"
              />
            </svg>
          }
          @case ('success') {
            <svg
              class="ds-toast__icon"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="12"
                cy="12"
                r="8.25"
                stroke="currentColor"
                stroke-width="1.75"
              />
              <path
                d="M8 12L11 15L16 9"
                stroke="var(--color-white)"
                stroke-width="1.75"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          }
          @case ('info') {
            <svg
              class="ds-toast__icon"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="12"
                cy="12"
                r="8.25"
                stroke="currentColor"
                stroke-width="1.75"
              />
              <path
                d="M12 10V16"
                stroke="var(--color-white)"
                stroke-width="1.75"
                stroke-linecap="round"
              />
              <circle cx="12" cy="7.5" r="0.9" fill="var(--color-white)" />
            </svg>
          }
        }
      </div>
      <div class="ds-toast__body">
        <p class="ds-toast__message">{{ message() }}</p>
      </div>
      <div class="ds-toast__close-slot">
        <button
          type="button"
          class="ds-toast__close"
          [attr.aria-label]="closeAriaLabel()"
          (click)="closed.emit()"
        >
          <svg
            class="ds-toast__close-icon"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M8 8L16 16M16 8L8 16"
              stroke="currentColor"
              stroke-width="1.75"
              stroke-linecap="round"
            />
          </svg>
        </button>
      </div>
    </div>
  `,
  styleUrl: './toast.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastComponent {
  variant = input.required<ToastVariant>();
  message = input.required<string>();
  /** Rótulo acessível do botão de fechar (ex.: tradução de "Fechar"). */
  closeAriaLabel = input<string>('Fechar');

  closed = output<void>();

  ariaRole = computed(() =>
    this.variant() === 'error' || this.variant() === 'warning'
      ? 'alert'
      : 'status',
  );

  ariaLive = computed(() =>
    this.variant() === 'error' || this.variant() === 'warning'
      ? 'assertive'
      : 'polite',
  );
}
