import {
  Component,
  input,
  output,
  signal,
  effect,
  ChangeDetectionStrategy,
  DestroyRef,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { LucideAngularModule, Search } from 'lucide-angular';
import { TextFieldComponent } from '../text-field/text-field.component';

@Component({
  selector: 'app-search-field',
  standalone: true,
  imports: [TextFieldComponent, LucideAngularModule],
  template: `
    <app-text-field
      [placeholder]="placeholder()"
      [disabled]="disabled()"
      [ariaLabel]="ariaLabel()"
      [(value)]="internalValue"
      (valueChanged)="onValueChanged($event)"
    >
      <lucide-angular
        leading
        [img]="SearchIcon"
        [size]="20"
        class="search-field__icon"
      />
    </app-text-field>
  `,
  styleUrl: './search-field.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchFieldComponent {
  private readonly destroyRef = inject(DestroyRef);

  placeholder = input<string>('Pesquisar');
  disabled = input(false);
  ariaLabel = input<string | undefined>(undefined);
  debounceMs = input(300);

  searchChanged = output<string>();

  protected readonly SearchIcon = Search;
  protected internalValue = signal('');

  private readonly searchSubject = new Subject<string>();

  constructor() {
    this.searchSubject
      .pipe(
        debounceTime(this.debounceMs()),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(value => {
        this.searchChanged.emit(value);
      });
  }

  onValueChanged(value: string): void {
    this.searchSubject.next(value);
  }
}
