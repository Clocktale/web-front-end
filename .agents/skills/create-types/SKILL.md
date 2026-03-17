# Skill: Criar Types

Esta skill ensina como criar Types e Interfaces para gerenciamento de estado e tipagem forte.

## Quando Usar

Use esta skill quando precisar:
- Definir estrutura de dados de uma entidade
- Criar types para input/output de APIs
- Definir types para estado da aplicação
- Garantir type safety em todo o projeto

## Pré-requisitos

- Entendimento de TypeScript
- Conhecimento do formato de dados da API (se aplicável)

## Estrutura Básica

### Type de Domínio

```typescript
// types/customer.type.ts
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### Input Types

```typescript
// Para criação (sem id, sem timestamps)
export interface CustomerInput {
  name: string;
  email: string;
  phone?: string;
}

// Para atualização (campos opcionais)
export interface CustomerUpdate {
  name?: string;
  email?: string;
  phone?: string;
  active?: boolean;
}
```

### API Types

```typescript
// types/api/customer-api.type.ts

// Formato que vem da API
export interface ApiCustomer {
  id: string;
  customer_name: string;
  email_address: string;
  phone_number?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Formato que enviamos para API
export interface ApiCustomerInput {
  customer_name: string;
  email_address: string;
  phone_number?: string;
}
```

## Organização de Pastas

```
src/app/types/
├── customer.type.ts          # Types de domínio
├── product.type.ts
├── order.type.ts
├── api/                      # Types da API
│   ├── customer-api.type.ts
│   ├── product-api.type.ts
│   └── order-api.type.ts
└── common/                   # Types compartilhados
    ├── pagination.type.ts
    ├── response.type.ts
    └── filter.type.ts
```

## Convenções de Nomenclatura

### Entidades
- **Interface**: `Customer`, `Product`, `Order`
- **Arquivo**: `customer.type.ts`, `product.type.ts`

### Input/Update
- **Criação**: `CustomerInput`, `ProductInput`
- **Atualização**: `CustomerUpdate`, `ProductUpdate`

### API
- **Prefixo**: `Api[Entidade]` → `ApiCustomer`
- **Pasta**: `types/api/`

### Union Types
- **Sufixo descritivo**: `UserRole`, `OrderStatus`
- **Literal types**: `'admin' | 'user'`

## Tipos de Dados Comuns

### Primitivos

```typescript
export interface User {
  id: string;              // ID único
  name: string;            // Texto
  age: number;             // Número
  isActive: boolean;       // Booleano
  birthDate: Date;         // Data
  tags: string[];          // Array
  metadata: Record<string, any>;  // Objeto genérico
}
```

### Opcionais

```typescript
export interface Customer {
  id: string;
  name: string;
  phone?: string;          // Opcional
  email?: string;
}
```

### Union Types

```typescript
export type UserRole = 'admin' | 'user' | 'guest';
export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'delivered';

export interface User {
  id: string;
  role: UserRole;
}
```

### Enums (use com moderação)

```typescript
// Prefira union types, mas enums são úteis para valores numéricos
export enum Priority {
  Low = 1,
  Medium = 2,
  High = 3,
  Critical = 4
}
```

## Relações entre Entidades

### Referências Simples (IDs)

```typescript
export interface Order {
  id: string;
  customerId: string;      // Apenas ID
  productIds: string[];    // Array de IDs
  total: number;
}
```

### Objetos Aninhados

```typescript
export interface OrderDetail {
  id: string;
  customer: Customer;      // Objeto completo
  items: OrderItem[];      // Array de objetos
  total: number;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}
```

## Utility Types do TypeScript

```typescript
// Partial - todos campos opcionais
type PartialCustomer = Partial<Customer>;

// Pick - selecionar campos específicos
type CustomerSummary = Pick<Customer, 'id' | 'name' | 'email'>;

// Omit - excluir campos
type CustomerWithoutTimestamps = Omit<Customer, 'createdAt' | 'updatedAt'>;

// Required - todos campos obrigatórios
type RequiredCustomer = Required<Customer>;

// Readonly - todos campos readonly
type ImmutableCustomer = Readonly<Customer>;

// Record - objeto com chaves específicas
type CustomerMap = Record<string, Customer>;
```

## Types vs Interfaces

### Quando usar Interface

```typescript
// ✅ Bom - Use interface para objetos
export interface Customer {
  id: string;
  name: string;
}

// ✅ Bom - Interfaces podem ser extended
export interface PremiumCustomer extends Customer {
  membershipLevel: string;
}
```

### Quando usar Type

```typescript
// ✅ Bom - Use type para unions
export type Status = 'active' | 'inactive' | 'pending';

// ✅ Bom - Use type para intersections
export type CustomerWithAddress = Customer & Address;

// ✅ Bom - Use type para tipos complexos
export type ApiResponse<T> = {
  data: T;
  error?: string;
};
```

## Nomenclatura

- **Arquivo**: `[entidade].type.ts` (ex: `customer.type.ts`)
- **Interface**: `[Entidade]` (ex: `Customer`)
- **Localização**: `src/app/types/`

## Checklist

- [ ] Type tem nome claro e descritivo
- [ ] Campos obrigatórios vs opcionais estão corretos
- [ ] Types de domínio separados de types da API
- [ ] Input types não incluem id ou timestamps
- [ ] Documentação JSDoc quando necessário
- [ ] Usa tipos específicos (evita `any`)

## Exemplos Completos

Para exemplos mais detalhados, consulte:

- **references/type-patterns.md**: Padrões comuns de types
- **references/api-types.md**: Como definir tipos de API
- **references/utility-types.md**: Uso de utility types

## Script de Geração

```bash
bash .agents/skills/create-types/scripts/generate-types.sh customer
```

## Regras Importantes

- Types NÃO contêm lógica
- Types NÃO fazem validação (isso é em runtime)
- Sempre use tipos explícitos, evite `any`
- Separe types de domínio de types da API
- Use nomes descritivos e consistentes
