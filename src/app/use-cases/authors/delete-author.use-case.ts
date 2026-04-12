import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { AdminAuthorRepository } from '../../data/repositories/admin-author.repository';

/**
 * Exclui um autor; delega ao repositório admin.
 */
@Injectable({ providedIn: 'root' })
export class DeleteAuthorUseCase {
  private readonly adminAuthorRepository = inject(AdminAuthorRepository);

  execute(id: number): Observable<void> {
    return this.adminAuthorRepository.delete(id);
  }
}
