/** Idiomas suportados pelo Transloco nesta aplicação. */
export type AppLocale = 'en' | 'pt-BR' | 'ja';

export const APP_LOCALES: readonly AppLocale[] = ['en', 'pt-BR', 'ja'] as const;

export const DEFAULT_APP_LOCALE: AppLocale = 'en';

export interface LanguageOption {
  value: AppLocale;
  /** Nome nativo do idioma (não depende do idioma ativo da UI). */
  label: string;
}

export const LANGUAGE_OPTIONS: readonly LanguageOption[] = [
  { value: 'pt-BR', label: 'Português (Brasil)' },
  { value: 'en', label: 'English (US)' },
  { value: 'ja', label: '日本語' },
] as const;

export function isAppLocale(value: string): value is AppLocale {
  return (APP_LOCALES as readonly string[]).includes(value);
}

export function resolveBrowserLocale(browserLang: string): AppLocale {
  const match =
    APP_LOCALES.find(l => browserLang.startsWith(l)) ??
    APP_LOCALES.find(l => browserLang.startsWith(l.split('-')[0]));
  return match ?? DEFAULT_APP_LOCALE;
}
