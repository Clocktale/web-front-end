import { HttpErrorResponse } from '@angular/common/http';
import {
  ClientHttpError,
  ConnectionHttpError,
  ServerHttpError,
} from './app-http-error';
import { extractApiMessage } from './extract-api-message';

/**
 * Converte `HttpErrorResponse` em erros de domínio com semântica clara para a UI.
 */
export function mapHttpErrorResponse(err: HttpErrorResponse): Error {
  if (err.status === 0) {
    return new ConnectionHttpError();
  }

  if (err.status >= 500) {
    return new ServerHttpError(err.status);
  }

  const fromBody = extractApiMessage(err.error);
  const message =
    fromBody ?? err.message ?? `Request failed (${err.status})`;

  return new ClientHttpError(err.status, message);
}
