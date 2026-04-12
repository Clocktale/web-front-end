import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { AdminAuthorRepository } from '../../data/repositories/admin-author.repository';
import type { Author } from '../../types/author.type';

/**
 * Atualiza um autor; delega ao repositório admin.
 */
@Injectable({ providedIn: 'root' })
export class UpdateAuthorUseCase {
  private readonly adminAuthorRepository = inject(AdminAuthorRepository);

  execute(id: number, input: Pick<Author, 'name'>): Observable<Author> {
    return this.adminAuthorRepository.update(id, input);
  }
}
