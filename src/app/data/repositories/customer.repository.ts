import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, catchError, retry } from 'rxjs/operators';
import type { Customer, CustomerInput } from '../../types/customer.type';
import type { ApiCustomer, ApiCustomerInput } from '../responses/customer-api.type';
import { BaseApiRepository } from './base-api.repository';

/**
 * Repository para gerenciar clientes através da API.
 * 
 * Endpoints gerados:
 * - GET    /api/customers       → getAll()
 * - GET    /api/customers/:id   → get(id)
 * - POST   /api/customers       → create(input)
 * - PUT    /api/customers/:id   → update(id, input)
 * - DELETE /api/customers/:id   → delete(id)
 * - GET    /api/customers/active → getActive()
 */
@Injectable({ providedIn: 'root' })
export class CustomerRepository extends BaseApiRepository {
  constructor() {
    super('customers');
  }

  /**
   * Busca todos os clientes
   */
  getAll(): Observable<Customer[]> {
    return this.http.get<ApiCustomer[]>(this.getEndpoint()).pipe(
      map(customers => customers.map(c => this.toCustomer(c))),
      retry(2),
      catchError(this.handleError('getAll'))
    );
  }

  /**
   * Busca cliente por ID
   */
  get(id: string): Observable<Customer> {
    return this.http.get<ApiCustomer>(this.getEndpoint(id)).pipe(
      map(customer => this.toCustomer(customer)),
      catchError(this.handleError('get'))
    );
  }

  /**
   * Busca apenas clientes ativos
   * Endpoint: GET /api/customers/active
   */
  getActive(): Observable<Customer[]> {
    return this.http.get<ApiCustomer[]>(this.getEndpoint('active')).pipe(
      map(customers => customers.map(c => this.toCustomer(c))),
      catchError(this.handleError('getActive'))
    );
  }

  /**
   * Cria novo cliente
   */
  create(input: CustomerInput): Observable<Customer> {
    const apiData = this.toApiCustomer(input);
    
    return this.http.post<ApiCustomer>(this.getEndpoint(), apiData).pipe(
      map(customer => this.toCustomer(customer)),
      catchError(this.handleError('create'))
    );
  }

  /**
   * Atualiza cliente existente
   */
  update(id: string, input: CustomerInput): Observable<Customer> {
    const apiData = this.toApiCustomer(input);
    
    return this.http.put<ApiCustomer>(this.getEndpoint(id), apiData).pipe(
      map(customer => this.toCustomer(customer)),
      catchError(this.handleError('update'))
    );
  }

  /**
   * Deleta cliente
   */
  delete(id: string): Observable<void> {
    return this.http.delete<void>(this.getEndpoint(id)).pipe(
      catchError(this.handleError('delete'))
    );
  }

  /**
   * Ativa/Desativa cliente
   * Endpoint: POST /api/customers/:id/toggle-active
   */
  toggleActive(id: string): Observable<Customer> {
    return this.http.post<ApiCustomer>(this.getEndpoint(`${id}/toggle-active`), {}).pipe(
      map(customer => this.toCustomer(customer)),
      catchError(this.handleError('toggleActive'))
    );
  }

  // Métodos de conversão privados

  /**
   * Converte dados da API para o tipo do domínio
   */
  private toCustomer(apiCustomer: ApiCustomer): Customer {
    return {
      id: apiCustomer.id,
      name: apiCustomer.customer_name,
      email: apiCustomer.email_address,
      phone: apiCustomer.phone_number || undefined,
      active: apiCustomer.is_active,
      createdAt: new Date(apiCustomer.created_at),
      updatedAt: new Date(apiCustomer.updated_at)
    };
  }

  /**
   * Converte dados do domínio para o formato da API
   */
  private toApiCustomer(customer: CustomerInput): ApiCustomerInput {
    return {
      customer_name: customer.name,
      email_address: customer.email,
      phone_number: customer.phone || null
    };
  }

  /**
   * Tratamento centralizado de erros
   */
  private handleError(operation: string) {
    return (error: unknown): Observable<never> => {
      console.error(`${operation} falhou:`, error);
      const message =
        error instanceof Error ? error.message : String(error);
      throw new Error(`Erro na operação ${operation}: ${message}`);
    };
  }
}
