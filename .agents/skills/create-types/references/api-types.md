# API Types - Definindo Types para APIs

## Separação: Domínio vs API

```typescript
// types/customer.type.ts (Domínio)
export interface Customer {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

// types/api/customer-api.type.ts (API)
export interface ApiCustomer {
  id: string;
  customer_name: string;      // snake_case da API
  email_address: string;
  created_at: string;          // string ISO da API
}
```

## Pattern: Request/Response

```typescript
// Request
export interface ApiCustomerCreateRequest {
  customer_name: string;
  email_address: string;
}

// Response
export interface ApiCustomerCreateResponse {
  customer: ApiCustomer;
  message: string;
}
```

## Pattern: Paginated API Response

```typescript
export interface ApiPaginatedResponse<T> {
  data: T[];
  pagination: {
    current_page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
}
```

## Pattern: Error Response

```typescript
export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
  };
  timestamp: string;
}
```

## Conversão no Repository

```typescript
// Repository converte API → Domínio
private toCustomer(api: ApiCustomer): Customer {
  return {
    id: api.id,
    name: api.customer_name,
    email: api.email_address,
    createdAt: new Date(api.created_at)
  };
}

// Repository converte Domínio → API
private toApiCustomer(customer: CustomerInput): ApiCustomerCreateRequest {
  return {
    customer_name: customer.name,
    email_address: customer.email
  };
}
```
