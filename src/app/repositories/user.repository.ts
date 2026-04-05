import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import type { User } from '../types/user.type';
import type { RegisterAccountInput } from '../types/register-account-input.type';
import type {
  ApiUserCreateData,
  ApiUserCreateRequestBody,
  ApiUserCreateResponse,
} from '../types/api/user-create-api.type';
import type { ApiAuthUser } from '../types/api/auth-login-api.type';
import {
  ApiEnvelopeError,
  LaravelValidationError,
  extractApiMessage,
  extractEnvelopeFailureMessage,
  extractLaravelFieldErrors,
  mapHttpErrorResponse,
} from '../utils/http';
import { BaseApiRepository } from './base-api.repository';

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
        map(response => this.mapCreateResponse(response)),
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
      const fallback =
        extractApiMessage(response) ?? 'Registration failed';
      throw new ApiEnvelopeError(fallback);
    }

    if (!this.isValidUserData(r.data)) {
      throw new ApiEnvelopeError(
        'Incomplete user response (id or fields missing).'
      );
    }

    return this.toUser(r.data);
  }

  private isValidUserData(data: unknown): data is ApiUserCreateData {
    return this.isValidApiUserShape(data);
  }

  private isValidApiUserShape(user: unknown): user is ApiAuthUser {
    if (user === null || typeof user !== 'object') {
      return false;
    }
    const u = user as Record<string, unknown>;
    return (
      typeof u['id'] === 'number' &&
      typeof u['profile_picture'] === 'string' &&
      typeof u['nickname'] === 'string' &&
      typeof u['username'] === 'string' &&
      typeof u['email'] === 'string' &&
      typeof u['created_at'] === 'string' &&
      typeof u['updated_at'] === 'string'
    );
  }

  private handleCreateError(err: unknown): Observable<never> {
    if (err instanceof HttpErrorResponse && err.status === 422) {
      const fieldErrors = extractLaravelFieldErrors(err.error);
      if (fieldErrors !== null && Object.keys(fieldErrors).length > 0) {
        const message =
          extractApiMessage(err.error) ?? 'Validation failed';
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

  private toUser(api: ApiAuthUser): User {
    return {
      id: api.id,
      profilePicture: api.profile_picture,
      nickname: api.nickname,
      username: api.username,
      email: api.email,
      createdAt: api.created_at,
      updatedAt: api.updated_at,
    };
  }
}
