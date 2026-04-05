import { ApplicationConfig, inject, isDevMode, provideAppInitializer, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideTransloco, TranslocoService } from '@jsverse/transloco';

import { routes } from './app.routes';
import { TranslocoHttpLoader } from './transloco-loader';
import { authInterceptor } from './interceptors/auth.interceptor';
import { authErrorInterceptor } from './interceptors/auth-error.interceptor';
import { AuthSessionController } from './controllers/auth-session.controller';
import { ToastService } from './services/toast.service';

const AVAILABLE_LANGS = ['en', 'pt-BR', 'ja'] as const;

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([authInterceptor, authErrorInterceptor])
    ),
    provideTransloco({
      config: {
        availableLangs: [...AVAILABLE_LANGS],
        defaultLang: 'en',
        fallbackLang: 'en',
        reRenderOnLangChange: true,
        prodMode: !isDevMode(),
      },
      loader: TranslocoHttpLoader,
    }),
    provideAppInitializer(() => {
      const transloco = inject(TranslocoService);
      const browserLang = navigator.language;
      const match =
        AVAILABLE_LANGS.find(l => browserLang.startsWith(l)) ??
        AVAILABLE_LANGS.find(l => browserLang.startsWith(l.split('-')[0])) ??
        'en';
      transloco.setActiveLang(match);
    }),
    provideAppInitializer(() => {
      inject(AuthSessionController).hydrateFromStorage();
      inject(ToastService);
    }),
  ],
};
