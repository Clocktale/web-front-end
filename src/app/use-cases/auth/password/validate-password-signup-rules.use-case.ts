import type { PasswordSignupInput } from '../../../types/password-signup-input.type';
import type { PasswordSignupRulesResult } from '../../../types/password-signup-rules-result.type';
import { passwordHasDigitUseCase } from './password-has-digit.use-case';
import { passwordHasLowercaseUseCase } from './password-has-lowercase.use-case';
import { passwordHasSpecialCharUseCase } from './password-has-special-char.use-case';
import { passwordHasUppercaseUseCase } from './password-has-uppercase.use-case';
import { passwordLengthRangeUseCase } from './password-length-range.use-case';

/**
 * Agrega todas as regras de senha do cadastro.
 * O fluxo de registo na API deve reutilizar este caso de uso (ou os individuais)
 * para manter a mesma política que o feedback em tempo real na UI.
 */
export function validatePasswordSignupRulesUseCase(
  password: PasswordSignupInput
): PasswordSignupRulesResult {
  return {
    lengthInRange: passwordLengthRangeUseCase(password),
    hasUppercase: passwordHasUppercaseUseCase(password),
    hasLowercase: passwordHasLowercaseUseCase(password),
    hasDigit: passwordHasDigitUseCase(password),
    hasSpecialChar: passwordHasSpecialCharUseCase(password),
  };
}

/** Indica se todas as regras foram satisfeitas (ex.: habilitar submit ou validar antes do POST). */
export function allPasswordSignupRulesPass(
  rules: PasswordSignupRulesResult
): boolean {
  return (
    rules.lengthInRange &&
    rules.hasUppercase &&
    rules.hasLowercase &&
    rules.hasDigit &&
    rules.hasSpecialChar
  );
}
