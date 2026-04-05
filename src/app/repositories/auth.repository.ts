import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import type { AuthSession } from '../types/auth-session.type';
import type { LoginCredentials } from '../types/login-credentials.type';
import type { User } from '../types/user.type';
import type {
  ApiAuthLoginData,
  ApiAuthLoginRequestBody,
  ApiAuthLoginResponse,
  ApiAuthUser,
} from '../types/api/auth-login-api.type';
import type { ApiAuthLogoutRequestBody } from '../types/api/auth-logout-api.type';
import {
  ApiEnvelopeError,
  extractApiMessage,
  extractEnvelopeFailureMessage,
  mapHttpErrorResponse,
} from '../utils/http';
import { BaseApiRepository } from './base-api.repository';

@Injectable({ providedIn: 'root' })
export class AuthRepository extends BaseApiRepository {
  constructor() {
    super('auth');
  }

  login(credentials: LoginCredentials): Observable<AuthSession> {
    const body: ApiAuthLoginRequestBody = {
      email: credentials.email,
      password: credentials.password,
    };
    return this.http
      .post<ApiAuthLoginResponse>(this.getEndpoint('login'), body)
      .pipe(
        map(response => this.mapLoginResponse(response)),
        catchError((err: unknown) => this.handleLoginError(err))
      );
  }

  /**
   * Invalida o token no servidor. 401 é tratado como sucesso (token já inválido).
   */
  logout(): Observable<void> {
    const body: ApiAuthLogoutRequestBody = {};
    return this.http.post<unknown>(this.getEndpoint('logout'), body).pipe(
      map(() => undefined),
      catchError((err: unknown) => {
        if (err instanceof HttpErrorResponse && err.status === 401) {
          return of(undefined);
        }
        return this.handleLogoutError(err);
      })
    );
  }

  private mapLoginResponse(response: unknown): AuthSession {
    if (response === null || typeof response !== 'object') {
      throw new ApiEnvelopeError('Invalid server response.');
    }

    const envelopeMsg = extractEnvelopeFailureMessage(response);
    if (envelopeMsg !== null) {
      throw new ApiEnvelopeError(envelopeMsg);
    }

    const r = response as Partial<ApiAuthLoginResponse>;
    if (!r.success || r.data === undefined || r.data === null) {
      const fallback =
        extractApiMessage(response) ?? 'Login failed';
      throw new ApiEnvelopeError(fallback);
    }

    if (!this.isValidLoginData(r.data)) {
      throw new ApiEnvelopeError(
        'Incomplete login response (user, token, or expiration missing).'
      );
    }

    return this.toAuthSession(r.data);
  }

  private isValidLoginData(data: unknown): data is ApiAuthLoginData {
    if (data === null || typeof data !== 'object') {
      return false;
    }
    const d = data as Record<string, unknown>;
    if (
      typeof d['token'] !== 'string' ||
      d['token'].length === 0 ||
      typeof d['expire_at'] !== 'string' ||
      d['expire_at'].length === 0
    ) {
      return false;
    }
    return this.isValidApiUser(d['user']);
  }

  private isValidApiUser(user: unknown): user is ApiAuthUser {
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

  private handleLoginError(err: unknown): Observable<never> {
    if (err instanceof HttpErrorResponse) {
      return throwError(() => mapHttpErrorResponse(err));
    }
    return throwError(() =>
      err instanceof Error ? err : new ApiEnvelopeError('Login failed')
    );
  }

  private handleLogoutError(err: unknown): Observable<never> {
    if (err instanceof HttpErrorResponse) {
      return throwError(() => mapHttpErrorResponse(err));
    }
    return throwError(() =>
      err instanceof Error ? err : new ApiEnvelopeError('Logout failed')
    );
  }

  private toAuthSession(data: ApiAuthLoginData): AuthSession {
    return {
      user: this.toUser(data.user),
      token: data.token,
      expiresAt: data.expire_at,
    };
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
