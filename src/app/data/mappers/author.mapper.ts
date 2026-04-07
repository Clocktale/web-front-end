import { Author } from '../../types/author.type';
import { BaseMapper } from './base.mapper';

export class AuthorMapper extends BaseMapper {
  /**
   * Converte e valida os dados brutos da API para o modelo de domínio Author.
   * Retorna null se os dados forem inválidos ou se campos obrigatórios estiverem ausentes.
   */
  static toDomain(raw: any): Author | null {
    if (!this.isObject(raw)) {
      return null;
    }

    // Validação usando o novo schema do BaseMapper
    const isValid = this.isValid(raw, {
      id: (val) => this.canBeNumber(val),
      name: (val) => this.isNotEmptyString(val),
    });

    if (!isValid) {
      return null;
    }

    return {
      id: this.toNumber(raw['id']),
      name: this.sanitizeString(raw['name']),
    };
  }

  /**
   * Converte uma lista de autores da API, filtrando os inválidos.
   */
  static toDomainList(rawList: any[]): Author[] {
    if (!Array.isArray(rawList)) {
      return [];
    }
    return rawList
      .map((item) => this.toDomain(item))
      .filter((author): author is Author => author !== null);
  }
}
