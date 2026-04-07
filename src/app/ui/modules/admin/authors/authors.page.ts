import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { LucideAngularModule, Plus } from 'lucide-angular';
import { AuthorController } from '../../../../controllers/author.controller';
import { CreateAuthorModalController } from '../../../../controllers/create-author-modal.controller';
import { ToastService } from '../../../../services/toast.service';
import type { Author } from '../../../../types/author.type';
import { ButtonVariant } from '../../../design_system/atoms/button/button-variant';
import { ButtonComponent } from '../../../design_system/atoms/button/button.component';
import { SearchFieldComponent } from '../../../design_system/molecules/search-field/search-field.component';
import { PaginationControlsComponent } from '../../../design_system/organisms/pagination-controls/pagination-controls.component';
import { AdminLayoutComponent } from '../../../design_system/templates/admin-layout/admin-layout.component';
import { AuthorsTableComponent } from '../organisms/authors-table/authors-table.component';
import { CreateAuthorModalComponent } from '../organisms/create-author-modal/create-author-modal.component';

@Component({
  selector: 'app-authors-page',
  standalone: true,
  imports: [
    AdminLayoutComponent,
    SearchFieldComponent,
    AuthorsTableComponent,
    PaginationControlsComponent,
    ButtonComponent,
    LucideAngularModule,
    CreateAuthorModalComponent,
  ],
  template: `
    @if (createAuthorModal.isOpen()) {
      <app-create-author-modal />
    }
    <app-admin-layout>
      <div class="authors-page">
        <header class="authors-page__header">
          <div class="authors-page__title-section">
            <h1 class="authors-page__title">Autores</h1>
            <p class="authors-page__subtitle">Gerencie os autores de animes do Clocktale</p>
          </div>
          <app-button [variant]="ButtonVariantPrimary" (clicked)="addNewAuthor()">
            <lucide-angular leading [img]="PlusIcon" [size]="20" />
            Adicionar novo autor
          </app-button>
        </header>

        <div class="authors-page__search">
          <app-search-field
            placeholder="Pesquise pelo nome do autor"
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
            itemLabel="autores"
            (pageChanged)="onPageChanged($event)"
          />
        </div>
      </div>
    </app-admin-layout>
  `,
  styleUrl: './authors.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthorsPage implements OnInit {
  protected readonly controller = inject(AuthorController);
  protected readonly createAuthorModal = inject(CreateAuthorModalController);
  private readonly toastService = inject(ToastService);

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
    console.log('Edit author:', author);
  }

  onDeleteAuthor(author: Author): void {
    this.controller.deleteAuthor(author.id);
    this.toastService.show({
      message: `Autor "${author.name}" foi deletado`,
      variant: 'success',
    });
  }
}
