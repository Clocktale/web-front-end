/**
 * Verifica se existe pelo menos uma letra maiúscula (Unicode).
 */
export function passwordHasUppercaseUseCase(password: string): boolean {
  return /\p{Lu}/u.test(password);
}
