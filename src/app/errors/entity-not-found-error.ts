export class EntityNotFoundError extends Error {
  readonly uiMessageKey = 'admin.entityNotFound' as const;

  constructor(messageFromApi?: string) {
    super(messageFromApi ?? '');
    this.name = 'EntityNotFoundError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
