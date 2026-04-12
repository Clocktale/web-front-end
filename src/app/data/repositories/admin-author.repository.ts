import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { EntityNotFoundError, EnvelopeFailureError, FieldValidationError } from '../../errors';
import type { Author, AuthorCreateInput } from '../../types/author.type';
import {
  extractApiMessage,
  extractEnvelopeFailureMessage,
  extractFieldValidationErrors,
  mapHttpErrorResponse,
} from '../http';
import { AuthorMapper } from '../mappers/author.mapper';
import type {
  ApiAuthorCreateRequestBody,
  ApiAuthorCreateResponse,
} from '../responses/author-create-api.type';
import { BaseApiRepository } from './base-api.repository';

@Injectable({ providedIn: 'root' })
export class AdminAuthorRepository extends BaseApiRepository {
  constructor() {
    super('admin/authors');
  }

  create(author: AuthorCreateInput): Observable<Author> {
    const body: ApiAuthorCreateRequestBody = { name: author.name };
    return this.http.post<ApiAuthorCreateResponse>(this.getEndpoint(), body).pipe(
      map((response) => this.mapEnvelopeAuthorResponse(response, 'Could not create author')),
      catchError((err: unknown) => this.handleCreateError(err)),
    );
  }

  update(id: number, author: Pick<Author, 'name'>): Observable<Author> {
    const body: ApiAuthorCreateRequestBody = { name: author.name };
    return this.http.put<ApiAuthorCreateResponse>(this.getEndpoint(String(id)), body).pipe(
      map((response) => this.mapEnvelopeAuthorResponse(response, 'Could not update author')),
      catchError((err: unknown) => this.handleUpdateError(err)),
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete(this.getEndpoint(String(id))).pipe(
      map(() => undefined),
      catchError((err: unknown) => this.handleDeleteError(err)),
    );
  }

  private mapEnvelopeAuthorResponse(response: unknown, failureFallback: string): Author {
    if (response === null || typeof response !== 'object') {
      throw new EnvelopeFailureError('Invalid server response.');
    }

    const envelopeMsg = extractEnvelopeFailureMessage(response);
    if (envelopeMsg !== null) {
      throw new EnvelopeFailureError(envelopeMsg);
    }

    const r = response as Partial<ApiAuthorCreateResponse>;
    if (!r.success || r.data === undefined || r.data === null) {
      const fallback = extractApiMessage(response) ?? failureFallback;
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
        return throwError(() => new FieldValidationError(message, fieldErrors));
      }
    }
    if (err instanceof HttpErrorResponse) {
      return throwError(() => mapHttpErrorResponse(err));
    }
    return throwError(() =>
      err instanceof Error ? err : new EnvelopeFailureError('Could not create author'),
    );
  }

  private handleUpdateError(err: unknown): Observable<never> {
    if (err instanceof HttpErrorResponse && err.status === 422) {
      const fieldErrors = extractFieldValidationErrors(err.error);
      if (fieldErrors !== null && Object.keys(fieldErrors).length > 0) {
        const message = extractApiMessage(err.error) ?? 'Validation failed';
        return throwError(() => new FieldValidationError(message, fieldErrors));
      }
    }
    if (err instanceof HttpErrorResponse && err.status === 404) {
      const raw = extractApiMessage(err.error);
      return throwError(() => new EntityNotFoundError(raw || undefined));
    }
    if (err instanceof HttpErrorResponse) {
      return throwError(() => mapHttpErrorResponse(err));
    }
    return throwError(() =>
      err instanceof Error ? err : new EnvelopeFailureError('Could not update author'),
    );
  }

  private handleDeleteError(err: unknown): Observable<never> {
    if (err instanceof HttpErrorResponse && err.status === 404) {
      const raw = extractApiMessage(err.error);
      return throwError(() => new EntityNotFoundError(raw || undefined));
    }
    if (err instanceof HttpErrorResponse) {
      return throwError(() => mapHttpErrorResponse(err));
    }
    return throwError(() =>
      err instanceof Error ? err : new EnvelopeFailureError('Could not delete author'),
    );
  }
}
