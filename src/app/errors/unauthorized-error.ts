export class UnauthorizedError extends Error {
  readonly uiMessageKey = 'admin.unauthorized' as const;

  constructor(messageFromApi?: string) {
    super(messageFromApi ?? '');
    this.name = 'UnauthorizedError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
