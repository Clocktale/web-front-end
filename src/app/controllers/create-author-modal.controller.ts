import { Injectable, inject, signal, computed } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { finalize } from 'rxjs/operators';

import { AuthorController } from './author.controller';
import { CreateAuthorUseCase } from '../use-cases/authors/create-author.use-case';
import { ToastService } from '../services/toast.service';
import type { AuthorCreateInput } from '../types/author.type';
import { resolveUserFacingErrorMessage } from '../utils/error-handling/resolve-user-facing-error';

@Injectable({ providedIn: 'root' })
export class CreateAuthorModalController {
  private readonly createAuthorUseCase = inject(CreateAuthorUseCase);
  private readonly authorController = inject(AuthorController);
  private readonly toastService = inject(ToastService);
  private readonly transloco = inject(TranslocoService);

  readonly isOpen = signal(false);
  readonly name = signal('');
  readonly submitting = signal(false);

  readonly isNameValid = computed(() => this.name().trim().length >= 3);

  open(): void {
    this.isOpen.set(true);
  }

  close(): void {
    if (this.submitting()) {
      return;
    }
    this.isOpen.set(false);
    this.name.set('');
  }

  setName(value: string): void {
    this.name.set(value);
  }

  submit(): void {
    if (this.submitting() || !this.isNameValid()) {
      return;
    }

    const trimmed = this.name().trim();
    const input: AuthorCreateInput = { name: trimmed };

    this.submitting.set(true);
    this.createAuthorUseCase
      .execute(input)
      .pipe(finalize(() => this.submitting.set(false)))
      .subscribe({
        next: author => {
          this.toastService.show({
            message: this.transloco.translate('admin.authors.createAuthorSuccess', {
              name: author.name,
            }),
            variant: 'success',
          });
          this.isOpen.set(false);
          this.name.set('');
          this.authorController.loadAuthors();
        },
        error: (err: unknown) => {
          this.toastService.show({
            message: resolveUserFacingErrorMessage(
              err,
              key => this.transloco.translate(key),
              'admin.authors.createAuthorError'
            ),
            variant: 'error',
          });
        },
      });
  }
}
