/**
 * Resultado das regras de senha para cadastro.
 * Cada campo corresponde a um caso de uso isolado (validação granular).
 */
export interface PasswordSignupRulesResult {
  lengthInRange: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasDigit: boolean;
  hasSpecialChar: boolean;
}
