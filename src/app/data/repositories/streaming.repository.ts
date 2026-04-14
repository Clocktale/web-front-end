import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { EnvelopeFailureError } from '../../errors';
import type { StreamingListQuery, StreamingPaginatedResult } from '../../types/streaming.type';
import {
  extractApiMessage,
  extractEnvelopeFailureMessage,
  mapHttpErrorResponse,
} from '../http';
import { StreamingMapper } from '../mappers/streaming.mapper';
import { PaginatedMapper } from '../mappers/paginated.mapper';
import type { ApiStreamingListResponse } from '../responses/streaming-list-api.type';
import { BaseApiRepository } from './base-api.repository';

@Injectable({ providedIn: 'root' })
export class StreamingRepository extends BaseApiRepository {
  constructor() {
    super('streamings');
  }

  list(options?: StreamingListQuery): Observable<StreamingPaginatedResult> {
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
      .get<ApiStreamingListResponse>(this.getEndpoint(), { params })
      .pipe(
        map((response) => this.mapListResponse(response)),
        catchError((err: unknown) => this.handleListError(err))
      );
  }

  private mapListResponse(response: unknown): StreamingPaginatedResult {
    if (response === null || typeof response !== 'object') {
      throw new EnvelopeFailureError('Invalid server response.');
    }

    const envelopeMsg = extractEnvelopeFailureMessage(response);
    if (envelopeMsg !== null) {
      throw new EnvelopeFailureError(envelopeMsg);
    }

    const r = response as Partial<ApiStreamingListResponse>;
    if (!r.success || r.data === undefined || r.data === null) {
      const fallback = extractApiMessage(response) ?? 'Could not load streamings';
      throw new EnvelopeFailureError(fallback);
    }

    const paginated = PaginatedMapper.toPaginatedResult(r.data, (row) =>
      StreamingMapper.toDomain(row)
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
      err instanceof Error ? err : new EnvelopeFailureError('Could not load streamings')
    );
  }
}
