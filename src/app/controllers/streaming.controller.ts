import { Injectable, computed, inject, signal } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { StreamingRepository } from '../data/repositories/streaming.repository';
import { ToastService } from '../services/toast.service';
import type { Streaming } from '../types/streaming.type';

@Injectable({ providedIn: 'root' })
export class StreamingController {
  private readonly repository = inject(StreamingRepository);
  private readonly transloco = inject(TranslocoService);
  private readonly toastService = inject(ToastService);

  private loadStreamingsRequestId = 0;

  private readonly pageCache = new Map<number, Streaming[]>();

  streamings = signal<Streaming[]>([]);
  searchQuery = signal('');
  currentPage = signal(1);
  pageSize = signal(10);
  totalItems = signal(0);
  lastPage = signal(1);
  loading = signal(false);

  selectedStreaming = signal<Streaming | null>(null);

  totalPages = computed(() => Math.max(1, this.lastPage()));

  displayedItems = computed(() => {
    const current = this.currentPage();
    const size = this.pageSize();
    const total = this.totalItems();
    const start = total === 0 ? 0 : (current - 1) * size + 1;
    const end = Math.min(current * size, total);
    return { start, end };
  });

  loadStreamings(): void {
    this.pageCache.clear();
    this.fetchPageFromApi(this.currentPage());
  }

  openDetails(streaming: Streaming): void {
    this.selectedStreaming.set(streaming);
  }

  closeDetails(): void {
    this.selectedStreaming.set(null);
  }

  private fetchPageFromApi(page: number): void {
    const requestId = ++this.loadStreamingsRequestId;

    this.loading.set(true);
    this.streamings.set([]);

    const name = this.searchQuery().trim() || undefined;
    const pageSize = this.pageSize();

    this.repository.list({ page, pageSize, name }).subscribe({
      next: (result) => {
        if (requestId !== this.loadStreamingsRequestId) {
          return;
        }
        this.pageCache.set(page, result.items);
        this.streamings.set(result.items);
        this.totalItems.set(result.total);
        this.lastPage.set(result.lastPage);
        const safePerPage = Math.max(1, result.perPage) || pageSize;
        this.pageSize.set(safePerPage);
        this.loading.set(false);
      },
      error: (err: unknown) => {
        if (requestId !== this.loadStreamingsRequestId) {
          return;
        }
        this.loading.set(false);
        console.error('[StreamingController] loadStreamings', err);
        this.toastService.show({
          message: this.transloco.translate('admin.streamings.loadError'),
          variant: 'error',
        });
      },
    });
  }

  searchStreamings(query: string): void {
    this.searchQuery.set(query);
    this.currentPage.set(1);
    this.loadStreamings();
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages()) {
      return;
    }
    this.currentPage.set(page);

    const cached = this.pageCache.get(page);
    if (cached !== undefined) {
      this.loadStreamingsRequestId++;
      this.streamings.set(cached);
      this.loading.set(false);
      return;
    }

    this.fetchPageFromApi(page);
  }
}
