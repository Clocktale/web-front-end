import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, of, delay, map, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import type { Author, AuthorCreateInput } from '../../types/author.type';
import type {
  ApiAuthorCreateRequestBody,
  ApiAuthorCreateResponse,
} from '../responses/author-create-api.type';
import { EnvelopeFailureError, FieldValidationError } from '../../errors';
import {
  extractApiMessage,
  extractEnvelopeFailureMessage,
  extractFieldValidationErrors,
  mapHttpErrorResponse,
} from '../http';
import { BaseApiRepository } from './base-api.repository';
import { AuthorMapper } from '../mappers/author.mapper';

@Injectable({ providedIn: 'root' })
export class AdminAuthorRepository extends BaseApiRepository {
  /** Mock até existirem endpoints admin de update/delete. */
  private mockAuthors: { id: number; name: string }[] = [
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

  constructor() {
    super('admin/authors');
  }

  create(author: AuthorCreateInput): Observable<Author> {
    const body: ApiAuthorCreateRequestBody = { name: author.name };
    return this.http
      .post<ApiAuthorCreateResponse>(this.getEndpoint(), body)
      .pipe(
        map((response) => this.mapCreateResponse(response)),
        catchError((err: unknown) => this.handleCreateError(err))
      );
  }

  private mapCreateResponse(response: unknown): Author {
    if (response === null || typeof response !== 'object') {
      throw new EnvelopeFailureError('Invalid server response.');
    }

    const envelopeMsg = extractEnvelopeFailureMessage(response);
    if (envelopeMsg !== null) {
      throw new EnvelopeFailureError(envelopeMsg);
    }

    const r = response as Partial<ApiAuthorCreateResponse>;
    if (!r.success || r.data === undefined || r.data === null) {
      const fallback = extractApiMessage(response) ?? 'Could not create author';
      throw new EnvelopeFailureError(fallback);
    }

    const domain = AuthorMapper.toDomain(r.data);
    if (!domain) {
      throw new EnvelopeFailureError('Invalid author data in response.');
    }
    return domain;
  }

  private handleCreateError(err: unknown): Observable<never> {
    if (err instanceof HttpErrorResponse && err.status === 422) {
      const fieldErrors = extractFieldValidationErrors(err.error);
      if (fieldErrors !== null && Object.keys(fieldErrors).length > 0) {
        const message = extractApiMessage(err.error) ?? 'Validation failed';
        return throwError(
          () => new FieldValidationError(message, fieldErrors)
        );
      }
    }
    if (err instanceof HttpErrorResponse) {
      return throwError(() => mapHttpErrorResponse(err));
    }
    return throwError(() =>
      err instanceof Error ? err : new EnvelopeFailureError('Could not create author')
    );
  }

  update(id: number, author: Partial<Author>): Observable<Author | null> {
    const index = this.mockAuthors.findIndex((a) => a.id === id);
    if (index === -1) {
      throw new Error(`Author with id ${id} not found`);
    }
    this.mockAuthors[index] = { ...this.mockAuthors[index], ...author };
    return of(this.mockAuthors[index]).pipe(
      delay(300),
      map((raw) => AuthorMapper.toDomain(raw))
    );
  }

  delete(id: number): Observable<void> {
    const index = this.mockAuthors.findIndex((a) => a.id === id);
    if (index === -1) {
      throw new Error(`Author with id ${id} not found`);
    }
    this.mockAuthors.splice(index, 1);
    return of(void 0).pipe(delay(300));
  }
}
