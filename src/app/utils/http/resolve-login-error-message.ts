import { isClientHttpError } from './app-http-error';
import { resolveUserFacingErrorMessage } from './resolve-user-facing-error';

const INVALID_CREDENTIALS_I18N_KEY = 'auth.login.invalidCredentials';

/** Mensagem genérica do back-end (Laravel) quando credenciais não conferem. */
const API_VALIDATION_ERROR_MESSAGE_PT = 'erro de validação';

function isApiValidationEnvelopeMessage(message: string): boolean {
  return message.trim().toLowerCase() === API_VALIDATION_ERROR_MESSAGE_PT;
}

/**
 * Mensagem de erro no formulário de login: credenciais inválidas em vez de
 * texto genérico da API (ex.: "Erro de validação").
 */
export function resolveLoginErrorMessage(
  err: unknown,
  translate: (key: string) => string,
  fallbackKey: string
): string {
  if (isClientHttpError(err)) {
    if (err.status === 401 || err.status === 422) {
      return translate(INVALID_CREDENTIALS_I18N_KEY);
    }
  }

  if (err instanceof Error && isApiValidationEnvelopeMessage(err.message)) {
    return translate(INVALID_CREDENTIALS_I18N_KEY);
  }

  return resolveUserFacingErrorMessage(err, translate, fallbackKey);
}
