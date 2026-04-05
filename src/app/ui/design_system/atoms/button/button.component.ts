import {
  Component,
  input,
  output,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';
import { ButtonVariant } from './button-variant';

@Component({
  selector: 'app-button',
  standalone: true,
  host: {
    '[class.ds-button-wrapper--full]': 'fullWidth()',
  },
  template: `
    <button
      [type]="type()"
      [disabled]="isDisabled()"
      [attr.aria-label]="ariaLabel()"
      [attr.aria-busy]="loading()"
      [attr.aria-disabled]="isDisabled()"
      class="ds-button ds-button--{{ variant() }}"
      [class.ds-button--full]="fullWidth()"
      [class.ds-button--loading]="loading()"
      (click)="onClick()"
    >
      <span class="ds-button__leading"
        ><ng-content select="[leading]" /></span
      >
      <span class="ds-button__body">
        <span class="ds-button__spinner" aria-hidden="true"></span>
        <span class="ds-button__content"><ng-content /></span>
      </span>
      <span class="ds-button__trailing"
        ><ng-content select="[trailing]" /></span
      >
    </button>
  `,
  styleUrl: './button.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  variant = input<ButtonVariant>(ButtonVariant.Primary);
  type = input<'button' | 'submit' | 'reset'>('button');
  disabled = input(false);
  /** Mostra spinner e desativa o botão (todas as variantes). */
  loading = input(false);
  fullWidth = input(false);
  ariaLabel = input<string | undefined>(undefined);

  isDisabled = computed(() => this.disabled() || this.loading());

  clicked = output<void>();

  onClick(): void {
    if (this.isDisabled()) {
      return;
    }
    this.clicked.emit();
  }
}
