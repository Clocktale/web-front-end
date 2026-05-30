import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import type { AnimeListQuery, AnimePaginatedResult } from '../../types/anime.type';

@Injectable()
export abstract class AnimeRepository {
  abstract list(query?: AnimeListQuery): Observable<AnimePaginatedResult>;
}
