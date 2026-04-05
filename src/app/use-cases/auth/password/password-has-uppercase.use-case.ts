import type { PasswordSignupInput } from '../../../types/password-signup-input.type';

/**
 * Verifica se existe pelo menos uma letra maiúscula (Unicode).
 */
export function passwordHasUppercaseUseCase(password: PasswordSignupInput): boolean {
  return /\p{Lu}/u.test(password);
}
