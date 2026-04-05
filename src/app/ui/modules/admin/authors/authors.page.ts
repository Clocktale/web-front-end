import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { LucideAngularModule, Plus } from 'lucide-angular';
import { AdminLayoutComponent } from '../../../design_system/templates/admin-layout/admin-layout.component';
import { SearchFieldComponent } from '../../../design_system/molecules/search-field/search-field.component';
import { AuthorsTableComponent } from '../organisms/authors-table/authors-table.component';
import { PaginationControlsComponent } from '../../../design_system/organisms/pagination-controls/pagination-controls.component';
import { ButtonComponent } from '../../../design_system/atoms/button/button.component';
import { ButtonVariant } from '../../../design_system/atoms/button/button-variant';
import { AuthorController } from '../../../../controllers/author.controller';
import type { Author } from '../../../../types/author.type';
import { ToastService } from '../../../../services/toast.service';

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
  ],
  template: `
    <app-admin-layout>
      <div class="authors-page">
        <header class="authors-page__header">
          <div class="authors-page__title-section">
            <h1 class="authors-page__title">Autores</h1>
            <p class="authors-page__subtitle">
              Gerencie os autores de animes do Clocktale
            </p>
          </div>
          <app-button
            [variant]="ButtonVariantPrimary"
            (clicked)="addNewAuthor()"
          >
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
    this.toastService.show({
      message: 'ADD AUTHOR - NOT IMPLEMENTED YET',
      variant: 'info',
    });
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
