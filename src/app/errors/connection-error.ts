/**
 * Falha de rede ou transporte (sem resposta utilizável), ex.: offline, CORS, timeout.
 */
export class ConnectionError extends Error {
  readonly uiMessageKey = 'http.connectionFailed' as const;

  constructor(message = 'Connection failed') {
    super(message);
    this.name = 'ConnectionError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
