import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { LucideAngularModule, Plus } from 'lucide-angular';
import { StreamingController } from '../../../../controllers/streaming.controller';
import type { Streaming } from '../../../../types/streaming.type';
import { ButtonVariant } from '../../../design_system/atoms/button/button-variant';
import { ButtonComponent } from '../../../design_system/atoms/button/button.component';
import { SearchFieldComponent } from '../../../design_system/molecules/search-field/search-field.component';
import { ConfirmDeletionModalComponent } from '../../../design_system/organisms/confirm-deletion-modal/confirm-deletion-modal.component';
import { PaginationControlsComponent } from '../../../design_system/organisms/pagination-controls/pagination-controls.component';
import { StreamingDetailsModalComponent } from '../organisms/streaming-details-modal/streaming-details-modal.component';
import { StreamingsTableComponent } from '../organisms/streamings-table/streamings-table.component';

@Component({
  selector: 'app-streamings-page',
  standalone: true,
  imports: [
    SearchFieldComponent,
    StreamingsTableComponent,
    PaginationControlsComponent,
    ButtonComponent,
    LucideAngularModule,
    TranslocoModule,
    StreamingDetailsModalComponent,
    ConfirmDeletionModalComponent,
  ],
  template: `
    @if (streamingPendingDelete(); as pending) {
      <app-confirm-deletion-modal
        titleId="admin-delete-streaming-confirm-title"
        [title]="'admin.streamings.deleteConfirmTitle' | transloco: { name: pending.name }"
        [bodyText]="'admin.streamings.deleteConfirmBody' | transloco"
        [bannerMessage]="'admin.streamings.deleteConfirmBanner' | transloco"
        [cancelLabel]="'admin.streamings.deleteConfirmCancel' | transloco"
        [confirmLabel]="'admin.streamings.deleteConfirmDelete' | transloco"
        (cancelRequested)="onDeleteModalClosed()"
        (confirmRequested)="onDeleteModalConfirm(pending)"
      />
    }
    @if (controller.selectedStreaming(); as selected) {
      <app-streaming-details-modal
        [streaming]="selected"
        (closed)="onDetailsClosed()"
      />
    }
    <ng-container *transloco="let t; prefix: 'admin.streamings'">
      <div class="streamings-page">
        <header class="streamings-page__header">
          <div class="streamings-page__title-section">
            <h1 class="streamings-page__title">{{ t('pageTitle') }}</h1>
            <p class="streamings-page__subtitle">{{ t('pageSubtitle') }}</p>
          </div>
          <span class="streamings-page__add-hint" [attr.title]="t('addButtonDisabledTitle')">
            <app-button
              [variant]="ButtonVariantPrimary"
              [disabled]="true"
              [ariaLabel]="t('addButtonDisabledAriaLabel')"
            >
              <lucide-angular leading [img]="PlusIcon" [size]="20" />
              {{ t('addNewButton') }}
            </app-button>
          </span>
        </header>

        <div class="streamings-page__search">
          <app-search-field
            [placeholder]="t('searchPlaceholder')"
            (searchChanged)="onSearchChanged($event)"
          />
        </div>

        <div class="streamings-page__content">
          <app-streamings-table
            [streamings]="controller.streamings()"
            [loading]="controller.loading()"
            (rowSelected)="onRowSelected($event)"
            (deleteStreaming)="onDeleteStreaming($event)"
          />

          <app-pagination-controls
            [currentPage]="controller.currentPage()"
            [totalItems]="controller.totalItems()"
            [pageSize]="controller.pageSize()"
            [loading]="controller.loading()"
            [itemLabel]="'admin.streamings.paginationItemLabel' | transloco"
            (pageChanged)="onPageChanged($event)"
          />
        </div>
      </div>
    </ng-container>
  `,
  styleUrl: './streamings.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StreamingsPage implements OnInit {
  protected readonly controller = inject(StreamingController);

  protected readonly streamingPendingDelete = signal<Streaming | null>(null);

  protected readonly ButtonVariantPrimary = ButtonVariant.Primary;
  protected readonly PlusIcon = Plus;

  ngOnInit(): void {
    this.controller.loadStreamings();
  }

  onSearchChanged(query: string): void {
    this.controller.searchStreamings(query);
  }

  onPageChanged(page: number): void {
    this.controller.changePage(page);
  }

  onRowSelected(streaming: Streaming): void {
    this.controller.openDetails(streaming);
  }

  onDetailsClosed(): void {
    this.controller.closeDetails();
  }

  onDeleteStreaming(streaming: Streaming): void {
    this.streamingPendingDelete.set(streaming);
  }

  onDeleteModalClosed(): void {
    this.streamingPendingDelete.set(null);
  }

  onDeleteModalConfirm(streaming: Streaming): void {
    this.controller.deleteStreaming(streaming);
    this.streamingPendingDelete.set(null);
  }
}
