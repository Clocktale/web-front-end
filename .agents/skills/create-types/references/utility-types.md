# Utility Types - Types Utilitários do TypeScript

## Partial<T>

Torna todos os campos opcionais.

```typescript
interface Customer {
  id: string;
  name: string;
  email: string;
}

type PartialCustomer = Partial<Customer>;
// { id?: string; name?: string; email?: string; }
```

## Required<T>

Torna todos os campos obrigatórios.

```typescript
interface CustomerInput {
  name?: string;
  email?: string;
}

type RequiredCustomerInput = Required<CustomerInput>;
// { name: string; email: string; }
```

## Readonly<T>

Torna todos os campos readonly.

```typescript
type ImmutableCustomer = Readonly<Customer>;
// { readonly id: string; readonly name: string; ... }
```

## Pick<T, K>

Seleciona campos específicos.

```typescript
type CustomerSummary = Pick<Customer, 'id' | 'name'>;
// { id: string; name: string; }
```

## Omit<T, K>

Remove campos específicos.

```typescript
type CustomerWithoutId = Omit<Customer, 'id'>;
// { name: string; email: string; }
```

## Record<K, T>

Cria objeto com chaves específicas.

```typescript
type CustomerMap = Record<string, Customer>;
// { [key: string]: Customer }

type StatusConfig = Record<OrderStatus, { label: string; color: string }>;
```

## Exclude<T, U>

Remove tipos de union.

```typescript
type Role = 'admin' | 'user' | 'guest';
type NonGuestRole = Exclude<Role, 'guest'>;
// 'admin' | 'user'
```

## Extract<T, U>

Extrai tipos de union.

```typescript
type Status = 'active' | 'inactive' | 'pending' | 'deleted';
type ActiveStatus = Extract<Status, 'active' | 'pending'>;
// 'active' | 'pending'
```

## NonNullable<T>

Remove null e undefined.

```typescript
type MaybeString = string | null | undefined;
type DefiniteString = NonNullable<MaybeString>;
// string
```

## ReturnType<T>

Extrai tipo de retorno de função.

```typescript
function getCustomer() {
  return { id: '1', name: 'João' };
}

type Customer = ReturnType<typeof getCustomer>;
// { id: string; name: string; }
```
