import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  OnInit,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent } from 'rxjs';
import { LucideAngularModule, ChevronDown } from 'lucide-angular';

export interface DropdownOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-dropdown-select',
  standalone: true,
  imports: [LucideAngularModule],
  template: `
    <div class="dropdown">
      <button
        type="button"
        class="dropdown__trigger"
        [class.dropdown__trigger--open]="isOpen()"
        (click)="toggleOpen()"
        [attr.aria-expanded]="isOpen()"
        aria-haspopup="listbox"
      >
        <span class="dropdown__label">{{ selectedLabel() }}</span>
        <lucide-angular
          [img]="ChevronIcon"
          [size]="20"
          class="dropdown__chevron"
          [class.dropdown__chevron--open]="isOpen()"
        />
      </button>

      @if (isOpen()) {
        <ul class="dropdown__menu" role="listbox">
          @for (option of options(); track option.value) {
            <li
              class="dropdown__item"
              [class.dropdown__item--active]="option.value === value()"
              role="option"
              [attr.aria-selected]="option.value === value()"
              (click)="select(option.value)"
            >
              {{ option.label }}
            </li>
          }
        </ul>
      }
    </div>
  `,
  styleUrl: './dropdown-select.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownSelectComponent implements OnInit {
  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly destroyRef = inject(DestroyRef);

  options = input.required<DropdownOption[]>();
  value = input.required<string>();
  valueChange = output<string>();

  protected readonly ChevronIcon = ChevronDown;
  protected readonly isOpen = signal(false);

  protected readonly selectedLabel = computed(() => {
    const found = this.options().find((o) => o.value === this.value());
    return found?.label ?? '';
  });

  ngOnInit(): void {
    fromEvent<MouseEvent>(document, 'click')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((event) => {
        if (!this.el.nativeElement.contains(event.target as Node)) {
          this.isOpen.set(false);
        }
      });
  }

  toggleOpen(): void {
    this.isOpen.update((v) => !v);
  }

  select(val: string): void {
    this.valueChange.emit(val);
    this.isOpen.set(false);
  }
}
