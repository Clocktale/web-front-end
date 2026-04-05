import type { PasswordSignupInput } from '../../../types/password-signup-input.type';

/**
 * Verifica se existe pelo menos uma letra minúscula (Unicode).
 */
export function passwordHasLowercaseUseCase(password: PasswordSignupInput): boolean {
  return /\p{Ll}/u.test(password);
}
