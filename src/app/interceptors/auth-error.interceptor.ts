import {
  HttpErrorResponse,
  HttpInterceptorFn,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthSessionController } from '../controllers/auth-session.controller';

/**
 * Resposta 401: limpa sessão e redireciona ao login (exceto no POST /auth/login).
 */
export const authErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const authSession = inject(AuthSessionController);

  return next(req).pipe(
    catchError((err: unknown) => {
      if (err instanceof HttpErrorResponse && err.status === 401) {
        const isLoginPost =
          req.method === 'POST' && req.url.includes('/auth/login');
        const isLogoutPost =
          req.method === 'POST' && req.url.includes('/auth/logout');
        if (!isLoginPost && !isLogoutPost) {
          authSession.logout();
        }
      }
      return throwError(() => err);
    })
  );
};
