import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthPersistenceService } from '../services/auth-persistence.service';

/**
 * Anexa Authorization Bearer quando existe token em cache (exceto no próprio login).
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const persistence = inject(AuthPersistenceService);

  if (req.method === 'POST' && req.url.includes('/auth/login')) {
    return next(req);
  }

  const token = persistence.getAccessToken();
  if (!token) {
    return next(req);
  }

  return next(
    req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    })
  );
};
