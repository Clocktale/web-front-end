# Skill: Criar Controller

Esta skill ensina como criar um Controller para gerenciar estado e orquestrar a lógica da aplicação.

## Quando Usar

Use esta skill quando precisar:
- Gerenciar estado de uma tela ou funcionalidade
- Orquestrar chamadas a múltiplos repositories
- Implementar lógica de negócio
- Expor ações que a UI pode chamar
- Gerenciar loading e error states

## Pré-requisitos

Antes de criar um controller:
1. Repositories necessários já devem existir
2. Types da entidade devem estar definidos
3. Compreensão de signals do Angular

## Estrutura Básica

```typescript
import { Injectable, inject, signal, computed } from '@angular/core';
import { [Entidade]Repository } from '../repositories/[entidade].repository';
import { [Entidade], [Entidade]Input } from '../types/[entidade].type';

@Injectable({ providedIn: 'root' })
export class [Entidade]Controller {
  private repo = inject([Entidade]Repository);

  // Estado
  items = signal<[Entidade][]>([]);
  selectedItem = signal<[Entidade] | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);

  // Estado derivado
  itemCount = computed(() => this.items().length);
  hasItems = computed(() => this.items().length > 0);
  hasError = computed(() => this.error() !== null);

  // Ações
  loadItems() {
    this.loading.set(true);
    this.error.set(null);

    this.repo.getAll().subscribe({
      next: (items) => {
        this.items.set(items);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Erro ao carregar itens');
        this.loading.set(false);
        console.error(err);
      }
    });
  }

  selectItem(item: [Entidade]) {
    this.selectedItem.set(item);
  }

  clearError() {
    this.error.set(null);
  }
}
```

## Signals e Computed

### Signals Básicos

```typescript
// Estado simples
customers = signal<Customer[]>([]);
loading = signal(false);
error = signal<string | null>(null);

// Lendo valor
const count = this.customers().length;

// Atualizando valor
this.customers.set([customer1, customer2]);
this.loading.set(true);
```

### Computed Signals

```typescript
// Estado derivado que atualiza automaticamente
customerCount = computed(() => this.customers().length);
hasCustomers = computed(() => this.customers().length > 0);
activeCustomers = computed(() => 
  this.customers().filter(c => c.active)
);
```

### Update vs Set

```typescript
// set() - substitui completamente o valor
this.customers.set([customer1, customer2]);

// update() - modifica baseado no valor atual
this.customers.update(current => [...current, newCustomer]);
this.customers.update(current => current.filter(c => c.id !== id));
```

## CRUD Básico

```typescript
@Injectable({ providedIn: 'root' })
export class CustomerController {
  private customerRepo = inject(CustomerRepository);

  customers = signal<Customer[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  loadCustomers() {
    this.loading.set(true);
    this.error.set(null);

    this.customerRepo.getAll().subscribe({
      next: (customers) => {
        this.customers.set(customers);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Erro ao carregar clientes');
        this.loading.set(false);
      }
    });
  }

  createCustomer(input: CustomerInput) {
    this.loading.set(true);

    this.customerRepo.create(input).subscribe({
      next: (customer) => {
        this.customers.update(list => [...list, customer]);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Erro ao criar cliente');
        this.loading.set(false);
      }
    });
  }

  updateCustomer(id: string, input: CustomerInput) {
    this.loading.set(true);

    this.customerRepo.update(id, input).subscribe({
      next: (updated) => {
        this.customers.update(list => 
          list.map(c => c.id === id ? updated : c)
        );
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Erro ao atualizar cliente');
        this.loading.set(false);
      }
    });
  }

  deleteCustomer(id: string) {
    this.loading.set(true);

    this.customerRepo.delete(id).subscribe({
      next: () => {
        this.customers.update(list => list.filter(c => c.id !== id));
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Erro ao deletar cliente');
        this.loading.set(false);
      }
    });
  }
}
```

## Padrões de Loading e Error

### Pattern 1: Flags Separadas

```typescript
loading = signal(false);
error = signal<string | null>(null);

loadData() {
  this.loading.set(true);
  this.error.set(null);
  
  this.repo.getData().subscribe({
    next: (data) => {
      this.data.set(data);
      this.loading.set(false);
    },
    error: (err) => {
      this.error.set('Erro ao carregar');
      this.loading.set(false);
    }
  });
}
```

### Pattern 2: Request State

```typescript
type RequestState = 'idle' | 'loading' | 'success' | 'error';

requestState = signal<RequestState>('idle');
error = signal<string | null>(null);

loadData() {
  this.requestState.set('loading');
  
  this.repo.getData().subscribe({
    next: (data) => {
      this.data.set(data);
      this.requestState.set('success');
    },
    error: (err) => {
      this.error.set('Erro');
      this.requestState.set('error');
    }
  });
}

// Computed para facilitar uso na UI
isLoading = computed(() => this.requestState() === 'loading');
hasError = computed(() => this.requestState() === 'error');
```

## Orquestração de Múltiplos Repositories

```typescript
@Injectable({ providedIn: 'root' })
export class OrderController {
  private orderRepo = inject(OrderRepository);
  private customerRepo = inject(CustomerRepository);
  private productRepo = inject(ProductRepository);

  order = signal<Order | null>(null);
  customer = signal<Customer | null>(null);
  products = signal<Product[]>([]);
  loading = signal(false);

  loadOrderDetails(orderId: string) {
    this.loading.set(true);

    this.orderRepo.get(orderId).subscribe({
      next: (order) => {
        this.order.set(order);
        
        // Busca customer
        this.customerRepo.get(order.customerId).subscribe({
          next: (customer) => this.customer.set(customer)
        });

        // Busca products
        this.productRepo.getByIds(order.productIds).subscribe({
          next: (products) => {
            this.products.set(products);
            this.loading.set(false);
          }
        });
      }
    });
  }
}
```

## Lógica de Negócio

```typescript
@Injectable({ providedIn: 'root' })
export class CartController {
  private cartRepo = inject(CartRepository);

  items = signal<CartItem[]>([]);
  
  // Lógica: calcular total
  total = computed(() => 
    this.items().reduce((sum, item) => sum + (item.price * item.quantity), 0)
  );

  // Lógica: verificar se pode finalizar
  canCheckout = computed(() => 
    this.items().length > 0 && this.total() > 0
  );

  // Lógica: adicionar item
  addItem(productId: string, quantity: number) {
    const existingItem = this.items().find(i => i.productId === productId);
    
    if (existingItem) {
      // Incrementa quantidade
      this.items.update(items =>
        items.map(i => 
          i.productId === productId 
            ? { ...i, quantity: i.quantity + quantity }
            : i
        )
      );
    } else {
      // Adiciona novo item
      this.items.update(items => [...items, newItem]);
    }
  }
}
```

## Uso em Componentes

```typescript
import { Component, inject, OnInit } from '@angular/core';
import { CustomerController } from '../controllers/customer.controller';

@Component({
  selector: 'app-customer-list',
  template: `
    @if (controller.loading()) {
      <div>Carregando...</div>
    }
    
    @if (controller.error()) {
      <div class="error">{{ controller.error() }}</div>
    }
    
    @for (customer of controller.customers(); track customer.id) {
      <div>{{ customer.name }}</div>
    }
  `
})
export class CustomerListComponent implements OnInit {
  controller = inject(CustomerController);

  ngOnInit() {
    this.controller.loadCustomers();
  }
}
```

## Nomenclatura

- **Arquivo**: `[entidade].controller.ts` (ex: `customer.controller.ts`)
- **Classe**: `[Entidade]Controller` (ex: `CustomerController`)
- **Localização**: `src/app/controllers/`

## Checklist

- [ ] Decorator `@Injectable({ providedIn: 'root' })`
- [ ] Usa `inject()` para dependencies
- [ ] Estado gerenciado com `signal()`
- [ ] Estado derivado usa `computed()`
- [ ] Ações têm nomes com verbos claros
- [ ] Tratamento de erros implementado
- [ ] Loading states gerenciados

## Exemplos Completos

Consulte as referências para exemplos detalhados:

- **references/signals-guide.md**: Guia completo de signals
- **references/state-patterns.md**: Padrões de estado
- **references/orchestration-examples.md**: Orquestração complexa
- **references/error-handling.md**: Tratamento de erros

## Script de Geração

```bash
bash .agents/skills/create-controller/scripts/generate-controller.sh customer
```

## Regras Importantes

- Controller NÃO faz requisições HTTP diretamente (use repositories)
- Controller NÃO contém lógica de apresentação
- Controller NÃO manipula DOM
- Controller usa signals para TODO estado
- Controller orquestra, NÃO busca
