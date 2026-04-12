import { ClientRequestError } from './client-request-error';
import { ConnectionError } from './connection-error';
import { EntityNotFoundError } from './entity-not-found-error';
import { EnvelopeFailureError } from './envelope-failure-error';
import { FieldValidationError } from './field-validation-error';
import { InvalidCredentialsError } from './invalid-credentials-error';
import { ServerInternalError } from './server-internal-error';
import { UnauthorizedError } from './unauthorized-error';

export function isConnectionError(err: unknown): err is ConnectionError {
  return err instanceof ConnectionError;
}

export function isServerInternalError(err: unknown): err is ServerInternalError {
  return err instanceof ServerInternalError;
}

export function isClientRequestError(err: unknown): err is ClientRequestError {
  return err instanceof ClientRequestError;
}

export function isEnvelopeFailureError(err: unknown): err is EnvelopeFailureError {
  return err instanceof EnvelopeFailureError;
}

export function isFieldValidationError(err: unknown): err is FieldValidationError {
  return err instanceof FieldValidationError;
}

export function isInvalidCredentialsError(
  err: unknown
): err is InvalidCredentialsError {
  return err instanceof InvalidCredentialsError;
}

export function isEntityNotFoundError(err: unknown): err is EntityNotFoundError {
  return err instanceof EntityNotFoundError;
}

export function isUnauthorizedError(err: unknown): err is UnauthorizedError {
  return err instanceof UnauthorizedError;
}
