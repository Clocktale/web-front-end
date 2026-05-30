import { Injectable, inject, signal } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';

import { LocalePersistenceService } from '../services/locale-persistence.service';
import {
  LANGUAGE_OPTIONS,
  isAppLocale,
  type AppLocale,
  type LanguageOption,
} from '../types/app-locale.type';

@Injectable({ providedIn: 'root' })
export class SettingsController {
  private readonly transloco = inject(TranslocoService);
  private readonly localePersistence = inject(LocalePersistenceService);

  readonly languageOptions: readonly LanguageOption[] = LANGUAGE_OPTIONS;

  selectedLang = signal<AppLocale>('en');

  /** Sincroniza o signal com o idioma ativo (após bootstrap ou navegação). */
  syncFromActiveLang(): void {
    const active = this.transloco.getActiveLang();
    if (isAppLocale(active)) {
      this.selectedLang.set(active);
    }
  }

  selectLanguage(locale: AppLocale): void {
    if (this.selectedLang() === locale) {
      return;
    }
    this.selectedLang.set(locale);
    this.transloco.setActiveLang(locale);
    this.localePersistence.save(locale);
  }
}
