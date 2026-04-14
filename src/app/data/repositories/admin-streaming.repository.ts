import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { EntityNotFoundError, EnvelopeFailureError } from '../../errors';
import { extractApiMessage, mapHttpErrorResponse } from '../http';
import { BaseApiRepository } from './base-api.repository';

@Injectable({ providedIn: 'root' })
export class AdminStreamingRepository extends BaseApiRepository {
  constructor() {
    super('admin/streamings');
  }

  delete(id: number): Observable<void> {
    return this.http.delete(this.getEndpoint(String(id))).pipe(
      map(() => undefined),
      catchError((err: unknown) => this.handleDeleteError(err)),
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
      err instanceof Error ? err : new EnvelopeFailureError('Could not delete streaming'),
    );
  }
}
