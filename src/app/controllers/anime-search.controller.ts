import { Injectable, computed, inject, signal } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';

import { AnimeRepository } from '../data/repositories/anime.repository';
import { ToastService } from '../services/toast.service';
import type { Anime } from '../types/anime.type';

export type AnimeSortDirection = 'asc' | 'desc';
export type AnimeSortField =
  | 'title'
  | 'releaseDate'
  | 'stars'
  | 'seasonCount'
  | 'totalEpisodes';

@Injectable({ providedIn: 'root' })
export class AnimeSearchController {
  private readonly repository = inject(AnimeRepository);
  private readonly transloco = inject(TranslocoService);
  private readonly toastService = inject(ToastService);

  private loadRequestId = 0;

  readonly animes = signal<Anime[]>([]);
  readonly searchQuery = signal('');
  readonly sortField = signal<AnimeSortField>('title');
  readonly sortDirection = signal<AnimeSortDirection>('asc');
  readonly loading = signal(false);
  readonly totalItems = signal(0);
  readonly currentPage = signal(1);
  readonly lastPage = signal(1);
  readonly pageSize = signal(24);

  /** Lista filtrada por query e ordenada — usada diretamente no template. */
  readonly displayedAnimes = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const field = this.sortField();
    const dir = this.sortDirection();

    let list = [...this.animes()];

    if (query) {
      list = list.filter(
        (a) =>
          a.title.toLowerCase().includes(query) ||
          a.authors.some((au) => au.name.toLowerCase().includes(query)) ||
          a.studios.some((s) => s.name.toLowerCase().includes(query))
      );
    }

    list.sort((a, b) => {
      let cmp = 0;

      switch (field) {
        case 'title':
          cmp = a.title.localeCompare(b.title);
          break;
        case 'releaseDate':
          cmp = a.releaseDate.getTime() - b.releaseDate.getTime();
          break;
        case 'stars':
          cmp = a.stars - b.stars;
          break;
        case 'seasonCount':
          cmp = a.seasonCount - b.seasonCount;
          break;
        case 'totalEpisodes':
          cmp = a.totalEpisodes - b.totalEpisodes;
          break;
      }

      return dir === 'asc' ? cmp : -cmp;
    });

    return list;
  });

  readonly displayedCount = computed(() => this.displayedAnimes().length);

  loadAnimes(): void {
    const requestId = ++this.loadRequestId;
    this.loading.set(true);

    this.repository
      .list({ page: this.currentPage(), pageSize: this.pageSize() })
      .subscribe({
        next: (result) => {
          if (requestId !== this.loadRequestId) return;
          this.animes.set(result.items);
          this.totalItems.set(result.total);
          this.lastPage.set(result.lastPage);
          this.loading.set(false);
        },
        error: (err: unknown) => {
          if (requestId !== this.loadRequestId) return;
          this.loading.set(false);
          console.error('[AnimeSearchController] loadAnimes', err);
          this.toastService.show({
            message: this.transloco.translate('app.search.loadError'),
            variant: 'error',
          });
        },
      });
  }

  search(query: string): void {
    this.searchQuery.set(query);
  }

  setSortField(field: AnimeSortField): void {
    this.sortField.set(field);
  }

  setSortDirection(dir: AnimeSortDirection): void {
    this.sortDirection.set(dir);
  }

  changePage(page: number): void {
    if (page < 1 || page > this.lastPage()) return;
    this.currentPage.set(page);
    this.loadAnimes();
  }
}
