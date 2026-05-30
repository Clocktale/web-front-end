import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { LucideAngularModule, X } from 'lucide-angular';

interface FilterOption {
  id: string;
  label: string;
}

const STATUS_OPTIONS: FilterOption[] = [
  { id: 'ongoing', label: 'Em andamento' },
  { id: 'completed', label: 'Finalizado' },
];

const GENRE_OPTIONS: FilterOption[] = [
  { id: 'action', label: 'Ação' },
  { id: 'adventure', label: 'Aventura' },
  { id: 'comedy', label: 'Comédia' },
  { id: 'drama', label: 'Drama' },
  { id: 'fantasy', label: 'Fantasia' },
  { id: 'romance', label: 'Romance' },
  { id: 'scifi', label: 'Sci-Fi' },
  { id: 'supernatural', label: 'Sobrenatural' },
  { id: 'suspense', label: 'Suspense' },
  { id: 'slice', label: 'Slice of Life' },
];

const STORY_SIZE_OPTIONS: FilterOption[] = [
  { id: 'small', label: 'Pequeno' },
  { id: 'medium', label: 'Médio' },
  { id: 'long', label: 'Longo' },
  { id: 'very_long', label: 'Muito longo' },
];

const STUDIO_OPTIONS: FilterOption[] = [
  { id: 'mappa', label: 'MAPPA' },
  { id: 'wit', label: 'Wit Studio' },
  { id: 'bones', label: 'Bones' },
  { id: 'madhouse', label: 'Madhouse' },
  { id: 'ufotable', label: 'ufotable' },
  { id: 'kyoani', label: 'Kyoto Animation' },
  { id: 'a1', label: 'A-1 Pictures' },
  { id: 'pierrot', label: 'Pierrot' },
];

@Component({
  selector: 'app-anime-filter-panel',
  standalone: true,
  imports: [LucideAngularModule],
  template: `
    <div
      class="filter-panel__backdrop"
      [class.filter-panel__backdrop--open]="isOpen()"
      (click)="close()"
      aria-hidden="true"
    ></div>

    <aside
      class="filter-panel__drawer"
      [class.filter-panel__drawer--open]="isOpen()"
      [attr.aria-hidden]="!isOpen()"
    >
      <div class="filter-panel__header">
        <h2 class="filter-panel__title">Filtros</h2>
        <button
          type="button"
          class="filter-panel__close-btn"
          (click)="close()"
          aria-label="Fechar painel de filtros"
        >
          <lucide-angular [img]="XIcon" [size]="20" />
        </button>
      </div>

      <div class="filter-panel__content">
        <div class="filter-panel__section">
          <h3 class="filter-panel__section-title">Status</h3>
          <div class="filter-panel__options">
            @for (option of statusOptions; track option.id) {
              <label class="filter-panel__option">
                <input type="checkbox" class="filter-panel__checkbox" />
                <span class="filter-panel__option-label">{{ option.label }}</span>
              </label>
            }
          </div>
        </div>

        <div class="filter-panel__section">
          <h3 class="filter-panel__section-title">Gêneros</h3>
          <div class="filter-panel__options filter-panel__options--tags">
            @for (option of genreOptions; track option.id) {
              <label class="filter-panel__tag-label">
                <input type="checkbox" class="filter-panel__checkbox filter-panel__checkbox--hidden" />
                <span class="filter-panel__tag">{{ option.label }}</span>
              </label>
            }
          </div>
        </div>

        <div class="filter-panel__section">
          <h3 class="filter-panel__section-title">Tamanho da história</h3>
          <div class="filter-panel__options filter-panel__options--tags">
            @for (option of storySizeOptions; track option.id) {
              <label class="filter-panel__tag-label">
                <input type="checkbox" class="filter-panel__checkbox filter-panel__checkbox--hidden" />
                <span class="filter-panel__tag">{{ option.label }}</span>
              </label>
            }
          </div>
        </div>

        <div class="filter-panel__section">
          <h3 class="filter-panel__section-title">Estúdios</h3>
          <div class="filter-panel__options">
            @for (option of studioOptions; track option.id) {
              <label class="filter-panel__option">
                <input type="checkbox" class="filter-panel__checkbox" />
                <span class="filter-panel__option-label">{{ option.label }}</span>
              </label>
            }
          </div>
        </div>
      </div>

      <div class="filter-panel__footer">
        <button type="button" class="filter-panel__btn filter-panel__btn--clear">
          Limpar filtros
        </button>
        <button type="button" class="filter-panel__btn filter-panel__btn--apply">
          Aplicar
        </button>
      </div>
    </aside>
  `,
  styleUrl: './anime-filter-panel.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnimeFilterPanelComponent {
  isOpen = input.required<boolean>();
  closed = output<void>();

  protected readonly XIcon = X;
  protected readonly statusOptions = STATUS_OPTIONS;
  protected readonly genreOptions = GENRE_OPTIONS;
  protected readonly storySizeOptions = STORY_SIZE_OPTIONS;
  protected readonly studioOptions = STUDIO_OPTIONS;

  close(): void {
    this.closed.emit();
  }
}
