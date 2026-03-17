# HTTP Examples - Repository com HttpClient

Este documento contém exemplos completos de repositories usando HttpClient do Angular.

## Exemplo Completo: CustomerRepository

```typescript
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError, retry } from 'rxjs/operators';
import { Customer, CustomerInput, CustomerFilter } from '../types/customer.type';
import { ApiCustomer, ApiCustomerInput } from '../types/api/customer-api.type';

@Injectable({ providedIn: 'root' })
export class CustomerRepository {
  private http = inject(HttpClient);
  private readonly apiUrl = '/api/customers';

  /**
   * Busca todos os clientes
   */
  getAll(): Observable<Customer[]> {
    return this.http.get<ApiCustomer[]>(this.apiUrl).pipe(
      map(customers => customers.map(c => this.toCustomer(c))),
      retry(2),
      catchError(this.handleError('getAll'))
    );
  }

  /**
   * Busca cliente por ID
   */
  get(id: string): Observable<Customer> {
    return this.http.get<ApiCustomer>(`${this.apiUrl}/${id}`).pipe(
      map(customer => this.toCustomer(customer)),
      catchError(this.handleError('get'))
    );
  }

  /**
   * Busca clientes com filtros
   */
  search(filter: CustomerFilter): Observable<Customer[]> {
    let params = new HttpParams();
    
    if (filter.name) {
      params = params.set('name', filter.name);
    }
    if (filter.email) {
      params = params.set('email', filter.email);
    }
    if (filter.active !== undefined) {
      params = params.set('active', filter.active.toString());
    }

    return this.http.get<ApiCustomer[]>(this.apiUrl, { params }).pipe(
      map(customers => customers.map(c => this.toCustomer(c))),
      catchError(this.handleError('search'))
    );
  }

  /**
   * Busca clientes com paginação
   */
  getPaginated(page: number, pageSize: number): Observable<PaginatedResponse<Customer>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('page_size', pageSize.toString());

    return this.http.get<ApiPaginatedResponse<ApiCustomer>>(this.apiUrl, { params }).pipe(
      map(response => ({
        data: response.data.map(c => this.toCustomer(c)),
        total: response.total,
        page: response.page,
        pageSize: response.page_size,
        totalPages: Math.ceil(response.total / response.page_size)
      })),
      catchError(this.handleError('getPaginated'))
    );
  }

  /**
   * Cria novo cliente
   */
  create(input: CustomerInput): Observable<Customer> {
    const apiData = this.toApiCustomer(input);
    
    return this.http.post<ApiCustomer>(this.apiUrl, apiData).pipe(
      map(customer => this.toCustomer(customer)),
      catchError(this.handleError('create'))
    );
  }

  /**
   * Atualiza cliente existente
   */
  update(id: string, input: CustomerInput): Observable<Customer> {
    const apiData = this.toApiCustomer(input);
    
    return this.http.put<ApiCustomer>(`${this.apiUrl}/${id}`, apiData).pipe(
      map(customer => this.toCustomer(customer)),
      catchError(this.handleError('update'))
    );
  }

  /**
   * Atualização parcial (PATCH)
   */
  patch(id: string, updates: Partial<CustomerInput>): Observable<Customer> {
    return this.http.patch<ApiCustomer>(`${this.apiUrl}/${id}`, updates).pipe(
      map(customer => this.toCustomer(customer)),
      catchError(this.handleError('patch'))
    );
  }

  /**
   * Deleta cliente
   */
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError('delete'))
    );
  }

  /**
   * Ativa/Desativa cliente
   */
  toggleActive(id: string): Observable<Customer> {
    return this.http.post<ApiCustomer>(`${this.apiUrl}/${id}/toggle-active`, {}).pipe(
      map(customer => this.toCustomer(customer)),
      catchError(this.handleError('toggleActive'))
    );
  }

  /**
   * Upload de arquivo (avatar do cliente)
   */
  uploadAvatar(id: string, file: File): Observable<string> {
    const formData = new FormData();
    formData.append('avatar', file);

    return this.http.post<{ avatarUrl: string }>(
      `${this.apiUrl}/${id}/avatar`,
      formData
    ).pipe(
      map(response => response.avatarUrl),
      catchError(this.handleError('uploadAvatar'))
    );
  }

  // Métodos de conversão privados

  private toCustomer(apiCustomer: ApiCustomer): Customer {
    return {
      id: apiCustomer.id,
      name: apiCustomer.customer_name,
      email: apiCustomer.email_address,
      phone: apiCustomer.phone_number || undefined,
      active: apiCustomer.is_active,
      avatarUrl: apiCustomer.avatar_url || undefined,
      createdAt: new Date(apiCustomer.created_at),
      updatedAt: new Date(apiCustomer.updated_at)
    };
  }

  private toApiCustomer(customer: CustomerInput): ApiCustomerInput {
    return {
      customer_name: customer.name,
      email_address: customer.email,
      phone_number: customer.phone || null
    };
  }

  private handleError(operation: string) {
    return (error: any): Observable<never> => {
      console.error(`${operation} falhou:`, error);
      throw new Error(`Erro na operação ${operation}: ${error.message}`);
    };
  }
}

// Types auxiliares
interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

interface ApiPaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  page_size: number;
}
```

## Exemplo: ProductRepository com Headers Customizados

```typescript
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ProductRepository {
  private http = inject(HttpClient);
  private apiUrl = '/api/products';

  getAll(): Observable<Product[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Custom-Header': 'value'
    });

    return this.http.get<ApiProduct[]>(this.apiUrl, { headers }).pipe(
      map(products => products.map(this.toProduct))
    );
  }

  private toProduct(apiProduct: ApiProduct): Product {
    return {
      id: apiProduct.id,
      name: apiProduct.name,
      price: apiProduct.price,
      stock: apiProduct.stock_quantity
    };
  }
}
```

## Exemplo: OrderRepository com Múltiplas Requisições

```typescript
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class OrderRepository {
  private http = inject(HttpClient);
  private apiUrl = '/api/orders';

  /**
   * Busca ordem com detalhes completos (cliente + produtos)
   */
  getWithDetails(orderId: string): Observable<OrderDetail> {
    return this.http.get<ApiOrder>(`${this.apiUrl}/${orderId}`).pipe(
      switchMap(apiOrder => {
        // Busca cliente e produtos em paralelo
        return forkJoin({
          order: [apiOrder],
          customer: this.http.get<ApiCustomer>(`/api/customers/${apiOrder.customer_id}`),
          products: this.http.get<ApiProduct[]>(`/api/products?ids=${apiOrder.product_ids.join(',')}`)
        });
      }),
      map(({ order, customer, products }) => ({
        id: order[0].id,
        customer: this.toCustomer(customer),
        products: products.map(this.toProduct),
        total: order[0].total,
        status: order[0].status
      }))
    );
  }

  private toCustomer(api: ApiCustomer): Customer { /* ... */ }
  private toProduct(api: ApiProduct): Product { /* ... */ }
}
```

## Exemplo: Repository com Cache

```typescript
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, tap, shareReplay } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class CategoryRepository {
  private http = inject(HttpClient);
  private apiUrl = '/api/categories';
  private cache$?: Observable<Category[]>;

  getAll(forceRefresh = false): Observable<Category[]> {
    if (!this.cache$ || forceRefresh) {
      this.cache$ = this.http.get<ApiCategory[]>(this.apiUrl).pipe(
        map(categories => categories.map(this.toCategory)),
        shareReplay(1) // Cache o resultado
      );
    }
    return this.cache$;
  }

  clearCache(): void {
    this.cache$ = undefined;
  }

  private toCategory(api: ApiCategory): Category {
    return {
      id: api.id,
      name: api.name
    };
  }
}
```

## Exemplo: Repository com Interceptor de Token

```typescript
// app.config.ts
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './interceptors/auth.interceptor';

export const appConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([authInterceptor])
    )
  ]
};

// auth.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('auth_token');
  
  if (token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(authReq);
  }
  
  return next(req);
};

// Agora todos os repositories automaticamente incluem o token
@Injectable({ providedIn: 'root' })
export class CustomerRepository {
  private http = inject(HttpClient);
  
  // Requisições automaticamente incluem Authorization header
  getAll(): Observable<Customer[]> {
    return this.http.get<ApiCustomer[]>('/api/customers');
  }
}
```
