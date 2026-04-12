import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { LucideAngularModule, Pencil, Trash2 } from 'lucide-angular';
import type { Author } from '../../../../../types/author.type';

@Component({
  selector: 'app-authors-table',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, TranslocoModule],
  template: `
    <ng-container *transloco="let t; prefix: 'admin.authors'">
      <div class="authors-table">
        <table class="authors-table__table">
          <thead class="authors-table__header">
            <tr>
              <th class="authors-table__header-cell">{{ t('tableAuthorNameColumn') }}</th>
              <th class="authors-table__header-cell authors-table__header-cell--actions">
                {{ t('tableActionsColumn') }}
              </th>
            </tr>
          </thead>
          <tbody class="authors-table__body">
            @if (authors().length === 0 && !loading()) {
              <tr>
                <td colspan="2" class="authors-table__empty">{{ t('tableEmptyState') }}</td>
              </tr>
            }
          @if (loading()) {
            @for (row of shimmerRowIndices; track row) {
              <tr class="authors-table__row authors-table__row--shimmer" aria-hidden="true">
                <td class="authors-table__cell">
                  <span class="authors-table__skeleton authors-table__skeleton--text"></span>
                </td>
                <td class="authors-table__cell authors-table__cell--actions">
                  <div class="authors-table__actions authors-table__actions--shimmer">
                    <span class="authors-table__skeleton authors-table__skeleton--action"></span>
                    <span class="authors-table__skeleton authors-table__skeleton--action"></span>
                  </div>
                </td>
              </tr>
            }
          } @else {
            @for (author of authors(); track author.id) {
              <tr class="authors-table__row">
                <td class="authors-table__cell">{{ author.name }}</td>
                <td class="authors-table__cell authors-table__cell--actions">
                  <div class="authors-table__actions">
                    <button
                      type="button"
                      class="authors-table__action-button"
                      (click)="onEdit(author)"
                      [disabled]="loading()"
                      [attr.aria-label]="t('tableEditAuthorAriaLabel')"
                    >
                      <lucide-angular [img]="PencilIcon" [size]="18" />
                    </button>
                    <button
                      type="button"
                      class="authors-table__action-button authors-table__action-button--danger"
                      (click)="onDelete(author)"
                      [disabled]="loading()"
                      [attr.aria-label]="t('tableDeleteAuthorAriaLabel')"
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
  styleUrl: './authors-table.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthorsTableComponent {
  authors = input.required<Author[]>();
  loading = input(false);

  editAuthor = output<Author>();
  deleteAuthor = output<Author>();

  protected readonly PencilIcon = Pencil;
  protected readonly Trash2Icon = Trash2;

  /** Placeholder rows durante carregamento (10 por página). */
  protected readonly shimmerRowIndices: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

  onEdit(author: Author): void {
    this.editAuthor.emit(author);
  }

  onDelete(author: Author): void {
    this.deleteAuthor.emit(author);
  }
}
