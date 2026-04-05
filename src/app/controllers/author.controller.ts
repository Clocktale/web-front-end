import { Injectable, inject, signal, computed } from '@angular/core';
import type { Author } from '../types/author.type';
import { AuthorRepository } from '../repositories/author.repository';

@Injectable({ providedIn: 'root' })
export class AuthorController {
  private readonly repository = inject(AuthorRepository);

  authors = signal<Author[]>([]);
  searchQuery = signal('');
  currentPage = signal(1);
  pageSize = signal(6);
  totalItems = signal(0);
  loading = signal(false);
  error = signal<string | null>(null);

  totalPages = computed(() => {
    const total = this.totalItems();
    const size = this.pageSize();
    return Math.ceil(total / size);
  });

  displayedItems = computed(() => {
    const current = this.currentPage();
    const size = this.pageSize();
    const total = this.totalItems();
    const start = (current - 1) * size + 1;
    const end = Math.min(current * size, total);
    return { start, end };
  });

  loadAuthors(): void {
    if (this.loading()) {
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    const query = this.searchQuery().trim();
    const page = this.currentPage();
    const pageSize = this.pageSize();

    const request$ = query
      ? this.repository.search({ query, page, pageSize })
      : this.repository.getAll({ page, pageSize });

    request$.subscribe({
      next: result => {
        this.authors.set(result.authors);
        this.totalItems.set(result.total);
        this.loading.set(false);
      },
      error: (err: unknown) => {
        this.loading.set(false);
        this.error.set(
          err instanceof Error ? err.message : 'Failed to load authors'
        );
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
    this.error.set(null);

    this.repository.delete(id).subscribe({
      next: () => {
        this.loading.set(false);
        this.loadAuthors();
      },
      error: (err: unknown) => {
        this.loading.set(false);
        this.error.set(
          err instanceof Error ? err.message : 'Failed to delete author'
        );
      },
    });
  }
}
