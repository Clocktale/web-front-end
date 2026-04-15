import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthSessionController } from '../controllers/auth-session.controller';

/** Exige autenticação e perfil de administrador. */
export const adminOnlyGuard: CanActivateFn = () => {
  const auth = inject(AuthSessionController);
  const router = inject(Router);
  if (!auth.isAuthenticated()) {
    return router.parseUrl('/login');
  }
  if (!auth.isAdmin()) {
    return router.parseUrl('/app/home');
  }
  return true;
};
