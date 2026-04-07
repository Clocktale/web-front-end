import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { UserRepository } from '../../data/repositories/user.repository';
import type { RegisterAccountInput } from '../../types/register-account-input.type';
import type { User } from '../../types/user.type';

/**
 * Caso de uso de cadastro: delega ao repositório (único ponto para trocar por mocks/testes).
 */
@Injectable({ providedIn: 'root' })
export class RegisterAccountUseCase {
  private readonly userRepository = inject(UserRepository);

  execute(input: RegisterAccountInput): Observable<User> {
    return this.userRepository.create(input);
  }
}
