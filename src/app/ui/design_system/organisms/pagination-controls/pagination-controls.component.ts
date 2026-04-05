import {
  Component,
  input,
  output,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';
import { LucideAngularModule, ChevronLeft, ChevronRight } from 'lucide-angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination-controls',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="pagination-controls">
      <p class="pagination-controls__text">
        Mostrando {{ displayStart() }} de um total de {{ totalItems() }}
        {{ itemLabel() }}
      </p>

      <div class="pagination-controls__buttons">
        <button
          type="button"
          class="pagination-controls__button"
          [disabled]="isFirstPage()"
          (click)="previousPage()"
          aria-label="Página anterior"
        >
          <lucide-angular [img]="ChevronLeftIcon" [size]="20" />
        </button>

        <button
          type="button"
          class="pagination-controls__button"
          [disabled]="isLastPage()"
          (click)="nextPage()"
          aria-label="Próxima página"
        >
          <lucide-angular [img]="ChevronRightIcon" [size]="20" />
        </button>
      </div>
    </div>
  `,
  styleUrl: './pagination-controls.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationControlsComponent {
  currentPage = input.required<number>();
  totalItems = input.required<number>();
  pageSize = input(6);
  itemLabel = input('resultados');

  pageChanged = output<number>();

  protected readonly ChevronLeftIcon = ChevronLeft;
  protected readonly ChevronRightIcon = ChevronRight;

  totalPages = computed(() => {
    const total = this.totalItems();
    const size = this.pageSize();
    return Math.ceil(total / size);
  });

  displayStart = computed(() => {
    const current = this.currentPage();
    const size = this.pageSize();
    const total = this.totalItems();
    if (total === 0) {
      return 0;
    }
    return Math.min((current - 1) * size + 1, total);
  });

  isFirstPage = computed(() => this.currentPage() <= 1);

  isLastPage = computed(() => {
    const current = this.currentPage();
    const total = this.totalPages();
    return current >= total;
  });

  previousPage(): void {
    if (this.isFirstPage()) {
      return;
    }
    this.pageChanged.emit(this.currentPage() - 1);
  }

  nextPage(): void {
    if (this.isLastPage()) {
      return;
    }
    this.pageChanged.emit(this.currentPage() + 1);
  }
}
