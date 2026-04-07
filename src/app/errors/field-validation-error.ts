/**
 * Validação por campo devolvida pelo serviço; a UI pode mapear mensagens aos inputs.
 */
export class FieldValidationError extends Error {
  readonly fieldErrors: Record<string, string>;

  constructor(message: string, fieldErrors: Record<string, string>) {
    super(message);
    this.name = 'FieldValidationError';
    this.fieldErrors = fieldErrors;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
