import {
  isConnectionError,
  isServerInternalError,
} from '../../errors';

/**
 * Mensagem para exibir na UI: chaves i18n para erros padronizados (rede / 5xx),
 * caso contrário `Error.message` (API / envelope).
 */
export function resolveUserFacingErrorMessage(
  err: unknown,
  translate: (key: string) => string,
  fallbackKey: string
): string {
  if (isConnectionError(err)) {
    return translate(err.uiMessageKey);
  }
  if (isServerInternalError(err)) {
    return translate(err.uiMessageKey);
  }
  if (err instanceof Error) {
    return err.message;
  }
  return translate(fallbackKey);
}
