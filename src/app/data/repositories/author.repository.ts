import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import type {
  AuthorListQuery,
  AuthorPaginatedResult,
} from '../../types/author.type';
import type { ApiAuthorListResponse } from '../responses/author-list-api.type';
import { EnvelopeFailureError } from '../../errors';
import {
  extractApiMessage,
  extractEnvelopeFailureMessage,
  mapHttpErrorResponse,
} from '../http';
import { BaseApiRepository } from './base-api.repository';
import { AuthorMapper } from '../mappers/author.mapper';
import { PaginatedMapper } from '../mappers/paginated.mapper';

@Injectable({ providedIn: 'root' })
export class AuthorRepository extends BaseApiRepository {
  constructor() {
    super('authors');
  }

  /**
   * Lista autores (público). `name` filtra no servidor quando preenchido.
   */
  list(options?: AuthorListQuery): Observable<AuthorPaginatedResult> {
    const page = options?.page ?? 1;
    const pageSize = options?.pageSize ?? 10;

    let params = new HttpParams()
      .set('page', String(page))
      .set('per_page', String(pageSize));

    const name = options?.name?.trim();
    if (name) {
      params = params.set('name', name);
    }

    return this.http
      .get<ApiAuthorListResponse>(this.getEndpoint(), { params })
      .pipe(
        map((response) => this.mapListResponse(response)),
        catchError((err: unknown) => this.handleListError(err))
      );
  }

  private mapListResponse(response: unknown): AuthorPaginatedResult {
    if (response === null || typeof response !== 'object') {
      throw new EnvelopeFailureError('Invalid server response.');
    }

    const envelopeMsg = extractEnvelopeFailureMessage(response);
    if (envelopeMsg !== null) {
      throw new EnvelopeFailureError(envelopeMsg);
    }

    const r = response as Partial<ApiAuthorListResponse>;
    if (!r.success || r.data === undefined || r.data === null) {
      const fallback = extractApiMessage(response) ?? 'Could not load authors';
      throw new EnvelopeFailureError(fallback);
    }

    const paginated = PaginatedMapper.toPaginatedResult(r.data, (row) =>
      AuthorMapper.toDomain(row)
    );
    if (!paginated) {
      throw new EnvelopeFailureError('Invalid paginated data.');
    }
    return paginated;
  }

  private handleListError(err: unknown): Observable<never> {
    if (err instanceof HttpErrorResponse) {
      return throwError(() => mapHttpErrorResponse(err));
    }
    return throwError(() =>
      err instanceof Error ? err : new EnvelopeFailureError('Could not load authors')
    );
  }
}
