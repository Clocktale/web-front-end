import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { LucideAngularModule, SlidersHorizontal } from 'lucide-angular';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';

import { AnimeSearchController } from '../../../../controllers/anime-search.controller';
import type { AnimeSortField } from '../../../../controllers/anime-search.controller';
import { AnimeCardComponent } from '../../../design_system/molecules/anime-card/anime-card.component';
import { AnimeFilterPanelComponent } from '../../../design_system/molecules/anime-filter-panel/anime-filter-panel.component';
import { SearchFieldComponent } from '../../../design_system/molecules/search-field/search-field.component';
import {
  DropdownSelectComponent,
  type DropdownOption,
} from '../../../design_system/molecules/dropdown-select/dropdown-select.component';
import {
  SegmentedButtonComponent,
  type SegmentedOption,
} from '../../../design_system/molecules/segmented-button/segmented-button.component';

@Component({
  selector: 'app-anime-search-page',
  standalone: true,
  imports: [
    TranslocoModule,
    LucideAngularModule,
    SearchFieldComponent,
    AnimeCardComponent,
    AnimeFilterPanelComponent,
    DropdownSelectComponent,
    SegmentedButtonComponent,
  ],
  template: `
    <div class="anime-search" *transloco="let t; prefix: 'app.search'">

      <div class="anime-search__topbar">
        <app-search-field
          class="anime-search__search"
          [placeholder]="t('searchPlaceholder')"
          (searchChanged)="controller.search($event)"
        />
        <button
          type="button"
          class="anime-search__filter-btn"
          (click)="filterOpen.set(true)"
        >
          <lucide-angular [img]="SlidersIcon" [size]="18" />
          {{ t('filtersButton') }}
        </button>
      </div>

      <div class="anime-search__content">
        <div class="anime-search__results-row">
          <div class="anime-search__title-area">
            <h1 class="anime-search__title">{{ t('resultsTitle') }}</h1>
            <p class="anime-search__subtitle">
              {{ t('resultsSubtitle', { showing: controller.displayedCount(), total: controller.totalItems() }) }}
            </p>
          </div>

          <div class="anime-search__sort">
            <span class="anime-search__sort-label">{{ t('sortBy') }}</span>

            <app-dropdown-select
              [options]="sortFieldOptions()"
              [value]="controller.sortField()"
              (valueChange)="controller.setSortField($any($event))"
            />

            <app-segmented-button
              [options]="sortDirectionOptions()"
              [value]="controller.sortDirection()"
              (valueChange)="controller.setSortDirection($any($event))"
            />
          </div>
        </div>

        @if (controller.loading()) {
          <div class="anime-search__skeleton-grid">
            @for (item of skeletonItems; track item) {
              <div class="anime-search__skeleton-card"></div>
            }
          </div>
        } @else {
          <div class="anime-search__grid">
            @for (anime of controller.displayedAnimes(); track anime.id) {
              <app-anime-card [anime]="anime" />
            } @empty {
              <p class="anime-search__empty">{{ t('emptyState') }}</p>
            }
          </div>
        }
      </div>

      <app-anime-filter-panel
        [isOpen]="filterOpen()"
        (closed)="filterOpen.set(false)"
      />
    </div>
  `,
  styleUrl: './anime-search.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnimeSearchPage implements OnInit {
  protected readonly controller = inject(AnimeSearchController);
  private readonly transloco = inject(TranslocoService);
  private readonly activeLang = toSignal(this.transloco.langChanges$);

  protected readonly filterOpen = signal(false);
  protected readonly SlidersIcon = SlidersHorizontal;
  protected readonly skeletonItems = Array.from({ length: 12 });

  protected readonly sortFieldOptions = computed<DropdownOption[]>(() => {
    this.activeLang();
    const t = (key: string) => this.transloco.translate(`app.search.${key}`);
    return [
      { value: 'title' satisfies AnimeSortField, label: t('sortByName') },
      { value: 'releaseDate' satisfies AnimeSortField, label: t('sortByReleaseDate') },
      { value: 'stars' satisfies AnimeSortField, label: t('sortByStars') },
      { value: 'seasonCount' satisfies AnimeSortField, label: t('sortBySeasonCount') },
      { value: 'totalEpisodes' satisfies AnimeSortField, label: t('sortByTotalEpisodes') },
    ];
  });

  protected readonly sortDirectionOptions = computed<SegmentedOption[]>(() => {
    this.activeLang();
    const field = this.controller.sortField();
    const t = (key: string) => this.transloco.translate(`app.search.${key}`);

    switch (field) {
      case 'releaseDate':
        return [
          { value: 'asc', label: t('sortDateAsc') },
          { value: 'desc', label: t('sortDateDesc') },
        ];
      case 'stars':
        return [
          { value: 'asc', label: t('sortStarsAsc') },
          { value: 'desc', label: t('sortStarsDesc') },
        ];
      case 'seasonCount':
      case 'totalEpisodes':
        return [
          { value: 'asc', label: t('sortCountAsc') },
          { value: 'desc', label: t('sortCountDesc') },
        ];
      default:
        return [
          { value: 'asc', label: t('sortAsc') },
          { value: 'desc', label: t('sortDesc') },
        ];
    }
  });

  ngOnInit(): void {
    this.controller.loadAnimes();
  }
}
