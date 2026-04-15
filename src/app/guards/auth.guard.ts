import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthSessionController } from '../controllers/auth-session.controller';

/** Exige sessão válida; caso contrário envia para `/login`. */
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthSessionController);
  const router = inject(Router);
  if (!auth.isAuthenticated()) {
    return router.parseUrl('/login');
  }
  return true;
};
