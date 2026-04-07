/**
 * Falha no serviço remoto (ex.: indisponível ou erro interno).
 */
export class ServerInternalError extends Error {
  readonly status: number;
  readonly uiMessageKey = 'http.serverUnavailable' as const;

  constructor(status: number, message = 'Server error') {
    super(message);
    this.name = 'ServerInternalError';
    this.status = status;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
