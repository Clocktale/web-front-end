import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { ChevronLeft, ChevronRight, LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-pagination-controls',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, TranslocoModule],
  template: `
    <ng-container *transloco="let t; prefix: 'designSystem.paginationControls'">
      <div class="pagination-controls">
        <p class="pagination-controls__text">
          {{
            t('rangeSummary', {
              start: displayStart(),
              end: displayEnd(),
              itemLabel: itemLabel() ?? t('defaultItemLabel'),
              total: totalItems(),
            })
          }}
        </p>

        <div class="pagination-controls__buttons">
          <button
            type="button"
            class="pagination-controls__button"
            [disabled]="isFirstPage() || loading()"
            (click)="previousPage()"
            [attr.aria-label]="t('previousPageAriaLabel')"
          >
            <lucide-angular [img]="ChevronLeftIcon" [size]="20" />
          </button>

          <button
            type="button"
            class="pagination-controls__button"
            [disabled]="isLastPage() || loading()"
            (click)="nextPage()"
            [attr.aria-label]="t('nextPageAriaLabel')"
          >
            <lucide-angular [img]="ChevronRightIcon" [size]="20" />
          </button>
        </div>
      </div>
    </ng-container>
  `,
  styleUrl: './pagination-controls.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationControlsComponent {
  currentPage = input.required<number>();
  totalItems = input.required<number>();
  pageSize = input(6);
  /** Quando true, anterior/próximo ficam desativados (ex.: carregamento em curso). */
  loading = input(false);
  /** Rótulo do tipo de item (ex. autores). Se omitido, usa `defaultItemLabel` nas traduções. */
  itemLabel = input<string | undefined>(undefined);

  pageChanged = output<number>();

  protected readonly ChevronLeftIcon = ChevronLeft;
  protected readonly ChevronRightIcon = ChevronRight;

  totalPages = computed(() => {
    const total = this.totalItems();
    const size = this.pageSize();
    return Math.ceil(total / size);
  });

  /** Índice do primeiro item da página atual (1-based). */
  displayStart = computed(() => {
    const total = this.totalItems();
    if (total === 0) {
      return 0;
    }
    const current = this.currentPage();
    const size = this.pageSize();
    return (current - 1) * size + 1;
  });

  /** Índice do último item da página atual (1-based), limitado ao total. */
  displayEnd = computed(() => {
    const total = this.totalItems();
    if (total === 0) {
      return 0;
    }
    const current = this.currentPage();
    const size = this.pageSize();
    return Math.min(current * size, total);
  });

  isFirstPage = computed(() => this.currentPage() <= 1);

  isLastPage = computed(() => {
    const current = this.currentPage();
    const total = this.totalPages();
    return current >= total;
  });

  previousPage(): void {
    if (this.isFirstPage() || this.loading()) {
      return;
    }
    this.pageChanged.emit(this.currentPage() - 1);
  }

  nextPage(): void {
    if (this.isLastPage() || this.loading()) {
      return;
    }
    this.pageChanged.emit(this.currentPage() + 1);
  }
}
