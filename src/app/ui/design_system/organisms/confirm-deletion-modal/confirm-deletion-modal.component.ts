import {
  ChangeDetectionStrategy,
  Component,
  computed,
  HostListener,
  input,
  output,
} from '@angular/core';
import { AlertTriangle, LucideAngularModule } from 'lucide-angular';

import { ButtonComponent } from '../../atoms/button/button.component';
import { ButtonVariant } from '../../atoms/button/button-variant';
import { InfoCalloutComponent } from '../../molecules/info-callout/info-callout.component';

@Component({
  selector: 'app-confirm-deletion-modal',
  standalone: true,
  imports: [LucideAngularModule, ButtonComponent, InfoCalloutComponent],
  template: `
    <div
      class="confirm-deletion-modal__backdrop"
      role="presentation"
      (click)="onBackdropClick($event)"
    >
      <div
        class="confirm-deletion-modal__panel"
        role="dialog"
        aria-modal="true"
        [attr.aria-labelledby]="titleId()"
        [attr.aria-describedby]="bodyDescriptionId()"
        (click)="$event.stopPropagation()"
      >
        <div class="confirm-deletion-modal__content">
          <div class="confirm-deletion-modal__title-block">
            <span class="confirm-deletion-modal__icon-wrap" aria-hidden="true">
              <lucide-angular [img]="WarningIcon" [size]="40" />
            </span>
            <h2 [id]="titleId()" class="confirm-deletion-modal__title">
              {{ title() }}
            </h2>
          </div>

          <div class="confirm-deletion-modal__middle">
            <p [id]="bodyDescriptionId()" class="confirm-deletion-modal__body">
              {{ bodyText() }}
            </p>
            @if (resolvedBanner(); as banner) {
              <div class="confirm-deletion-modal__banner">
                <app-info-callout [message]="banner" />
              </div>
            }
          </div>

          <div class="confirm-deletion-modal__footer">
            <app-button
              [variant]="ButtonVariantSecondary"
              [fullWidth]="true"
              [loading]="loading()"
              (clicked)="cancelRequested.emit()"
            >
              {{ cancelLabel() }}
            </app-button>
            <app-button
              [variant]="ButtonVariantCritical"
              [fullWidth]="true"
              [loading]="loading()"
              (clicked)="confirmRequested.emit()"
            >
              {{ confirmLabel() }}
            </app-button>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrl: './confirm-deletion-modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmDeletionModalComponent {
  /** Texto do título (ex.: pergunta com nome da entidade). */
  title = input.required<string>();
  /** Id único para `aria-labelledby` (estável na página). */
  titleId = input.required<string>();
  /** Parágrafo de corpo obrigatório. */
  bodyText = input.required<string>();
  /** Texto do banner informativo; omitir ou vazio = não exibe. */
  bannerMessage = input<string | undefined>(undefined);
  cancelLabel = input<string>('Cancelar');
  confirmLabel = input<string>('Deletar');
  loading = input(false);

  cancelRequested = output<void>();
  confirmRequested = output<void>();

  protected readonly ButtonVariantSecondary = ButtonVariant.Secondary;
  protected readonly ButtonVariantCritical = ButtonVariant.Critical;
  protected readonly WarningIcon = AlertTriangle;

  readonly bodyDescriptionId = computed(() => `${this.titleId()}-description`);

  /** Texto do banner após trim; `null` quando não deve ser exibido. */
  readonly resolvedBanner = computed(() => {
    const raw = this.bannerMessage();
    const text = raw?.trim();
    return text ? text : null;
  });

  @HostListener('document:keydown', ['$event'])
  onDocumentKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Escape') {
      return;
    }
    if (this.loading()) {
      return;
    }
    event.preventDefault();
    this.cancelRequested.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    if (this.loading()) {
      return;
    }
    if (event.target === event.currentTarget) {
      this.cancelRequested.emit();
    }
  }
}
