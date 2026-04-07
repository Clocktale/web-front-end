import {
  Component,
  inject,
  ChangeDetectionStrategy,
  HostListener,
} from '@angular/core';
import { LucideAngularModule, X } from 'lucide-angular';

import { CreateAuthorModalController } from '../../../../../controllers/create-author-modal.controller';
import { ButtonComponent } from '../../../../design_system/atoms/button/button.component';
import { ButtonVariant } from '../../../../design_system/atoms/button/button-variant';
import { TextFieldComponent } from '../../../../design_system/molecules/text-field/text-field.component';

@Component({
  selector: 'app-create-author-modal',
  standalone: true,
  imports: [
    LucideAngularModule,
    ButtonComponent,
    TextFieldComponent,
  ],
  template: `
    <div
      class="create-author-modal__backdrop"
      role="presentation"
      (click)="onBackdropClick($event)"
    >
      <div
        class="create-author-modal__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-author-modal-title"
        (click)="$event.stopPropagation()"
      >
        <header class="create-author-modal__header">
          <h2 id="create-author-modal-title" class="create-author-modal__title">
            Novo autor
          </h2>
          <button
            type="button"
            class="create-author-modal__close"
            [disabled]="modal.submitting()"
            (click)="modal.close()"
            aria-label="Fechar"
          >
            <lucide-angular [img]="CloseIcon" [size]="28" aria-hidden="true" />
          </button>
        </header>

        <div class="create-author-modal__divider" role="separator"></div>

        <div class="create-author-modal__body">
          <app-text-field
            label="Nome do autor"
            placeholder="Insira aqui o nome do autor"
            type="text"
            [value]="modal.name()"
            (valueChanged)="modal.setName($event)"
            [loading]="modal.submitting()"
          />
        </div>

        <footer class="create-author-modal__footer">
          <app-button
            [variant]="ButtonVariantSecondary"
            [loading]="modal.submitting()"
            (clicked)="modal.close()"
          >
            Cancelar
          </app-button>
          <app-button
            [variant]="ButtonVariantPrimary"
            [disabled]="!modal.isNameValid()"
            [loading]="modal.submitting()"
            (clicked)="modal.submit()"
          >
            Adicionar
          </app-button>
        </footer>
      </div>
    </div>
  `,
  styleUrl: './create-author-modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateAuthorModalComponent {
  protected readonly modal = inject(CreateAuthorModalController);
  protected readonly ButtonVariantPrimary = ButtonVariant.Primary;
  protected readonly ButtonVariantSecondary = ButtonVariant.Secondary;
  protected readonly CloseIcon = X;

  @HostListener('document:keydown', ['$event'])
  onDocumentKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Escape') {
      return;
    }
    if (!this.modal.isOpen() || this.modal.submitting()) {
      return;
    }
    event.preventDefault();
    this.modal.close();
  }

  onBackdropClick(event: MouseEvent): void {
    if (this.modal.submitting()) {
      return;
    }
    if (event.target === event.currentTarget) {
      this.modal.close();
    }
  }
}
