# Exemplo de Uso: BaseApiRepository

Este documento demonstra como usar o `BaseApiRepository` para criar repositories.

## Exemplo 1: Repository Simples

```typescript
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseApiRepository } from './base-api.repository';
import { Customer, CustomerInput } from '../types/customer.type';
import { ApiCustomer, ApiCustomerInput } from '../types/api/customer-api.type';

@Injectable({ providedIn: 'root' })
export class CustomerRepository extends BaseApiRepository {
  constructor() {
    super('customers');
  }

  getAll(): Observable<Customer[]> {
    return this.http.get<ApiCustomer[]>(this.getEndpoint()).pipe(
      map(customers => customers.map(this.toCustomer))
    );
  }

  get(id: string): Observable<Customer> {
    return this.http.get<ApiCustomer>(this.getEndpoint(id)).pipe(
      map(this.toCustomer)
    );
  }

  create(input: CustomerInput): Observable<Customer> {
    const apiData = this.toApiCustomer(input);
    return this.http.post<ApiCustomer>(this.getEndpoint(), apiData).pipe(
      map(this.toCustomer)
    );
  }

  update(id: string, input: CustomerInput): Observable<Customer> {
    const apiData = this.toApiCustomer(input);
    return this.http.put<ApiCustomer>(this.getEndpoint(id), apiData).pipe(
      map(this.toCustomer)
    );
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(this.getEndpoint(id));
  }

  // Método customizado com path adicional
  getActive(): Observable<Customer[]> {
    return this.http.get<ApiCustomer[]>(this.getEndpoint('active')).pipe(
      map(customers => customers.map(this.toCustomer))
    );
  }

  private toCustomer(apiCustomer: ApiCustomer): Customer {
    return {
      id: apiCustomer.id,
      name: apiCustomer.customer_name,
      email: apiCustomer.email_address,
      createdAt: new Date(apiCustomer.created_at)
    };
  }

  private toApiCustomer(customer: CustomerInput): ApiCustomerInput {
    return {
      customer_name: customer.name,
      email_address: customer.email
    };
  }
}
```

## Exemplo 2: Repository com Endpoint Customizado

Para APIs com estruturas não convencionais:

```typescript
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiRepository } from './base-api.repository';
import { Order } from '../types/order.type';

@Injectable({ providedIn: 'root' })
export class OrderRepository extends BaseApiRepository {
  constructor() {
    super('orders');
  }

  // Sobrescreve getEndpoint para usar versão diferente da API
  protected override getEndpoint(path?: string): string {
    // API v2 ao invés da v1 padrão
    const basePath = `${this.API_URL}/v2/${this.resourcePath}`;
    return path ? `${basePath}/${path}` : basePath;
  }

  getAll(): Observable<Order[]> {
    // Usa o endpoint customizado: http://localhost:3000/api/v2/orders
    return this.http.get<Order[]>(this.getEndpoint());
  }
}
```

## Exemplo 3: Repository com Endpoints Complexos

```typescript
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiRepository } from './base-api.repository';
import { Report } from '../types/report.type';

@Injectable({ providedIn: 'root' })
export class ReportRepository extends BaseApiRepository {
  constructor() {
    super('reports');
  }

  // Endpoint: GET /api/reports/sales/monthly
  getMonthlySales(): Observable<Report[]> {
    return this.http.get<Report[]>(this.getEndpoint('sales/monthly'));
  }

  // Endpoint: GET /api/reports/customers/123/summary
  getCustomerSummary(customerId: string): Observable<Report> {
    return this.http.get<Report>(
      this.getEndpoint(`customers/${customerId}/summary`)
    );
  }

  // Endpoint completamente customizado para casos especiais
  getSpecialReport(): Observable<Report> {
    // Ignora getEndpoint completamente se necessário
    return this.http.get<Report>(`${this.API_URL}/special/reports/custom`);
  }
}
```

## Exemplo 4: Repository com Múltiplos Ambientes

```typescript
// environment.ts (desenvolvimento)
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};

// environment.prod.ts (produção)
export const environment = {
  production: true,
  apiUrl: 'https://api.clocktale.com/api'
};

// O repository automaticamente usa a URL correta
@Injectable({ providedIn: 'root' })
export class ProductRepository extends BaseApiRepository {
  constructor() {
    super('products');
  }

  getAll(): Observable<Product[]> {
    // Desenvolvimento: http://localhost:3000/api/products
    // Produção: https://api.clocktale.com/api/products
    return this.http.get<Product[]>(this.getEndpoint());
  }
}
```

## Exemplo 5: Repository com Headers Customizados

```typescript
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { BaseApiRepository } from './base-api.repository';
import { User } from '../types/user.type';

@Injectable({ providedIn: 'root' })
export class UserRepository extends BaseApiRepository {
  constructor() {
    super('users');
  }

  getAll(): Observable<User[]> {
    const headers = new HttpHeaders({
      'X-Custom-Header': 'value'
    });

    return this.http.get<User[]>(this.getEndpoint(), { headers });
  }
}
```

## Vantagens do BaseApiRepository

1. **Centralização**: URL da API em um único lugar
2. **Flexibilidade**: Pode sobrescrever `getEndpoint()` quando necessário
3. **Consistência**: Todos os repositories seguem o mesmo padrão
4. **Manutenibilidade**: Mudanças na URL afetam todos os repositories
5. **Ambiente**: Troca automática entre dev/prod através do environment
6. **Simplicidade**: Menos código repetitivo em cada repository

## Estrutura de URLs Gerada

```typescript
// CustomerRepository extends BaseApiRepository('customers')
this.getEndpoint()        // → http://localhost:3000/api/customers
this.getEndpoint('123')   // → http://localhost:3000/api/customers/123
this.getEndpoint('active') // → http://localhost:3000/api/customers/active

// OrderRepository extends BaseApiRepository('orders')
this.getEndpoint()            // → http://localhost:3000/api/orders
this.getEndpoint('123/items') // → http://localhost:3000/api/orders/123/items
```

## Testando Repositories

```typescript
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CustomerRepository } from './customer.repository';

describe('CustomerRepository', () => {
  let repository: CustomerRepository;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    repository = TestBed.inject(CustomerRepository);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should get all customers from correct endpoint', () => {
    const mockCustomers = [{ id: '1', customer_name: 'Test' }];

    repository.getAll().subscribe(customers => {
      expect(customers).toBeTruthy();
    });

    const req = httpMock.expectOne('http://localhost:3000/api/customers');
    expect(req.request.method).toBe('GET');
    req.flush(mockCustomers);
  });

  afterEach(() => {
    httpMock.verify();
  });
});
```
