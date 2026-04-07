import { isClientRequestError } from './type-guards';

/** Mensagem genérica do back-end quando credenciais não conferem. */
const API_VALIDATION_ERROR_MESSAGE_PT = 'erro de validação';

function isApiValidationEnvelopeMessage(message: string): boolean {
  return message.trim().toLowerCase() === API_VALIDATION_ERROR_MESSAGE_PT;
}

/**
 * Mesma regra que mapeia login para credenciais inválidas:
 * 401/422 em pedido rejeitado, ou mensagem de envelope de validação genérica.
 */
export function matchesLoginInvalidCredentials(err: unknown): boolean {
  if (isClientRequestError(err)) {
    return err.status === 401 || err.status === 422;
  }
  if (err instanceof Error && isApiValidationEnvelopeMessage(err.message)) {
    return true;
  }
  return false;
}
