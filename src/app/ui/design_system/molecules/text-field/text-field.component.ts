import {
  Component,
  input,
  model,
  output,
  ChangeDetectionStrategy,
  computed,
} from '@angular/core';

@Component({
  selector: 'app-text-field',
  standalone: true,
  host: {
    '[class.ds-text-field--error]': 'hasError()',
  },
  template: `
    <div class="ds-text-field">
      @if (label()) {
        <label [for]="inputId()" class="ds-text-field__label">
          {{ label() }}
        </label>
      }
      <div class="ds-text-field__input-wrapper">
        <span class="ds-text-field__leading">
          <ng-content select="[leading]" />
        </span>
        <input
          [id]="inputId()"
          [type]="type()"
          [placeholder]="placeholder()"
          [disabled]="disabled()"
          [attr.aria-label]="ariaLabel() ?? label()"
          [attr.aria-invalid]="hasError()"
          [attr.aria-errormessage]="hasError() ? inputId() + '-error' : null"
          class="ds-text-field__input"
          [value]="value()"
          (input)="onInput($event)"
        />
        <span class="ds-text-field__trailing">
          <ng-content select="[trailing]" />
        </span>
      </div>
      @if (errorText()) {
        <span
          [id]="inputId() + '-error'"
          class="ds-text-field__error"
          role="alert"
        >
          {{ errorText() }}
        </span>
      }
    </div>
  `,
  styleUrl: './text-field.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextFieldComponent {
  label = input<string>('');
  placeholder = input<string>('');
  type = input<'text' | 'email' | 'password' | 'number'>('text');
  errorText = input<string | null>(null);
  disabled = input(false);
  ariaLabel = input<string | undefined>(undefined);

  value = model<string>('');

  valueChanged = output<string>();

  private static idCounter = 0;
  private readonly instanceId = `ds-text-field-${++TextFieldComponent.idCounter}`;

  inputId = computed(() => this.instanceId);

  hasError = computed(() => !!this.errorText());

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    const newValue = target?.value ?? '';
    this.value.set(newValue);
    this.valueChanged.emit(newValue);
  }
}
