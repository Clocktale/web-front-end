const MIN_LENGTH = 8;
const MAX_LENGTH = 12;

/**
 * Verifica se a senha tem entre 8 e 12 caracteres (inclusive).
 */
export function passwordLengthRangeUseCase(password: string): boolean {
  const len = password.length;
  return len >= MIN_LENGTH && len <= MAX_LENGTH;
}
