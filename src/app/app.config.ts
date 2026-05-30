import { ApplicationConfig, inject, isDevMode, provideAppInitializer, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideTransloco, TranslocoService } from '@jsverse/transloco';

import { routes } from './app.routes';
import { TranslocoHttpLoader } from './transloco-loader';
import { authInterceptor } from './interceptors/auth.interceptor';
import { authErrorInterceptor } from './interceptors/auth-error.interceptor';
import { devHttpRequestLogInterceptor } from './interceptors/dev-http-request-log.interceptor';
import { devHttpResponseLogInterceptor } from './interceptors/dev-http-response-log.interceptor';
import { AuthSessionController } from './controllers/auth-session.controller';
import { SettingsController } from './controllers/settings.controller';
import { ToastService } from './services/toast.service';
import { LocalePersistenceService } from './services/locale-persistence.service';
import { AnimeRepository } from './data/repositories/anime.repository';
import { AnimeRepositoryMock } from './data/repositories/anime-mock.repository';
import {
  APP_LOCALES,
  resolveBrowserLocale,
} from './types/app-locale.type';

const httpInterceptorFns = [
  authInterceptor,
  authErrorInterceptor,
  ...(isDevMode()
    ? [devHttpRequestLogInterceptor, devHttpResponseLogInterceptor]
    : []),
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors(httpInterceptorFns)),
    provideTransloco({
      config: {
        availableLangs: [...APP_LOCALES],
        defaultLang: 'en',
        fallbackLang: 'en',
        reRenderOnLangChange: true,
        prodMode: !isDevMode(),
      },
      loader: TranslocoHttpLoader,
    }),
    provideAppInitializer(() => {
      const transloco = inject(TranslocoService);
      const localePersistence = inject(LocalePersistenceService);
      const stored = localePersistence.load();
      const lang =
        stored ?? resolveBrowserLocale(navigator.language);
      transloco.setActiveLang(lang);
      inject(SettingsController).syncFromActiveLang();
    }),
    provideAppInitializer(() => {
      inject(AuthSessionController).hydrateFromStorage();
      inject(ToastService);
    }),
    { provide: AnimeRepository, useClass: AnimeRepositoryMock },
  ],
};
