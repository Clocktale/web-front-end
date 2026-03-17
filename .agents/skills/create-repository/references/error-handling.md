# Error Handling - Tratamento de Erros em Repositories

## Padrões de Tratamento de Erros

### 1. catchError Básico

```typescript
import { catchError, throwError } from 'rxjs';

getAll(): Observable<Customer[]> {
  return this.http.get<ApiCustomer[]>(this.apiUrl).pipe(
    map(items => items.map(this.toCustomer)),
    catchError(error => {
      console.error('Erro ao buscar clientes:', error);
      return throwError(() => new Error('Falha ao carregar clientes'));
    })
  );
}
```

### 2. Retry com Backoff

```typescript
import { retry, retryWhen, delay, take, concat } from 'rxjs/operators';

getAll(): Observable<Customer[]> {
  return this.http.get<ApiCustomer[]>(this.apiUrl).pipe(
    map(items => items.map(this.toCustomer)),
    retryWhen(errors =>
      errors.pipe(
        delay(1000), // Aguarda 1s antes de retentar
        take(3), // Máximo 3 retentativas
        concat(throwError(() => new Error('Falhou após 3 tentativas')))
      )
    )
  );
}
```

### 3. Tratamento por Status Code

```typescript
import { catchError } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';

get(id: string): Observable<Customer> {
  return this.http.get<ApiCustomer>(`${this.apiUrl}/${id}`).pipe(
    map(this.toCustomer),
    catchError((error: HttpErrorResponse) => {
      if (error.status === 404) {
        throw new Error(`Cliente ${id} não encontrado`);
      } else if (error.status === 403) {
        throw new Error('Sem permissão para acessar este cliente');
      } else if (error.status === 500) {
        throw new Error('Erro no servidor. Tente novamente mais tarde');
      } else {
        throw new Error(`Erro desconhecido: ${error.message}`);
      }
    })
  );
}
```

### 4. Error Handler Centralizado

```typescript
@Injectable({ providedIn: 'root' })
export class CustomerRepository {
  private http = inject(HttpClient);

  getAll(): Observable<Customer[]> {
    return this.http.get<ApiCustomer[]>(this.apiUrl).pipe(
      map(items => items.map(this.toCustomer)),
      catchError(this.handleError('getAll'))
    );
  }

  private handleError(operation: string) {
    return (error: HttpErrorResponse): Observable<never> => {
      console.error(`${operation} falhou:`, error);

      let userMessage: string;

      if (error.error instanceof ErrorEvent) {
        // Erro do client
        userMessage = `Erro de rede: ${error.error.message}`;
      } else {
        // Erro do servidor
        userMessage = `Erro ${error.status}: ${error.statusText}`;
      }

      return throwError(() => new Error(userMessage));
    };
  }
}
```

### 5. Fallback para Dados em Cache

```typescript
import { catchError, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CategoryRepository {
  private cachedCategories: Category[] = [];

  getAll(): Observable<Category[]> {
    return this.http.get<ApiCategory[]>(this.apiUrl).pipe(
      map(items => items.map(this.toCategory)),
      tap(categories => this.cachedCategories = categories),
      catchError(error => {
        console.warn('API falhou, usando cache:', error);
        return of(this.cachedCategories);
      })
    );
  }
}
```

## Custom Error Classes

```typescript
// errors/repository.error.ts
export class RepositoryError extends Error {
  constructor(
    message: string,
    public operation: string,
    public originalError?: any
  ) {
    super(message);
    this.name = 'RepositoryError';
  }
}

export class NotFoundError extends RepositoryError {
  constructor(entity: string, id: string) {
    super(`${entity} com ID ${id} não encontrado`, 'get');
    this.name = 'NotFoundError';
  }
}

export class ValidationError extends RepositoryError {
  constructor(
    message: string,
    public errors: Record<string, string[]>
  ) {
    super(message, 'validate');
    this.name = 'ValidationError';
  }
}

// Uso no repository
get(id: string): Observable<Customer> {
  return this.http.get<ApiCustomer>(`${this.apiUrl}/${id}`).pipe(
    map(this.toCustomer),
    catchError((error: HttpErrorResponse) => {
      if (error.status === 404) {
        throw new NotFoundError('Customer', id);
      }
      throw new RepositoryError('Falha ao buscar cliente', 'get', error);
    })
  );
}
```

## Logging de Erros

```typescript
import { inject } from '@angular/core';

interface Logger {
  error(message: string, error: any): void;
}

@Injectable({ providedIn: 'root' })
export class CustomerRepository {
  private http = inject(HttpClient);
  private logger = inject(Logger); // Injeta serviço de logging

  getAll(): Observable<Customer[]> {
    return this.http.get<ApiCustomer[]>(this.apiUrl).pipe(
      map(items => items.map(this.toCustomer)),
      catchError(error => {
        // Log estruturado
        this.logger.error('CustomerRepository.getAll failed', {
          error,
          timestamp: new Date(),
          url: this.apiUrl
        });

        return throwError(() => new Error('Falha ao carregar clientes'));
      })
    );
  }
}
```

## Validação de Resposta

```typescript
create(input: CustomerInput): Observable<Customer> {
  return this.http.post<ApiCustomer>(this.apiUrl, this.toApiCustomer(input)).pipe(
    map(response => {
      // Valida resposta antes de converter
      if (!response || !response.id) {
        throw new Error('Resposta inválida da API');
      }
      return this.toCustomer(response);
    }),
    catchError(this.handleError('create'))
  );
}
```

## Timeout

```typescript
import { timeout } from 'rxjs/operators';

getAll(): Observable<Customer[]> {
  return this.http.get<ApiCustomer[]>(this.apiUrl).pipe(
    timeout(5000), // 5 segundos
    map(items => items.map(this.toCustomer)),
    catchError(error => {
      if (error.name === 'TimeoutError') {
        throw new Error('Requisição excedeu o tempo limite');
      }
      throw error;
    })
  );
}
```
