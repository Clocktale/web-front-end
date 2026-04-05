import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import type {
  Author,
  AuthorCreateInput,
  AuthorListQuery,
  AuthorPaginatedResult,
  AuthorSearchQuery,
} from '../types/author.type';

@Injectable({ providedIn: 'root' })
export class AuthorRepository {
  private mockAuthors: Author[] = [
    { id: 1, name: 'Akira Toriyama' },
    { id: 2, name: 'Eiichiro Oda' },
    { id: 3, name: 'Gege Akutami' },
    { id: 4, name: 'Masashi Kishimoto' },
    { id: 5, name: 'Osamu Tezuka' },
    { id: 6, name: 'Yoshihiro Togashi' },
    { id: 7, name: 'Kentaro Miura' },
    { id: 8, name: 'Hajime Isayama' },
    { id: 9, name: 'Naoki Urasawa' },
    { id: 10, name: 'Takehiko Inoue' },
  ];

  getAll(options?: AuthorListQuery): Observable<AuthorPaginatedResult> {
    const page = options?.page ?? 1;
    const pageSize = options?.pageSize ?? 6;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;

    const paginatedAuthors = this.mockAuthors.slice(start, end);

    return of({
      authors: paginatedAuthors,
      total: this.mockAuthors.length,
    }).pipe(delay(300));
  }

  search(options: AuthorSearchQuery): Observable<AuthorPaginatedResult> {
    const query = options.query.toLowerCase().trim();
    const page = options.page ?? 1;
    const pageSize = options.pageSize ?? 6;

    if (!query) {
      return this.getAll({ page, pageSize });
    }

    const filtered = this.mockAuthors.filter(author =>
      author.name.toLowerCase().includes(query)
    );

    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedAuthors = filtered.slice(start, end);

    return of({
      authors: paginatedAuthors,
      total: filtered.length,
    }).pipe(delay(300));
  }

  create(author: AuthorCreateInput): Observable<Author> {
    const newAuthor: Author = {
      id: Math.max(...this.mockAuthors.map(a => a.id)) + 1,
      ...author,
    };
    this.mockAuthors.push(newAuthor);
    return of(newAuthor).pipe(delay(300));
  }

  update(id: number, author: Partial<Author>): Observable<Author> {
    const index = this.mockAuthors.findIndex(a => a.id === id);
    if (index === -1) {
      throw new Error(`Author with id ${id} not found`);
    }
    this.mockAuthors[index] = { ...this.mockAuthors[index], ...author };
    return of(this.mockAuthors[index]).pipe(delay(300));
  }

  delete(id: number): Observable<void> {
    const index = this.mockAuthors.findIndex(a => a.id === id);
    if (index === -1) {
      throw new Error(`Author with id ${id} not found`);
    }
    this.mockAuthors.splice(index, 1);
    return of(void 0).pipe(delay(300));
  }
}
