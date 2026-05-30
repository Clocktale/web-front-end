import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

export interface SegmentedOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-segmented-button',
  standalone: true,
  template: `
    <div class="segmented-btn" role="group">
      @for (option of options(); track option.value) {
        <button
          type="button"
          class="segmented-btn__item"
          [class.segmented-btn__item--active]="option.value === value()"
          (click)="select(option.value)"
          [attr.aria-pressed]="option.value === value()"
        >
          {{ option.label }}
        </button>
      }
    </div>
  `,
  styleUrl: './segmented-button.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SegmentedButtonComponent {
  options = input.required<SegmentedOption[]>();
  value = input.required<string>();
  valueChange = output<string>();

  select(val: string): void {
    this.valueChange.emit(val);
  }
}
