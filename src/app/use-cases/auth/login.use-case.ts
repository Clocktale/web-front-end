import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthRepository } from '../../repositories/auth.repository';
import type { AuthSession } from '../../types/auth-session.type';

/**
 * Caso de uso de login: delega ao repositório (único ponto para trocar por mocks/testes).
 */
@Injectable({ providedIn: 'root' })
export class LoginUseCase {
  private readonly authRepository = inject(AuthRepository);

  execute(credentials: {
    email: string;
    password: string;
  }): Observable<AuthSession> {
    return this.authRepository.login(credentials);
  }
}
