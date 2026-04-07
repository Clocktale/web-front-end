/**
 * Pedido rejeitado pelo serviço (ex.: credenciais inválidas, recurso inexistente).
 * Inclui código de estado e mensagem legível para o utilizador.
 */
export class ClientRequestError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'ClientRequestError';
    this.status = status;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
