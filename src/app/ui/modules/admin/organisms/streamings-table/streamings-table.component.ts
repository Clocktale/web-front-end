import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { LucideAngularModule, Pencil, Trash2 } from 'lucide-angular';
import type { Streaming } from '../../../../../types/streaming.type';

@Component({
  selector: 'app-streamings-table',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, TranslocoModule],
  template: `
    <ng-container *transloco="let t; prefix: 'admin.streamings'">
      <div class="streamings-table">
        <table class="streamings-table__table">
          <thead class="streamings-table__header">
            <tr>
              <th class="streamings-table__header-cell">{{ t('tableNameColumn') }}</th>
              <th class="streamings-table__header-cell streamings-table__header-cell--actions">
                {{ t('tableActionsColumn') }}
              </th>
            </tr>
          </thead>
          <tbody class="streamings-table__body">
            @if (streamings().length === 0 && !loading()) {
              <tr>
                <td colspan="2" class="streamings-table__empty">{{ t('tableEmptyState') }}</td>
              </tr>
            }
            @if (loading()) {
              @for (row of shimmerRowIndices; track row) {
                <tr class="streamings-table__row streamings-table__row--shimmer" aria-hidden="true">
                  <td class="streamings-table__cell">
                    <div class="streamings-table__name-cell streamings-table__name-cell--shimmer">
                      <span class="streamings-table__skeleton streamings-table__skeleton--logo"></span>
                      <span class="streamings-table__skeleton streamings-table__skeleton--text"></span>
                    </div>
                  </td>
                  <td class="streamings-table__cell streamings-table__cell--actions">
                    <div class="streamings-table__actions streamings-table__actions--shimmer">
                      <span class="streamings-table__skeleton streamings-table__skeleton--action"></span>
                      <span class="streamings-table__skeleton streamings-table__skeleton--action"></span>
                    </div>
                  </td>
                </tr>
              }
            } @else {
              @for (streaming of streamings(); track streaming.id) {
                <tr
                  class="streamings-table__row streamings-table__row--interactive"
                  tabindex="0"
                  (click)="onRowClick($event, streaming)"
                  (keydown)="onRowKeydown($event, streaming)"
                >
                  <td class="streamings-table__cell">
                    <div class="streamings-table__name-cell">
                      <span class="streamings-table__logo" aria-hidden="true"></span>
                      <span class="streamings-table__name">{{ streaming.name }}</span>
                    </div>
                  </td>
                  <td
                    class="streamings-table__cell streamings-table__cell--actions"
                    (click)="$event.stopPropagation()"
                  >
                    <div class="streamings-table__actions">
                      <button
                        type="button"
                        class="streamings-table__action-button"
                        disabled
                        [attr.aria-label]="t('tableEditAriaLabel')"
                      >
                        <lucide-angular [img]="PencilIcon" [size]="18" />
                      </button>
                      <button
                        type="button"
                        class="streamings-table__action-button streamings-table__action-button--danger"
                        disabled
                        [attr.aria-label]="t('tableDeleteAriaLabel')"
                      >
                        <lucide-angular [img]="Trash2Icon" [size]="18" />
                      </button>
                    </div>
                  </td>
                </tr>
              }
            }
          </tbody>
        </table>
      </div>
    </ng-container>
  `,
  styleUrl: './streamings-table.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StreamingsTableComponent {
  streamings = input.required<Streaming[]>();
  loading = input(false);

  rowSelected = output<Streaming>();

  protected readonly PencilIcon = Pencil;
  protected readonly Trash2Icon = Trash2;

  protected readonly shimmerRowIndices: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

  onRowClick(event: MouseEvent, streaming: Streaming): void {
    const target = event.target as HTMLElement | null;
    if (target?.closest('.streamings-table__cell--actions')) {
      return;
    }
    this.rowSelected.emit(streaming);
  }

  onRowKeydown(event: KeyboardEvent, streaming: Streaming): void {
    if (event.key !== 'Enter' && event.key !== ' ') {
      return;
    }
    event.preventDefault();
    this.rowSelected.emit(streaming);
  }
}
