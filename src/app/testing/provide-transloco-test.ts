import { TranslocoTestingModule, TranslocoTestingOptions, Translation } from '@jsverse/transloco';

/**
 * Interface que define os idiomas obrigatórios para os testes.
 * O TypeScript garantirá que todos os 3 idiomas sejam fornecidos.
 */
export interface TranslocoTestLangs {
  en: Record<string, unknown>;
  'pt-BR': Record<string, unknown>;
  ja: Record<string, unknown>;
  [key: string]: Record<string, unknown>;
}

/**
 * Helper para configurar o Transloco em testes unitários.
 * Força a passagem de traduções para os 3 idiomas suportados pelo projeto.
 * 
 * @param langs Objeto contendo as traduções para en, pt-BR e ja.
 * @param defaultLang O idioma que deve estar ativo no início do teste (padrão: 'en').
 * @param options Opções adicionais do TranslocoTestingOptions.
 */
export function getTranslocoTestingModule(
  langs: TranslocoTestLangs,
  defaultLang: string = 'en',
  options: Partial<TranslocoTestingOptions> = {}
) {
  return TranslocoTestingModule.forRoot({
    langs: langs as any,
    translocoConfig: {
      availableLangs: ['en', 'pt-BR', 'ja'],
      defaultLang,
      reRenderOnLangChange: true,
    },
    preloadLangs: true,
    ...options,
  });
}
