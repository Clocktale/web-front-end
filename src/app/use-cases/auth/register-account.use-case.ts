import {
  allPasswordSignupRulesPass,
  validatePasswordSignupRulesUseCase,
} from './password/validate-password-signup-rules.use-case';

export interface RegisterAccountInput {
  username: string;
  nickname: string;
  email: string;
  password: string;
}

export type RegisterAccountFailureReason =
  | 'EMPTY_FIELDS'
  | 'INVALID_PASSWORD';

export type RegisterAccountResult =
  | { ok: true }
  | { ok: false; reason: RegisterAccountFailureReason };

/**
 * Caso de uso de alto nível do cadastro: reutiliza o agregador de regras de senha
 * e, no futuro, delega à API/repositório. Mantém uma única entrada para o fluxo real.
 */
export function registerAccountUseCase(
  input: RegisterAccountInput
): RegisterAccountResult {
  const username = input.username.trim();
  const nickname = input.nickname.trim();
  const email = input.email.trim();
  const password = input.password;

  if (!username || !nickname || !email || !password) {
    return { ok: false, reason: 'EMPTY_FIELDS' };
  }

  const rules = validatePasswordSignupRulesUseCase(password);
  if (!allPasswordSignupRulesPass(rules)) {
    return { ok: false, reason: 'INVALID_PASSWORD' };
  }

  // TODO: AuthRepository.register({ username, nickname, email, password })
  return { ok: true };
}
