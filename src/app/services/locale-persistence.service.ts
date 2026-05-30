import { Injectable } from '@angular/core';
import {
  DEFAULT_APP_LOCALE,
  isAppLocale,
  type AppLocale,
} from '../types/app-locale.type';

const STORAGE_KEY = 'clocktale_locale';

/**
 * Persiste o idioma escolhido pelo utilizador em localStorage.
 */
@Injectable({ providedIn: 'root' })
export class LocalePersistenceService {
  save(locale: AppLocale): void {
    localStorage.setItem(STORAGE_KEY, locale);
  }

  load(): AppLocale | null {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored || !isAppLocale(stored)) {
      return null;
    }
    return stored;
  }

  clear(): void {
    localStorage.removeItem(STORAGE_KEY);
  }

  loadOrDefault(): AppLocale {
    return this.load() ?? DEFAULT_APP_LOCALE;
  }
}
