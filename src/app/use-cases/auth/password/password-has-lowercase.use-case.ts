/**
 * Verifica se existe pelo menos uma letra minúscula (Unicode).
 */
export function passwordHasLowercaseUseCase(password: string): boolean {
  return /\p{Ll}/u.test(password);
}
