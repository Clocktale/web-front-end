import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { Anime } from '../../../../types/anime.type';

@Component({
  selector: 'app-anime-card',
  standalone: true,
  template: `
    <div
      class="anime-card"
      [style.background-image]="'url(' + anime().cardBackgroundUrl + ')'"
    >
      <div class="anime-card__info">
        <h3 class="anime-card__title">{{ anime().title }}</h3>

        <div class="anime-card__footer">
          <span class="anime-card__stars">★ {{ anime().stars.toFixed(1) }}</span>
          <span class="anime-card__status">
            {{ anime().status === 'ongoing' ? 'Em andamento' : 'Finalizado' }}
          </span>
        </div>

        <div class="anime-card__genres">
          @for (genre of anime().genres.slice(0, 2); track genre.id; let last = $last) {
            <span class="anime-card__genre">{{ genre.name }}{{ !last ? ',' : '' }}</span>
          }
        </div>
      </div>
    </div>
  `,
  styleUrl: './anime-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnimeCardComponent {
  anime = input.required<Anime>();
}
