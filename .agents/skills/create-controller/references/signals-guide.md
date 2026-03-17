# Signals Guide - Guia Completo de Signals no Angular

Signals são a nova forma reativa de gerenciar estado no Angular 16+.

## O que são Signals?

Signals são valores reativos que notificam consumidores quando mudam.

```typescript
import { signal, computed, effect } from '@angular/core';

// Criar um signal
const count = signal(0);

// Ler valor
console.log(count()); // 0

// Atualizar valor
count.set(5);
count.update(value => value + 1);
```

## Criando Signals

### signal() - Signal Básico

```typescript
// Signal com valor primitivo
const name = signal('João');
const age = signal(25);
const isActive = signal(true);

// Signal com objeto
const user = signal({
  name: 'João',
  email: 'joao@example.com'
});

// Signal com array
const items = signal<string[]>([]);
```

### Tipos Genéricos

```typescript
const customers = signal<Customer[]>([]);
const selectedId = signal<string | null>(null);
const status = signal<'idle' | 'loading' | 'success' | 'error'>('idle');
```

## Lendo Signals

Para ler o valor de um signal, chame-o como função:

```typescript
const count = signal(0);
const value = count(); // 0
```

## Atualizando Signals

### set() - Substituir Valor

```typescript
const count = signal(0);
count.set(10); // Agora é 10
count.set(20); // Agora é 20

const user = signal({ name: 'João' });
user.set({ name: 'Maria' }); // Substitui completamente
```

### update() - Modificar Baseado no Valor Atual

```typescript
const count = signal(0);
count.update(current => current + 1); // Incrementa

const items = signal([1, 2, 3]);
items.update(current => [...current, 4]); // Adiciona item
items.update(current => current.filter(x => x !== 2)); // Remove item
```

## Computed Signals

Computed signals derivam seu valor de outros signals automaticamente.

```typescript
const firstName = signal('João');
const lastName = signal('Silva');

// Computed se atualiza automaticamente quando firstName ou lastName mudam
const fullName = computed(() => `${firstName()} ${lastName()}`);

console.log(fullName()); // "João Silva"

firstName.set('Maria');
console.log(fullName()); // "Maria Silva"
```

### Exemplos Práticos

```typescript
// Contagem
const items = signal([1, 2, 3, 4, 5]);
const itemCount = computed(() => items().length);

// Filtros
const products = signal<Product[]>([...]);
const activeProducts = computed(() => 
  products().filter(p => p.active)
);

// Cálculos
const cartItems = signal<CartItem[]>([...]);
const total = computed(() => 
  cartItems().reduce((sum, item) => sum + item.price * item.quantity, 0)
);

// Validações
const email = signal('');
const isValidEmail = computed(() => 
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email())
);

// Estados compostos
const firstName = signal('');
const lastName = signal('');
const email = signal('');
const isFormValid = computed(() => 
  firstName().length > 0 && 
  lastName().length > 0 && 
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email())
);
```

## Effects

Effects executam código quando signals mudam.

```typescript
const count = signal(0);

// Effect executa sempre que count muda
effect(() => {
  console.log(`Count changed to: ${count()}`);
});

count.set(1); // Logs: "Count changed to: 1"
count.set(2); // Logs: "Count changed to: 2"
```

### Casos de Uso

```typescript
// Sincronizar com localStorage
effect(() => {
  localStorage.setItem('user', JSON.stringify(user()));
});

// Logging
effect(() => {
  console.log('State changed:', state());
});

// Side effects baseados em estado
effect(() => {
  if (isLoggedIn()) {
    loadUserData();
  }
});
```

## Signals em Controllers

### Padrão Básico

```typescript
@Injectable({ providedIn: 'root' })
export class CustomerController {
  // Estado
  customers = signal<Customer[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  selectedCustomer = signal<Customer | null>(null);

  // Estado derivado
  customerCount = computed(() => this.customers().length);
  hasCustomers = computed(() => this.customers().length > 0);
  activeCustomers = computed(() => 
    this.customers().filter(c => c.active)
  );
}
```

### Operações com Arrays

```typescript
// Adicionar item
this.customers.update(list => [...list, newCustomer]);

// Atualizar item
this.customers.update(list => 
  list.map(c => c.id === id ? updatedCustomer : c)
);

// Remover item
this.customers.update(list => 
  list.filter(c => c.id !== id)
);

// Substituir completamente
this.customers.set(newList);

// Limpar
this.customers.set([]);
```

### Operações com Objetos

```typescript
const user = signal({ name: 'João', age: 25 });

// Atualizar campo específico
user.update(current => ({ ...current, age: 26 }));

// Adicionar campos
user.update(current => ({ ...current, email: 'joao@example.com' }));

// Substituir completamente
user.set({ name: 'Maria', age: 30 });
```

## Signals em Components

```typescript
@Component({
  selector: 'app-customer-list',
  template: `
    <!-- Leitura direta no template -->
    <div>Total: {{ controller.customerCount() }}</div>
    
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
export class CustomerListComponent {
  controller = inject(CustomerController);
}
```

## Model Signals (Two-way Binding)

```typescript
import { model } from '@angular/core';

@Component({
  selector: 'app-input',
  template: `
    <input [(ngModel)]="value" />
  `
})
export class InputComponent {
  // Model signal para two-way binding
  value = model('');
}

// Uso no parent
@Component({
  template: `
    <app-input [(value)]="searchTerm" />
    <div>Searching for: {{ searchTerm() }}</div>
  `
})
export class ParentComponent {
  searchTerm = signal('');
}
```

## Input Signals

```typescript
import { input } from '@angular/core';

@Component({
  selector: 'app-user-card'
})
export class UserCardComponent {
  // Input signal obrigatório
  user = input.required<User>();
  
  // Input signal opcional com default
  size = input<'small' | 'large'>('small');
  
  // Computed baseado em input
  displayName = computed(() => 
    this.user().firstName + ' ' + this.user().lastName
  );
}
```

## Output Signals

```typescript
import { output } from '@angular/core';

@Component({
  selector: 'app-button'
})
export class ButtonComponent {
  // Output signal
  clicked = output<void>();
  
  handleClick() {
    this.clicked.emit();
  }
}
```

## Boas Práticas

### 1. Sempre use signals para estado

```typescript
// ✅ Bom
customers = signal<Customer[]>([]);

// ❌ Ruim
customers: Customer[] = [];
```

### 2. Use computed para valores derivados

```typescript
// ✅ Bom
customerCount = computed(() => this.customers().length);

// ❌ Ruim
get customerCount() {
  return this.customers().length;
}
```

### 3. Prefira update() a set() para modificações

```typescript
// ✅ Bom - Baseado no valor atual
this.count.update(n => n + 1);

// ❌ Ruim - Pode ter race conditions
this.count.set(this.count() + 1);
```

### 4. Não modifique objetos/arrays diretamente

```typescript
// ❌ Ruim - Mutação direta
this.users()[0].name = 'New Name';

// ✅ Bom - Imutável
this.users.update(users => 
  users.map((u, i) => i === 0 ? { ...u, name: 'New Name' } : u)
);
```

### 5. Use tipos específicos

```typescript
// ✅ Bom
status = signal<'idle' | 'loading' | 'success' | 'error'>('idle');

// ❌ Ruim
status = signal('idle');
```

## Performance

Signals são otimizados e só recalculam quando necessário:

```typescript
const firstName = signal('João');
const lastName = signal('Silva');
const age = signal(25);

const fullName = computed(() => {
  console.log('Computing full name');
  return `${firstName()} ${lastName()}`;
});

// Só executa quando firstName ou lastName mudam
fullName(); // Logs: "Computing full name"
age.set(26); // Não executa o computed
firstName.set('Maria'); // Logs: "Computing full name"
```

## Comparação: Signals vs RxJS

### Signals
- Síncronos
- Mais simples
- Melhor para estado local
- Change detection otimizada

### RxJS
- Assíncronos
- Mais poderoso
- Melhor para streams complexos
- Operators ricos

### Uso Combinado

```typescript
@Injectable({ providedIn: 'root' })
export class CustomerController {
  private repo = inject(CustomerRepository);
  
  customers = signal<Customer[]>([]);
  loading = signal(false);

  loadCustomers() {
    this.loading.set(true);
    
    // RxJS para async, Signal para estado
    this.repo.getAll().subscribe({
      next: (customers) => {
        this.customers.set(customers); // Signal
        this.loading.set(false);
      }
    });
  }
}
```
