import {
  Component,
  input,
  output,
  inject,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Pencil, Trash2 } from 'lucide-angular';
import type { Author } from '../../../../../types/author.type';
import { ToastService } from '../../../../../services/toast.service';

@Component({
  selector: 'app-authors-table',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="authors-table">
      <table class="authors-table__table">
        <thead class="authors-table__header">
          <tr>
            <th class="authors-table__header-cell">Nome do autor</th>
            <th class="authors-table__header-cell authors-table__header-cell--actions">
              Ações
            </th>
          </tr>
        </thead>
        <tbody class="authors-table__body">
          @if (authors().length === 0 && !loading()) {
            <tr>
              <td colspan="2" class="authors-table__empty">
                Nenhum autor encontrado
              </td>
            </tr>
          }
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
                    aria-label="Editar autor"
                  >
                    <lucide-angular [img]="PencilIcon" [size]="18" />
                  </button>
                  <button
                    type="button"
                    class="authors-table__action-button authors-table__action-button--danger"
                    (click)="onDelete(author)"
                    [disabled]="loading()"
                    aria-label="Deletar autor"
                  >
                    <lucide-angular [img]="Trash2Icon" [size]="18" />
                  </button>
                </div>
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
  styleUrl: './authors-table.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthorsTableComponent {
  private readonly toastService = inject(ToastService);

  authors = input.required<Author[]>();
  loading = input(false);

  editAuthor = output<Author>();
  deleteAuthor = output<Author>();

  protected readonly PencilIcon = Pencil;
  protected readonly Trash2Icon = Trash2;

  onEdit(author: Author): void {
    this.toastService.show({
      message: 'EDIT ACTION - NOT IMPLEMENTED YET',
      variant: 'info',
    });
    this.editAuthor.emit(author);
  }

  onDelete(author: Author): void {
    this.toastService.show({
      message: 'DELETE ACTION - NOT IMPLEMENTED YET',
      variant: 'info',
    });
    this.deleteAuthor.emit(author);
  }
}
