import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { environment } from '../../../environments/environment';

/**
 * Classe base para repositories que acessam APIs HTTP.
 *
 * Centraliza a lógica de construção de URLs da API e fornece
 * acesso ao HttpClient.
 *
 * @example
 * ```typescript
 * export class CustomerRepository extends BaseApiRepository {
 *   constructor() {
 *     super('customers');
 *   }
 *
 *   getAll(): Observable<Customer[]> {
 *     return this.http.get<Customer[]>(this.getEndpoint());
 *   }
 * }
 * ```
 */
export abstract class BaseApiRepository {
  /**
   * URL base da API vinda das variáveis de ambiente
   */
  protected readonly API_URL = environment.apiUrl;

  /**
   * HttpClient para fazer requisições HTTP
   */
  protected readonly http = inject(HttpClient);

  /**
   * @param resourcePath - Caminho do recurso na API (ex: 'customers', 'products')
   */
  constructor(protected readonly resourcePath: string) {
    if (!resourcePath) {
      throw new Error('resourcePath é obrigatório no BaseApiRepository');
    }
  }

  /**
   * Retorna o endpoint completo da API.
   *
   * Pode ser sobrescrito em repositories com endpoints não convencionais.
   *
   * @param path - Caminho adicional opcional (ex: 'active', '123/orders')
   * @returns URL completa do endpoint
   *
   * @example
   * ```typescript
   * // Endpoint padrão
   * this.getEndpoint(); // 'http://localhost:3000/api/customers'
   *
   * // Com path adicional
   * this.getEndpoint('active'); // 'http://localhost:3000/api/customers/active'
   * this.getEndpoint('123'); // 'http://localhost:3000/api/customers/123'
   *
   * // Sobrescrevendo em repository específico
   * protected override getEndpoint(path?: string): string {
   *   return `${this.API_URL}/v2/${this.resourcePath}${path ? `/${path}` : ''}`;
   * }
   * ```
   */
  protected getEndpoint(path?: string): string {
    const basePath = `${this.API_URL}/${this.resourcePath}`;
    return path ? `${basePath}/${path}` : basePath;
  }
}
