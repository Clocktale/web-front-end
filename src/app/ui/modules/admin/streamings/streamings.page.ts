import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { LucideAngularModule, Plus } from 'lucide-angular';
import { StreamingController } from '../../../../controllers/streaming.controller';
import type { Streaming } from '../../../../types/streaming.type';
import { ButtonVariant } from '../../../design_system/atoms/button/button-variant';
import { ButtonComponent } from '../../../design_system/atoms/button/button.component';
import { SearchFieldComponent } from '../../../design_system/molecules/search-field/search-field.component';
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
  ],
  template: `
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
}
