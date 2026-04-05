import type { PasswordSignupInput } from '../../../types/password-signup-input.type';

/**
 * Verifica se existe pelo menos um algarismo (0–9).
 */
export function passwordHasDigitUseCase(password: PasswordSignupInput): boolean {
  return /\p{N}/u.test(password);
}
