import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { AdminStreamingRepository } from '../../data/repositories/admin-streaming.repository';

@Injectable({ providedIn: 'root' })
export class DeleteStreamingUseCase {
  private readonly adminStreamingRepository = inject(AdminStreamingRepository);

  execute(id: number): Observable<void> {
    return this.adminStreamingRepository.delete(id);
  }
}
