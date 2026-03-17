# Skill: Criar Repository

Esta skill ensina como criar um Repository para acessar dados externos (API, Firebase, etc).

## Quando Usar

Use esta skill quando precisar:
- Buscar dados de uma API REST
- Enviar dados para uma API
- Integrar com Firebase, GraphQL ou qualquer fonte externa
- Criar uma nova camada de acesso a dados

## Pré-requisitos

Antes de criar um repository, certifique-se de ter:
1. Types definidos para a entidade (ver skill `create-types`)
2. URL base da API ou configuração do Firebase
3. Entendimento do formato de dados da API

## Estrutura Básica

**IMPORTANTE**: Use `BaseApiRepository` para centralizar a lógica de URL da API.

### Opção 1: Com BaseApiRepository (Recomendado)

```typescript
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseApiRepository } from './base-api.repository';

@Injectable({ providedIn: 'root' })
export class [Entidade]Repository extends BaseApiRepository {
  constructor() {
    super('[entidade-plural]'); // Ex: 'customers', 'products'
  }

  getAll(): Observable<[Entidade][]> {
    return this.http.get<Api[Entidade][]>(this.getEndpoint())
      .pipe(map(items => items.map(this.toDomain)));
  }

  get(id: string): Observable<[Entidade]> {
    return this.http.get<Api[Entidade]>(this.getEndpoint(id))
      .pipe(map(this.toDomain));
  }

  create(input: [Entidade]Input): Observable<[Entidade]> {
    const apiData = this.toApi(input);
    return this.http.post<Api[Entidade]>(this.getEndpoint(), apiData)
      .pipe(map(this.toDomain));
  }

  update(id: string, input: [Entidade]Input): Observable<[Entidade]> {
    const apiData = this.toApi(input);
    return this.http.put<Api[Entidade]>(this.getEndpoint(id), apiData)
      .pipe(map(this.toDomain));
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(this.getEndpoint(id));
  }

  private toDomain(apiData: Api[Entidade]): [Entidade] {
    return {
      // Converter campos da API para domínio
    };
  }

  private toApi(domain: [Entidade]Input): Api[Entidade]Input {
    return {
      // Converter campos do domínio para API
    };
  }
}
```

### Opção 2: Sem BaseApiRepository (Legado)

```typescript
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class [Entidade]Repository {
  private http = inject(HttpClient);
  private apiUrl = '/api/[entidade-plural]';

  getAll(): Observable<[Entidade][]> {
    return this.http.get<Api[Entidade][]>(this.apiUrl)
      .pipe(map(items => items.map(this.toDomain)));
  }

  get(id: string): Observable<[Entidade]> {
    return this.http.get<Api[Entidade]>(`${this.apiUrl}/${id}`)
      .pipe(map(this.toDomain));
  }

  create(input: [Entidade]Input): Observable<[Entidade]> {
    const apiData = this.toApi(input);
    return this.http.post<Api[Entidade]>(this.apiUrl, apiData)
      .pipe(map(this.toDomain));
  }

  update(id: string, input: [Entidade]Input): Observable<[Entidade]> {
    const apiData = this.toApi(input);
    return this.http.put<Api[Entidade]>(`${this.apiUrl}/${id}`, apiData)
      .pipe(map(this.toDomain));
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  private toDomain(apiData: Api[Entidade]): [Entidade] {
    return {
      // Converter campos da API para domínio
    };
  }

  private toApi(domain: [Entidade]Input): Api[Entidade]Input {
    return {
      // Converter campos do domínio para API
    };
  }
}
```

**Vantagens do BaseApiRepository**:
- URL da API centralizada em `environment.ts`
- Menos código repetitivo
- Fácil trocar entre ambientes (dev/prod)
- Pode sobrescrever `getEndpoint()` para casos especiais
- Ver `BASE_API_EXAMPLES.md` para mais exemplos

## Métodos CRUD Padrão

### getAll()
Busca todos os registros da entidade.

```typescript
getAll(): Observable<Customer[]> {
  return this.http.get<ApiCustomer[]>(this.getEndpoint())
    .pipe(map(items => items.map(this.toCustomer)));
}
```

### get(id)
Busca um registro específico por ID.

```typescript
get(id: string): Observable<Customer> {
  return this.http.get<ApiCustomer>(this.getEndpoint(id))
    .pipe(map(this.toCustomer));
}
```

### create(input)
Cria um novo registro.

```typescript
create(input: CustomerInput): Observable<Customer> {
  const apiData = this.toApiCustomer(input);
  return this.http.post<ApiCustomer>(this.getEndpoint(), apiData)
    .pipe(map(this.toCustomer));
}
```

### update(id, input)
Atualiza um registro existente.

```typescript
update(id: string, input: CustomerInput): Observable<Customer> {
  const apiData = this.toApiCustomer(input);
  return this.http.put<ApiCustomer>(this.getEndpoint(id), apiData)
    .pipe(map(this.toCustomer));
}
```

### delete(id)
Deleta um registro.

```typescript
delete(id: string): Observable<void> {
  return this.http.delete<void>(this.getEndpoint(id));
}
```

### Método com path customizado
Para endpoints adicionais como `/customers/active`:

```typescript
getActive(): Observable<Customer[]> {
  return this.http.get<ApiCustomer[]>(this.getEndpoint('active'))
    .pipe(map(items => items.map(this.toCustomer)));
}
```

## Conversão de Tipos

### API → Domínio
Sempre converta dados da API para tipos do domínio:

```typescript
private toCustomer(apiCustomer: ApiCustomer): Customer {
  return {
    id: apiCustomer.id,
    name: apiCustomer.customer_name,
    email: apiCustomer.email_address,
    createdAt: new Date(apiCustomer.created_at)
  };
}
```

### Domínio → API
Converta tipos do domínio para formato da API:

```typescript
private toApiCustomer(customer: CustomerInput): ApiCustomerInput {
  return {
    customer_name: customer.name,
    email_address: customer.email
  };
}
```

## Tratamento de Erros

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

## Nomenclatura

- **Arquivo**: `[entidade].repository.ts` (ex: `customer.repository.ts`)
- **Classe**: `[Entidade]Repository` (ex: `CustomerRepository`)
- **Localização**: `src/app/repositories/`

## Checklist

Antes de finalizar um repository, verifique:

- [ ] Classe tem decorator `@Injectable({ providedIn: 'root' })`
- [ ] **Estende `BaseApiRepository` e chama `super(resourcePath)` no constructor**
- [ ] Usa `this.getEndpoint()` para construir URLs
- [ ] Todos os métodos retornam `Observable`
- [ ] Conversão de tipos API → Domínio está implementada
- [ ] Conversão de tipos Domínio → API está implementada
- [ ] Métodos de conversão são `private`
- [ ] Tratamento de erros está implementado
- [ ] Imports estão corretos

## BaseApiRepository

O `BaseApiRepository` centraliza a lógica de URL da API:

```typescript
// src/app/repositories/base-api.repository.ts
export abstract class BaseApiRepository {
  protected readonly API_URL = environment.apiUrl;
  protected readonly http = inject(HttpClient);

  constructor(protected readonly resourcePath: string) {}

  protected getEndpoint(path?: string): string {
    const basePath = `${this.API_URL}/${this.resourcePath}`;
    return path ? `${basePath}/${path}` : basePath;
  }
}
```

**Vantagens**:
- URL centralizada em `environment.ts`
- Troca automática entre dev/prod
- Pode sobrescrever `getEndpoint()` para casos especiais
- Menos código repetitivo

**Uso**:
```typescript
@Injectable({ providedIn: 'root' })
export class CustomerRepository extends BaseApiRepository {
  constructor() {
    super('customers'); // resourcePath
  }

  getAll(): Observable<Customer[]> {
    return this.http.get<Customer[]>(this.getEndpoint());
    // → http://localhost:3000/api/customers
  }

  get(id: string): Observable<Customer> {
    return this.http.get<Customer>(this.getEndpoint(id));
    // → http://localhost:3000/api/customers/123
  }

  getActive(): Observable<Customer[]> {
    return this.http.get<Customer[]>(this.getEndpoint('active'));
    // → http://localhost:3000/api/customers/active
  }
}
```

**Sobrescrevendo para endpoints especiais**:
```typescript
export class OrderRepository extends BaseApiRepository {
  constructor() {
    super('orders');
  }

  // Usa API v2 ao invés da v1
  protected override getEndpoint(path?: string): string {
    const basePath = `${this.API_URL}/v2/${this.resourcePath}`;
    return path ? `${basePath}/${path}` : basePath;
  }
}
```

## Exemplos Completos

Para exemplos mais detalhados, consulte:

- **BASE_API_EXAMPLES.md**: Exemplos de uso do BaseApiRepository
- **references/http-examples.md**: Exemplos completos com HTTP
- **references/firebase-examples.md**: Como usar com Firebase
- **references/error-handling.md**: Padrões avançados de erro
- **references/testing.md**: Como testar repositories

## Script de Geração

Para gerar um novo repository rapidamente:

```bash
# No terminal, execute:
bash .agents/skills/create-repository/scripts/generate-repository.sh customer
```

Isso criará o arquivo `customer.repository.ts` com a estrutura básica.

## Próximos Passos

Após criar o repository:
1. Use a skill `create-controller` para criar um controller que usa este repository
2. Teste o repository manualmente ou crie testes unitários
3. Integre com a UI através de um controller

## Regras Importantes

- Repository NÃO deve conter lógica de negócio
- Repository NÃO deve gerenciar estado da aplicação
- Repository NÃO deve conhecer detalhes da UI
- Repository deve SEMPRE converter tipos da API para domínio
- Repository deve SEMPRE retornar Observables
