/**
 * Verifica se existe pelo menos um algarismo (0–9).
 */
export function passwordHasDigitUseCase(password: string): boolean {
  return /\p{N}/u.test(password);
}
