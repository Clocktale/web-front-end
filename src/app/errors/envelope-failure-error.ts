/**
 * Resposta com contrato inválido ou falha lógica (ex.: `success: false` no envelope).
 */
export class EnvelopeFailureError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'EnvelopeFailureError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
