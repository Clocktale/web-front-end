import {
  isConnectionHttpError,
  isServerHttpError,
} from './app-http-error';

/**
 * Mensagem para exibir na UI: chaves i18n para erros padronizados (rede / 5xx),
 * caso contrário `Error.message` (API / envelope).
 */
export function resolveUserFacingErrorMessage(
  err: unknown,
  translate: (key: string) => string,
  fallbackKey: string
): string {
  if (isConnectionHttpError(err)) {
    return translate(err.uiMessageKey);
  }
  if (isServerHttpError(err)) {
    return translate(err.uiMessageKey);
  }
  if (err instanceof Error) {
    return err.message;
  }
  return translate(fallbackKey);
}
