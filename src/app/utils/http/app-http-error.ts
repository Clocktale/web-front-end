/**
 * Erro de rede / transporte (sem resposta HTTP, ex.: offline, CORS, timeout).
 */
export class ConnectionHttpError extends Error {
  readonly uiMessageKey = 'http.connectionFailed' as const;

  constructor(message = 'Connection failed') {
    super(message);
    this.name = 'ConnectionHttpError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Erro 5xx — servidor indisponível ou falha interna; mensagem padronizada no front.
 */
export class ServerHttpError extends Error {
  readonly status: number;
  readonly uiMessageKey = 'http.serverUnavailable' as const;

  constructor(status: number, message = 'Server error') {
    super(message);
    this.name = 'ServerHttpError';
    this.status = status;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Erro 4xx ou corpo com `message` da API (mensagem normalmente exibida ao utilizador).
 */
export class ClientHttpError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'ClientHttpError';
    this.status = status;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Falha de validação de envelope ou payload (ex.: 200 com `success: false`).
 */
export class ApiEnvelopeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ApiEnvelopeError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export function isConnectionHttpError(err: unknown): err is ConnectionHttpError {
  return err instanceof ConnectionHttpError;
}

export function isServerHttpError(err: unknown): err is ServerHttpError {
  return err instanceof ServerHttpError;
}

export function isClientHttpError(err: unknown): err is ClientHttpError {
  return err instanceof ClientHttpError;
}

export function isApiEnvelopeError(err: unknown): err is ApiEnvelopeError {
  return err instanceof ApiEnvelopeError;
}
