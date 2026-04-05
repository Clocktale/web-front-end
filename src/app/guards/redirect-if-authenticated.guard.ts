import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthSessionController } from '../controllers/auth-session.controller';

/**
 * Rotas de login/registo: com sessão válida (ex.: após hydrate ou login),
 * envia para a área principal em vez de mostrar o formulário.
 */
export const redirectIfAuthenticatedGuard: CanActivateFn = () => {
  const auth = inject(AuthSessionController);
  const router = inject(Router);
  if (auth.isAuthenticated()) {
    return router.parseUrl('/explore');
  }
  return true;
};
