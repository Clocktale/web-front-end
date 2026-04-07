import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthRepository } from '../../data/repositories/auth.repository';

/**
 * Caso de uso de logout: delega ao repositório.
 */
@Injectable({ providedIn: 'root' })
export class LogoutUseCase {
  private readonly authRepository = inject(AuthRepository);

  execute(): Observable<void> {
    return this.authRepository.logout();
  }
}
