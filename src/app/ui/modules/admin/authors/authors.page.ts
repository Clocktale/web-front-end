import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { LucideAngularModule, Plus } from 'lucide-angular';
import { AuthorController } from '../../../../controllers/author.controller';
import { CreateAuthorModalController } from '../../../../controllers/create-author-modal.controller';
import { EditAuthorModalController } from '../../../../controllers/edit-author-modal.controller';
import type { Author } from '../../../../types/author.type';
import { ButtonVariant } from '../../../design_system/atoms/button/button-variant';
import { ButtonComponent } from '../../../design_system/atoms/button/button.component';
import { SearchFieldComponent } from '../../../design_system/molecules/search-field/search-field.component';
import { ConfirmDeletionModalComponent } from '../../../design_system/organisms/confirm-deletion-modal/confirm-deletion-modal.component';
import { PaginationControlsComponent } from '../../../design_system/organisms/pagination-controls/pagination-controls.component';
import { AuthorsTableComponent } from '../organisms/authors-table/authors-table.component';
import { CreateAuthorModalComponent } from '../organisms/create-author-modal/create-author-modal.component';
import { EditAuthorModalComponent } from '../organisms/edit-author-modal/edit-author-modal.component';

@Component({
  selector: 'app-authors-page',
  standalone: true,
  imports: [
    SearchFieldComponent,
    AuthorsTableComponent,
    PaginationControlsComponent,
    ButtonComponent,
    LucideAngularModule,
    TranslocoModule,
    CreateAuthorModalComponent,
    EditAuthorModalComponent,
    ConfirmDeletionModalComponent,
  ],
  template: `
    @if (authorPendingDelete(); as pending) {
      <app-confirm-deletion-modal
        titleId="admin-delete-author-confirm-title"
        [title]="'admin.authors.deleteConfirmTitle' | transloco: { name: pending.name }"
        [bodyText]="'admin.authors.deleteConfirmBody' | transloco"
        [bannerMessage]="'admin.authors.deleteConfirmBanner' | transloco"
        [cancelLabel]="'admin.authors.deleteConfirmCancel' | transloco"
        [confirmLabel]="'admin.authors.deleteConfirmDelete' | transloco"
        (cancelRequested)="onDeleteModalClosed()"
        (confirmRequested)="onDeleteModalConfirm(pending)"
      />
    }
    @if (createAuthorModal.isOpen()) {
      <app-create-author-modal />
    }
    @if (editAuthorModal.isOpen()) {
      <app-edit-author-modal />
    }
    <ng-container *transloco="let t; prefix: 'admin.authors'">
      <div class="authors-page">
        <header class="authors-page__header">
          <div class="authors-page__title-section">
            <h1 class="authors-page__title">{{ t('pageTitle') }}</h1>
            <p class="authors-page__subtitle">{{ t('pageSubtitle') }}</p>
          </div>
          <app-button [variant]="ButtonVariantPrimary" (clicked)="addNewAuthor()">
            <lucide-angular leading [img]="PlusIcon" [size]="20" />
            {{ t('addNewAuthorButton') }}
          </app-button>
        </header>

        <div class="authors-page__search">
          <app-search-field
            [placeholder]="t('searchPlaceholder')"
            (searchChanged)="onSearchChanged($event)"
          />
        </div>

        <div class="authors-page__content">
          <app-authors-table
            [authors]="controller.authors()"
            [loading]="controller.loading()"
            (editAuthor)="onEditAuthor($event)"
            (deleteAuthor)="onDeleteAuthor($event)"
          />

          <app-pagination-controls
            [currentPage]="controller.currentPage()"
            [totalItems]="controller.totalItems()"
            [pageSize]="controller.pageSize()"
            [loading]="controller.loading()"
            [itemLabel]="'admin.authors.paginationItemLabel' | transloco"
            (pageChanged)="onPageChanged($event)"
          />
        </div>
      </div>
    </ng-container>
  `,
  styleUrl: './authors.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthorsPage implements OnInit {
  protected readonly controller = inject(AuthorController);
  protected readonly createAuthorModal = inject(CreateAuthorModalController);
  protected readonly editAuthorModal = inject(EditAuthorModalController);

  /** Autor aguardando confirmação de exclusão; `null` quando o modal está fechado. */
  protected readonly authorPendingDelete = signal<Author | null>(null);

  protected readonly ButtonVariantPrimary = ButtonVariant.Primary;
  protected readonly PlusIcon = Plus;

  ngOnInit(): void {
    this.controller.loadAuthors();
  }

  onSearchChanged(query: string): void {
    this.controller.searchAuthors(query);
  }

  onPageChanged(page: number): void {
    this.controller.changePage(page);
  }

  addNewAuthor(): void {
    this.createAuthorModal.open();
  }

  onEditAuthor(author: Author): void {
    this.editAuthorModal.open(author);
  }

  onDeleteAuthor(author: Author): void {
    this.authorPendingDelete.set(author);
  }

  onDeleteModalClosed(): void {
    this.authorPendingDelete.set(null);
  }

  onDeleteModalConfirm(author: Author): void {
    this.controller.deleteAuthor(author);
    this.authorPendingDelete.set(null);
  }
}
