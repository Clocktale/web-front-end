/**
 * Validação pragmática de e-mail (formato local@domínio).
 */
const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

export function isValidEmail(value: string): boolean {
  const t = value.trim();
  if (t.length === 0) {
    return false;
  }
  return EMAIL_REGEX.test(t);
}
