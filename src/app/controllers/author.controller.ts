import { Injectable, computed, inject, signal } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { AdminAuthorRepository } from '../data/repositories/admin-author.repository';
import { AuthorRepository } from '../data/repositories/author.repository';
import { ToastService } from '../services/toast.service';
import type { Author } from '../types/author.type';

@Injectable({ providedIn: 'root' })
export class AuthorController {
  private readonly repository = inject(AuthorRepository);
  private readonly adminAuthorRepository = inject(AdminAuthorRepository);
  private readonly transloco = inject(TranslocoService);
  private readonly toastService = inject(ToastService);

  /** Evita aplicar resposta antiga se um pedido mais recente foi disparado. */
  private loadAuthorsRequestId = 0;

  authors = signal<Author[]>([]);
  searchQuery = signal('');
  currentPage = signal(1);
  pageSize = signal(6);
  totalItems = signal(0);
  /** Última página reportada pela API (LengthAware). */
  lastPage = signal(1);
  loading = signal(false);

  totalPages = computed(() => Math.max(1, this.lastPage()));

  displayedItems = computed(() => {
    const current = this.currentPage();
    const size = this.pageSize();
    const total = this.totalItems();
    const start = total === 0 ? 0 : (current - 1) * size + 1;
    const end = Math.min(current * size, total);
    return { start, end };
  });

  loadAuthors(): void {
    const requestId = ++this.loadAuthorsRequestId;

    this.loading.set(true);

    const name = this.searchQuery().trim() || undefined;
    const page = this.currentPage();
    const pageSize = this.pageSize();

    this.repository.list({ page, pageSize, name }).subscribe({
      next: (result) => {
        if (requestId !== this.loadAuthorsRequestId) {
          return;
        }
        this.authors.set(result.items);
        this.totalItems.set(result.total);
        this.lastPage.set(result.lastPage);
        const safePerPage = Math.max(1, result.perPage) || pageSize;
        this.pageSize.set(safePerPage);
        this.loading.set(false);
      },
      error: (err: unknown) => {
        if (requestId !== this.loadAuthorsRequestId) {
          return;
        }
        this.loading.set(false);
        this.logAuthorError('loadAuthors', err);
        this.toastService.show({
          message: this.transloco.translate('admin.authors.loadError'),
          variant: 'error',
        });
      },
    });
  }

  searchAuthors(query: string): void {
    this.searchQuery.set(query);
    this.currentPage.set(1);
    this.loadAuthors();
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages()) {
      return;
    }
    this.currentPage.set(page);
    this.loadAuthors();
  }

  deleteAuthor(id: number): void {
    if (this.loading()) {
      return;
    }

    this.loading.set(true);

    this.adminAuthorRepository.delete(id).subscribe({
      next: () => {
        this.loading.set(false);
        this.loadAuthors();
      },
      error: (err: unknown) => {
        this.loading.set(false);
        this.logAuthorError('deleteAuthor', err);
        this.toastService.show({
          message: this.transloco.translate('admin.authors.deleteError'),
          variant: 'error',
        });
      },
    });
  }

  /**
   * Log completo no consola para diagnóstico; a UI usa só toast genérico (i18n).
   */
  private logAuthorError(context: string, err: unknown): void {
    console.error(`[AuthorController] ${context}`, err);
  }
}
