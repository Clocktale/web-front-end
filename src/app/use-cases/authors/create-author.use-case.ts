import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AdminAuthorRepository } from '../../data/repositories/admin-author.repository';
import type { Author, AuthorCreateInput } from '../../types/author.type';

/**
 * Cria um autor; delega ao repositório (único ponto para mocks/testes).
 */
@Injectable({ providedIn: 'root' })
export class CreateAuthorUseCase {
  private readonly adminAuthorRepository = inject(AdminAuthorRepository);

  execute(input: AuthorCreateInput): Observable<Author> {
    return this.adminAuthorRepository.create(input);
  }
}
