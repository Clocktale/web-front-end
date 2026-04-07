import { HttpErrorResponse } from '@angular/common/http';

import {
  ClientRequestError,
  ConnectionError,
  ServerInternalError,
} from '../../errors';
import { extractApiMessage } from './extract-api-message';

/**
 * Converte `HttpErrorResponse` em erros de domínio com semântica clara para a UI.
 */
export function mapHttpErrorResponse(err: HttpErrorResponse): Error {
  if (err.status === 0) {
    return new ConnectionError();
  }

  if (err.status >= 500) {
    return new ServerInternalError(err.status);
  }

  const fromBody = extractApiMessage(err.error);
  const message =
    fromBody ?? err.message ?? `Request failed (${err.status})`;

  return new ClientRequestError(err.status, message);
}
