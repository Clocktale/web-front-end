import { AuthSession } from '../../types/auth-session.type';
import { User } from '../../types/user.type';
import { ApiAuthLoginData, ApiAuthUser } from '../responses/auth-login-api.type';
import { BaseMapper } from './base.mapper';

export class AuthMapper extends BaseMapper {
  /**
   * Converte os dados de login da API para uma AuthSession do domínio.
   * Retorna null se os dados forem inválidos.
   */
  static toAuthSession(data: any): AuthSession | null {
    if (!this.isValidLoginData(data)) {
      return null;
    }

    const loginData = data as ApiAuthLoginData;

    return {
      user: this.toUser(loginData.user),
      token: loginData.token,
      expiresAt: this.toDate(loginData.expire_at),
    };
  }

  /**
   * Converte um usuário da API para o modelo de domínio User.
   */
  static toUser(api: ApiAuthUser): User {
    return {
      id: api.id,
      profilePicture: api.profile_picture,
      nickname: this.sanitizeString(api.nickname),
      username: api.username,
      email: api.email,
      createdAt: this.toDate(api.created_at),
      updatedAt: this.toDate(api.updated_at),
      isAdmin: api.is_admin === true,
    };
  }

  /**
   * Valida se os dados de login possuem todos os campos obrigatórios.
   */
  private static isValidLoginData(data: unknown): data is ApiAuthLoginData {
    return this.isValid(data, {
      token: (val) => this.isNotEmptyString(val),
      expire_at: (val) => this.isDateTime(val),
      user: (val) => this.isValidApiUser(val),
    });
  }

  /**
   * Valida se o objeto de usuário da API possui todos os campos obrigatórios.
   */
  private static isValidApiUser(user: unknown): user is ApiAuthUser {
    return this.isValid(user, {
      id: (val) => this.isNumber(val),
      profile_picture: (val) => this.isString(val),
      nickname: (val) => this.isString(val),
      username: (val) => this.isString(val),
      email: (val) => this.isString(val),
      created_at: (val) => this.isDateTime(val),
      updated_at: (val) => this.isDateTime(val),
    });
  }
}
