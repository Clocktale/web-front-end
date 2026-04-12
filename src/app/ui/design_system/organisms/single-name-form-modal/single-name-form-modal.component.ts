import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  input,
  output,
} from '@angular/core';
import { LucideAngularModule, X } from 'lucide-angular';

import { ButtonComponent } from '../../atoms/button/button.component';
import { ButtonVariant } from '../../atoms/button/button-variant';
import { InfoCalloutComponent } from '../../molecules/info-callout/info-callout.component';
import { TextFieldComponent } from '../../molecules/text-field/text-field.component';

@Component({
  selector: 'app-single-name-form-modal',
  standalone: true,
  imports: [
    LucideAngularModule,
    ButtonComponent,
    TextFieldComponent,
    InfoCalloutComponent,
  ],
  template: `
    <div
      class="single-name-form-modal__backdrop"
      role="presentation"
      (click)="onBackdropClick($event)"
    >
      <div
        class="single-name-form-modal__panel"
        role="dialog"
        aria-modal="true"
        [attr.aria-labelledby]="titleId()"
        (click)="$event.stopPropagation()"
      >
        <header class="single-name-form-modal__header">
          <h2 [id]="titleId()" class="single-name-form-modal__title">
            {{ title() }}
          </h2>
          <button
            type="button"
            class="single-name-form-modal__close"
            [disabled]="submitting()"
            (click)="closeRequested.emit()"
            aria-label="Fechar"
          >
            <lucide-angular [img]="CloseIcon" [size]="28" aria-hidden="true" />
          </button>
        </header>

        <div class="single-name-form-modal__divider" role="separator"></div>

        <div class="single-name-form-modal__body">
          <app-text-field
            [label]="fieldLabel()"
            [placeholder]="placeholder()"
            type="text"
            [value]="fieldValue()"
            (valueChanged)="fieldValueChange.emit($event)"
            [loading]="submitting()"
          />
          @if (bannerMessage().trim()) {
            <div class="single-name-form-modal__banner">
              <app-info-callout [message]="bannerMessage()" />
            </div>
          }
        </div>

        <footer class="single-name-form-modal__footer">
          <app-button
            [variant]="ButtonVariantSecondary"
            [loading]="submitting()"
            (clicked)="closeRequested.emit()"
          >
            {{ cancelLabel() }}
          </app-button>
          <app-button
            [variant]="ButtonVariantPrimary"
            [disabled]="primaryDisabled()"
            [loading]="submitting()"
            (clicked)="primaryAction.emit()"
          >
            {{ primaryLabel() }}
          </app-button>
        </footer>
      </div>
    </div>
  `,
  styleUrl: './single-name-form-modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SingleNameFormModalComponent {
  title = input.required<string>();
  titleId = input.required<string>();
  fieldLabel = input.required<string>();
  placeholder = input.required<string>();
  primaryLabel = input.required<string>();
  cancelLabel = input<string>('Cancelar');
  fieldValue = input.required<string>();
  bannerMessage = input<string>('');
  submitting = input(false);
  primaryDisabled = input(false);

  closeRequested = output<void>();
  primaryAction = output<void>();
  fieldValueChange = output<string>();

  protected readonly ButtonVariantPrimary = ButtonVariant.Primary;
  protected readonly ButtonVariantSecondary = ButtonVariant.Secondary;
  protected readonly CloseIcon = X;

  @HostListener('document:keydown', ['$event'])
  onDocumentKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Escape') {
      return;
    }
    if (this.submitting()) {
      return;
    }
    event.preventDefault();
    this.closeRequested.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    if (this.submitting()) {
      return;
    }
    if (event.target === event.currentTarget) {
      this.closeRequested.emit();
    }
  }
}
