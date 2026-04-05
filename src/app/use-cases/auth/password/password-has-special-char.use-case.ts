import type { PasswordSignupInput } from '../../../types/password-signup-input.type';

/**
 * Verifica se existe pelo menos um caractere que não seja letra, número ou espaço
 * (caractere “especial” para política de cadastro).
 */
export function passwordHasSpecialCharUseCase(password: PasswordSignupInput): boolean {
  return /[^\p{L}\p{N}\s]/u.test(password);
}
