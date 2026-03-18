import {
  Component,
  input,
  output,
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
      [disabled]="disabled()"
      [attr.aria-label]="ariaLabel()"
      [attr.aria-disabled]="disabled()"
      class="ds-button ds-button--{{ variant() }}"
      [class.ds-button--full]="fullWidth()"
      (click)="clicked.emit()"
    >
      <span class="ds-button__leading"
        ><ng-content select="[leading]" /></span
      >
      <span class="ds-button__content"><ng-content /></span>
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
  fullWidth = input(false);
  ariaLabel = input<string | undefined>(undefined);

  clicked = output<void>();
}
