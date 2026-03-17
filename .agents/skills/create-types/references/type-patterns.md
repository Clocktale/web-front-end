# Type Patterns - Padrões Comuns de Types

## Pattern 1: Entity com Timestamps

```typescript
export interface Customer {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}
```

## Pattern 2: Input/Update Separation

```typescript
// Input para criação
export interface CustomerInput {
  name: string;
  email: string;
}

// Update com campos opcionais
export interface CustomerUpdate {
  name?: string;
  email?: string;
}
```

## Pattern 3: Status Union Type

```typescript
export type OrderStatus = 
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export interface Order {
  id: string;
  status: OrderStatus;
}
```

## Pattern 4: Pagination

```typescript
export interface PaginationParams {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
```

## Pattern 5: Filter Types

```typescript
export interface ProductFilter {
  search?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
}
```

## Pattern 6: API Response Wrapper

```typescript
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  error: string;
  code: string;
  details?: Record<string, string[]>;
}
```

## Pattern 7: Discriminated Unions

```typescript
export type Payment = 
  | CreditCardPayment 
  | PixPayment 
  | BoletoPayment;

interface BasePayment {
  id: string;
  amount: number;
}

export interface CreditCardPayment extends BasePayment {
  type: 'credit_card';
  cardNumber: string;
}

export interface PixPayment extends BasePayment {
  type: 'pix';
  pixKey: string;
}

export interface BoletoPayment extends BasePayment {
  type: 'boleto';
  barcode: string;
}
```

## Pattern 8: Nested Objects

```typescript
export interface Order {
  id: string;
  customer: {
    id: string;
    name: string;
  };
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
}
```

## Pattern 9: Generic Types

```typescript
export interface Resource<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

// Uso
type CustomerResource = Resource<Customer>;
type ProductResource = Resource<Product[]>;
```

## Pattern 10: Extends e Omit

```typescript
// Base
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

// Extends
export interface Admin extends User {
  permissions: string[];
}

// Omit
export type UserWithoutRole = Omit<User, 'role'>;

// Pick
export type UserSummary = Pick<User, 'id' | 'name'>;
```
