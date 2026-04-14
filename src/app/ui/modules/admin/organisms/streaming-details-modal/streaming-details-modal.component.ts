import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  input,
  output,
} from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { LucideAngularModule, X } from 'lucide-angular';

import { ButtonComponent } from '../../../../design_system/atoms/button/button.component';
import { ButtonVariant } from '../../../../design_system/atoms/button/button-variant';
import type { Streaming } from '../../../../../types/streaming.type';

@Component({
  selector: 'app-streaming-details-modal',
  standalone: true,
  imports: [LucideAngularModule, ButtonComponent, TranslocoModule],
  template: `
    <ng-container *transloco="let t; prefix: 'admin.streamings'">
      <div
        class="streaming-details-modal__backdrop"
        role="presentation"
        (click)="onBackdropClick($event)"
      >
        <div
          class="streaming-details-modal__panel"
          role="dialog"
          aria-modal="true"
          aria-labelledby="streaming-details-modal-title"
          (click)="$event.stopPropagation()"
        >
          <header class="streaming-details-modal__header">
            <h2 id="streaming-details-modal-title" class="streaming-details-modal__title">
              {{ streaming().name }}
            </h2>
            <button
              type="button"
              class="streaming-details-modal__close"
              (click)="closed.emit()"
              [attr.aria-label]="t('detailsCloseAriaLabel')"
            >
              <lucide-angular [img]="CloseIcon" [size]="28" aria-hidden="true" />
            </button>
          </header>

          <div class="streaming-details-modal__divider" role="separator"></div>

          <div class="streaming-details-modal__body">
            <p class="streaming-details-modal__label">{{ t('detailsUrlLabel') }}</p>
            <a
              class="streaming-details-modal__link"
              [href]="streaming().url"
              target="_blank"
              rel="noopener noreferrer"
            >
              {{ streaming().url }}
            </a>
          </div>

          <footer class="streaming-details-modal__footer">
            <app-button [variant]="ButtonVariantSecondary" (clicked)="closed.emit()">
              {{ t('detailsCloseButton') }}
            </app-button>
          </footer>
        </div>
      </div>
    </ng-container>
  `,
  styleUrl: './streaming-details-modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StreamingDetailsModalComponent {
  streaming = input.required<Streaming>();

  closed = output<void>();

  protected readonly ButtonVariantSecondary = ButtonVariant.Secondary;
  protected readonly CloseIcon = X;

  @HostListener('document:keydown', ['$event'])
  onDocumentKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Escape') {
      return;
    }
    event.preventDefault();
    this.closed.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.closed.emit();
    }
  }
}
