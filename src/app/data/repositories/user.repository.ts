import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import type { User } from '../../types/user.type';
import type { RegisterAccountInput } from '../../types/register-account-input.type';
import type {
  ApiUserCreateRequestBody,
  ApiUserCreateResponse,
} from '../responses/user-create-api.type';
import {
  ApiEnvelopeError,
  LaravelValidationError,
  extractApiMessage,
  extractEnvelopeFailureMessage,
  extractLaravelFieldErrors,
  mapHttpErrorResponse,
} from '../../utils/http';
import { BaseApiRepository } from './base-api.repository';
import { AuthMapper } from '../mappers/auth.mapper';

@Injectable({ providedIn: 'root' })
export class UserRepository extends BaseApiRepository {
  constructor() {
    super('users');
  }

  create(body: RegisterAccountInput): Observable<User> {
    const payload: ApiUserCreateRequestBody = {
      nickname: body.nickname,
      username: body.username,
      email: body.email,
      password: body.password,
    };
    return this.http
      .post<ApiUserCreateResponse>(this.getEndpoint(), payload)
      .pipe(
        map((response) => this.mapCreateResponse(response)),
        catchError((err: unknown) => this.handleCreateError(err))
      );
  }

  private mapCreateResponse(response: unknown): User {
    if (response === null || typeof response !== 'object') {
      throw new ApiEnvelopeError('Invalid server response.');
    }

    const envelopeMsg = extractEnvelopeFailureMessage(response);
    if (envelopeMsg !== null) {
      throw new ApiEnvelopeError(envelopeMsg);
    }

    const r = response as Partial<ApiUserCreateResponse>;
    if (!r.success || r.data === undefined || r.data === null) {
      const fallback = extractApiMessage(response) ?? 'Registration failed';
      throw new ApiEnvelopeError(fallback);
    }

    // Usando o AuthMapper para converter o usuário (já que o shape é o mesmo)
    return AuthMapper.toUser(r.data);
  }

  private handleCreateError(err: unknown): Observable<never> {
    if (err instanceof HttpErrorResponse && err.status === 422) {
      const fieldErrors = extractLaravelFieldErrors(err.error);
      if (fieldErrors !== null && Object.keys(fieldErrors).length > 0) {
        const message = extractApiMessage(err.error) ?? 'Validation failed';
        return throwError(
          () => new LaravelValidationError(message, fieldErrors)
        );
      }
    }
    if (err instanceof HttpErrorResponse) {
      return throwError(() => mapHttpErrorResponse(err));
    }
    return throwError(() =>
      err instanceof Error ? err : new ApiEnvelopeError('Registration failed')
    );
  }
}
