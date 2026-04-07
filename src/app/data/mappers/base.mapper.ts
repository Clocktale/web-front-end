/**
 * Classe base abstrata para Mappers.
 * Fornece utilitários de validação de tipos para garantir a integridade dos dados da API.
 */
export abstract class BaseMapper {
  /**
   * Verifica se o valor é um objeto válido (não nulo).
   */
  protected static isObject(value: unknown): value is Record<string, unknown> {
    return value !== null && typeof value === 'object';
  }

  /**
   * Verifica se o valor é uma string.
   */
  protected static isString(value: unknown): value is string {
    return typeof value === 'string';
  }

  /**
   * Verifica se o valor é uma string não vazia (após trim).
   */
  protected static isNotEmptyString(value: unknown): value is string {
    return this.isString(value) && value.trim().length > 0;
  }

  /**
   * Verifica se o valor é um número válido.
   */
  protected static isNumber(value: unknown): value is number {
    return typeof value === 'number' && !isNaN(value);
  }

  /**
   * Verifica se o valor pode ser convertido para um número válido.
   */
  protected static canBeNumber(value: unknown): boolean {
    if (this.isNumber(value)) return true;
    if (this.isString(value)) {
      const parsed = Number(value);
      return !isNaN(parsed);
    }
    return false;
  }

  /**
   * Tenta converter um valor para número, retornando um fallback se falhar.
   */
  protected static toNumber(value: unknown, fallback: number = 0): number {
    if (this.isNumber(value)) return value;
    if (this.isString(value)) {
      const parsed = Number(value);
      return isNaN(parsed) ? fallback : parsed;
    }
    return fallback;
  }

  /**
   * Verifica se o valor é uma data válida (string ISO ou objeto Date).
   */
  protected static isDateTime(value: unknown): boolean {
    if (value instanceof Date) return !isNaN(value.getTime());
    if (typeof value !== 'string') return false;
    const date = new Date(value);
    return !isNaN(date.getTime());
  }

  /**
   * Converte um valor para Date, retornando a data atual se falhar.
   */
  protected static toDate(value: unknown): Date {
    if (value instanceof Date) return isNaN(value.getTime()) ? new Date() : value;
    if (typeof value === 'string') {
      const date = new Date(value);
      return isNaN(date.getTime()) ? new Date() : date;
    }
    return new Date();
  }

  /**
   * Sanitiza uma string removendo espaços extras.
   */
  protected static sanitizeString(value: unknown, fallback: string = ''): string {
    return this.isString(value) ? value.trim() : fallback;
  }

  /**
   * Verifica se um objeto possui todas as chaves especificadas com tipos válidos.
   * @param obj O objeto a ser validado
   * @param schema Um mapa de chaves e funções de validação
   */
  protected static isValid(obj: any, schema: Record<string, (val: unknown) => boolean>): boolean {
    if (!this.isObject(obj)) return false;
    return Object.entries(schema).every(([key, validator]) => validator(obj[key]));
  }
}
