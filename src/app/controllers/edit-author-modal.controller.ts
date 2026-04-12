import { Injectable, inject, signal, computed } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { finalize } from 'rxjs/operators';

import { AuthorController } from './author.controller';
import { UpdateAuthorUseCase } from '../use-cases/authors/update-author.use-case';
import { ToastService } from '../services/toast.service';
import type { Author } from '../types/author.type';
import { resolveUserFacingErrorMessage } from '../utils/error-handling/resolve-user-facing-error';

@Injectable({ providedIn: 'root' })
export class EditAuthorModalController {
  private readonly updateAuthorUseCase = inject(UpdateAuthorUseCase);
  private readonly authorController = inject(AuthorController);
  private readonly toastService = inject(ToastService);
  private readonly transloco = inject(TranslocoService);

  readonly isOpen = signal(false);
  readonly authorId = signal<number | null>(null);
  readonly name = signal('');
  readonly submitting = signal(false);

  readonly isNameValid = computed(() => this.name().trim().length >= 3);

  open(author: Author): void {
    this.authorId.set(author.id);
    this.name.set(author.name);
    this.isOpen.set(true);
  }

  close(): void {
    if (this.submitting()) {
      return;
    }
    this.isOpen.set(false);
    this.authorId.set(null);
    this.name.set('');
  }

  setName(value: string): void {
    this.name.set(value);
  }

  submit(): void {
    const id = this.authorId();
    if (this.submitting() || !this.isNameValid() || id === null) {
      return;
    }

    const trimmed = this.name().trim();

    this.submitting.set(true);
    this.updateAuthorUseCase
      .execute(id, { name: trimmed })
      .pipe(finalize(() => this.submitting.set(false)))
      .subscribe({
        next: (author) => {
          this.toastService.show({
            message: this.transloco.translate('admin.authors.editAuthorSuccess', {
              name: author.name,
            }),
            variant: 'success',
          });
          this.isOpen.set(false);
          this.authorId.set(null);
          this.name.set('');
          this.authorController.loadAuthors();
        },
        error: (err: unknown) => {
          this.toastService.show({
            message: resolveUserFacingErrorMessage(
              err,
              (key) => this.transloco.translate(key),
              'admin.authors.editAuthorError'
            ),
            variant: 'error',
          });
        },
      });
  }
}
