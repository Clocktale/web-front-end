import { Injectable, computed, inject, signal } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { AuthorRepository } from '../data/repositories/author.repository';
import { ToastService } from '../services/toast.service';
import type { Author } from '../types/author.type';
import { DeleteAuthorUseCase } from '../use-cases/authors/delete-author.use-case';
import { resolveUserFacingErrorMessage } from '../utils/error-handling/resolve-user-facing-error';

@Injectable({ providedIn: 'root' })
export class AuthorController {
  private readonly repository = inject(AuthorRepository);
  private readonly deleteAuthorUseCase = inject(DeleteAuthorUseCase);
  private readonly transloco = inject(TranslocoService);
  private readonly toastService = inject(ToastService);

  private loadAuthorsRequestId = 0;

  private readonly pageCache = new Map<number, Author[]>();

  authors = signal<Author[]>([]);
  searchQuery = signal('');
  currentPage = signal(1);
  pageSize = signal(10);
  totalItems = signal(0);
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
    this.pageCache.clear();
    this.fetchPageFromApi(this.currentPage());
  }

  private fetchPageFromApi(page: number): void {
    const requestId = ++this.loadAuthorsRequestId;

    this.loading.set(true);
    this.authors.set([]);

    const name = this.searchQuery().trim() || undefined;
    const pageSize = this.pageSize();

    this.repository.list({ page, pageSize, name }).subscribe({
      next: (result) => {
        if (requestId !== this.loadAuthorsRequestId) {
          return;
        }
        this.pageCache.set(page, result.items);
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

    const cached = this.pageCache.get(page);
    if (cached !== undefined) {
      this.loadAuthorsRequestId++;
      this.authors.set(cached);
      this.loading.set(false);
      return;
    }

    this.fetchPageFromApi(page);
  }

  deleteAuthor(author: Author): void {
    if (this.loading()) {
      return;
    }

    this.loading.set(true);

    this.deleteAuthorUseCase.execute(author.id).subscribe({
      next: () => {
        this.loading.set(false);
        this.loadAuthors();
        this.toastService.show({
          message: this.transloco.translate('admin.authors.deleteAuthorSuccess', {
            name: author.name,
          }),
          variant: 'success',
        });
      },
      error: (err: unknown) => {
        this.loading.set(false);
        this.logAuthorError('deleteAuthor', err);
        this.toastService.show({
          message: resolveUserFacingErrorMessage(
            err,
            (key) => this.transloco.translate(key),
            'admin.authors.deleteError',
          ),
          variant: 'error',
        });
      },
    });
  }

  private logAuthorError(context: string, err: unknown): void {
    console.error(`[AuthorController] ${context}`, err);
  }
}
