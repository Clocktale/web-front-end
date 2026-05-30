import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { LucideAngularModule, Circle, CircleCheck } from 'lucide-angular';

@Component({
  selector: 'app-radio-tile',
  standalone: true,
  imports: [LucideAngularModule],
  template: `
    <button
      type="button"
      class="radio-tile"
      role="radio"
      [attr.aria-checked]="selected()"
      [attr.aria-label]="ariaLabel() ?? label()"
      [class.radio-tile--selected]="selected()"
      (click)="select.emit()"
    >
      <span class="radio-tile__indicator" aria-hidden="true">
        <lucide-angular [img]="CircleIcon" [size]="20" class="radio-tile__circle" />
      </span>
      <span class="radio-tile__label">{{ label() }}</span>
      @if (selected()) {
        <span class="radio-tile__check" aria-hidden="true">
          <lucide-angular [img]="CheckIcon" [size]="20" class="radio-tile__check-icon" />
        </span>
      }
    </button>
  `,
  styleUrl: './radio-tile.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RadioTileComponent {
  label = input.required<string>();
  ariaLabel = input<string | null>(null);
  selected = input(false);

  select = output<void>();

  protected readonly CircleIcon = Circle;
  protected readonly CheckIcon = CircleCheck;
}
