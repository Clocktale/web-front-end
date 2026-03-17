# State Patterns - Padrões de Gerenciamento de Estado

## Pattern 1: Loading/Error States com Flags

```typescript
@Injectable({ providedIn: 'root' })
export class CustomerController {
  customers = signal<Customer[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  loadCustomers() {
    this.loading.set(true);
    this.error.set(null);

    this.repo.getAll().subscribe({
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
}
```

## Pattern 2: Request State Enum

```typescript
type RequestState = 'idle' | 'loading' | 'success' | 'error';

@Injectable({ providedIn: 'root' })
export class CustomerController {
  customers = signal<Customer[]>([]);
  requestState = signal<RequestState>('idle');
  error = signal<string | null>(null);

  // Computed helpers
  isLoading = computed(() => this.requestState() === 'loading');
  isSuccess = computed(() => this.requestState() === 'success');
  isError = computed(() => this.requestState() === 'error');
  isIdle = computed(() => this.requestState() === 'idle');

  loadCustomers() {
    this.requestState.set('loading');
    this.error.set(null);

    this.repo.getAll().subscribe({
      next: (customers) => {
        this.customers.set(customers);
        this.requestState.set('success');
      },
      error: (err) => {
        this.error.set(err.message);
        this.requestState.set('error');
      }
    });
  }
}
```

## Pattern 3: Resource Pattern (Data + Meta)

```typescript
interface Resource<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

@Injectable({ providedIn: 'root' })
export class CustomerController {
  customers = signal<Resource<Customer[]>>({
    data: null,
    loading: false,
    error: null,
    lastUpdated: null
  });

  // Computed helpers
  customersData = computed(() => this.customers().data ?? []);
  isLoading = computed(() => this.customers().loading);
  hasError = computed(() => this.customers().error !== null);

  loadCustomers() {
    this.customers.update(state => ({
      ...state,
      loading: true,
      error: null
    }));

    this.repo.getAll().subscribe({
      next: (data) => {
        this.customers.set({
          data,
          loading: false,
          error: null,
          lastUpdated: new Date()
        });
      },
      error: (err) => {
        this.customers.update(state => ({
          ...state,
          loading: false,
          error: err.message
        }));
      }
    });
  }
}
```

## Pattern 4: Pagination State

```typescript
interface PaginationState<T> {
  items: T[];
  currentPage: number;
  pageSize: number;
  total: number;
  loading: boolean;
  error: string | null;
}

@Injectable({ providedIn: 'root' })
export class CustomerController {
  state = signal<PaginationState<Customer>>({
    items: [],
    currentPage: 1,
    pageSize: 10,
    total: 0,
    loading: false,
    error: null
  });

  // Computed
  totalPages = computed(() => 
    Math.ceil(this.state().total / this.state().pageSize)
  );
  hasNextPage = computed(() => 
    this.state().currentPage < this.totalPages()
  );
  hasPrevPage = computed(() => 
    this.state().currentPage > 1
  );

  loadPage(page: number) {
    this.state.update(s => ({ ...s, loading: true, error: null }));

    this.repo.getPaginated(page, this.state().pageSize).subscribe({
      next: (response) => {
        this.state.set({
          items: response.data,
          currentPage: page,
          pageSize: this.state().pageSize,
          total: response.total,
          loading: false,
          error: null
        });
      },
      error: (err) => {
        this.state.update(s => ({
          ...s,
          loading: false,
          error: err.message
        }));
      }
    });
  }

  nextPage() {
    if (this.hasNextPage()) {
      this.loadPage(this.state().currentPage + 1);
    }
  }

  prevPage() {
    if (this.hasPrevPage()) {
      this.loadPage(this.state().currentPage - 1);
    }
  }
}
```

## Pattern 5: Filter State

```typescript
interface FilterState {
  search: string;
  category: string | null;
  status: 'all' | 'active' | 'inactive';
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

@Injectable({ providedIn: 'root' })
export class ProductController {
  products = signal<Product[]>([]);
  filters = signal<FilterState>({
    search: '',
    category: null,
    status: 'all',
    sortBy: 'name',
    sortOrder: 'asc'
  });

  // Produtos filtrados
  filteredProducts = computed(() => {
    const products = this.products();
    const filters = this.filters();

    let result = [...products];

    // Filtro de busca
    if (filters.search) {
      result = result.filter(p => 
        p.name.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Filtro de categoria
    if (filters.category) {
      result = result.filter(p => p.categoryId === filters.category);
    }

    // Filtro de status
    if (filters.status !== 'all') {
      result = result.filter(p => 
        filters.status === 'active' ? p.active : !p.active
      );
    }

    // Ordenação
    result.sort((a, b) => {
      const aValue = a[filters.sortBy as keyof Product];
      const bValue = b[filters.sortBy as keyof Product];
      const order = filters.sortOrder === 'asc' ? 1 : -1;
      return aValue > bValue ? order : -order;
    });

    return result;
  });

  updateFilter(updates: Partial<FilterState>) {
    this.filters.update(current => ({ ...current, ...updates }));
  }

  resetFilters() {
    this.filters.set({
      search: '',
      category: null,
      status: 'all',
      sortBy: 'name',
      sortOrder: 'asc'
    });
  }
}
```

## Pattern 6: Selection State

```typescript
@Injectable({ providedIn: 'root' })
export class CustomerController {
  customers = signal<Customer[]>([]);
  selectedIds = signal<Set<string>>(new Set());

  // Computed
  selectedCustomers = computed(() => {
    const ids = this.selectedIds();
    return this.customers().filter(c => ids.has(c.id));
  });
  allSelected = computed(() => 
    this.customers().length > 0 &&
    this.customers().every(c => this.selectedIds().has(c.id))
  );
  someSelected = computed(() => 
    this.selectedIds().size > 0 && !this.allSelected()
  );
  selectedCount = computed(() => this.selectedIds().size);

  toggleSelection(id: string) {
    this.selectedIds.update(ids => {
      const newIds = new Set(ids);
      if (newIds.has(id)) {
        newIds.delete(id);
      } else {
        newIds.add(id);
      }
      return newIds;
    });
  }

  toggleAll() {
    if (this.allSelected()) {
      this.selectedIds.set(new Set());
    } else {
      this.selectedIds.set(new Set(this.customers().map(c => c.id)));
    }
  }

  clearSelection() {
    this.selectedIds.set(new Set());
  }

  deleteSelected() {
    const ids = Array.from(this.selectedIds());
    // Deletar cada um
    ids.forEach(id => this.deleteCustomer(id));
    this.clearSelection();
  }
}
```

## Pattern 7: Form State

```typescript
interface FormState<T> {
  data: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  dirty: boolean;
  valid: boolean;
  submitting: boolean;
}

@Injectable({ providedIn: 'root' })
export class CustomerFormController {
  form = signal<FormState<CustomerInput>>({
    data: {
      name: '',
      email: '',
      phone: ''
    },
    errors: {},
    touched: {},
    dirty: false,
    valid: false,
    submitting: false
  });

  updateField<K extends keyof CustomerInput>(field: K, value: CustomerInput[K]) {
    this.form.update(state => ({
      ...state,
      data: { ...state.data, [field]: value },
      dirty: true,
      touched: { ...state.touched, [field]: true }
    }));
    this.validate();
  }

  validate() {
    const data = this.form().data;
    const errors: Partial<Record<keyof CustomerInput, string>> = {};

    if (!data.name) errors.name = 'Nome é obrigatório';
    if (!data.email) errors.email = 'Email é obrigatório';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.email = 'Email inválido';
    }

    this.form.update(state => ({
      ...state,
      errors,
      valid: Object.keys(errors).length === 0
    }));
  }

  submit() {
    if (!this.form().valid) return;

    this.form.update(s => ({ ...s, submitting: true }));

    this.repo.create(this.form().data).subscribe({
      next: () => {
        this.reset();
      },
      error: (err) => {
        this.form.update(s => ({ 
          ...s, 
          submitting: false,
          errors: { ...s.errors, _general: err.message }
        }));
      }
    });
  }

  reset() {
    this.form.set({
      data: { name: '', email: '', phone: '' },
      errors: {},
      touched: {},
      dirty: false,
      valid: false,
      submitting: false
    });
  }
}
```

## Pattern 8: Optimistic Updates

```typescript
@Injectable({ providedIn: 'root' })
export class CustomerController {
  customers = signal<Customer[]>([]);

  updateCustomer(id: string, updates: Partial<Customer>) {
    // Backup do estado atual
    const originalCustomers = this.customers();

    // Update otimista (imediato na UI)
    this.customers.update(list => 
      list.map(c => c.id === id ? { ...c, ...updates } : c)
    );

    // Tenta salvar no backend
    this.repo.update(id, updates).subscribe({
      next: (updated) => {
        // Sucesso: atualiza com dados do servidor
        this.customers.update(list => 
          list.map(c => c.id === id ? updated : c)
        );
      },
      error: (err) => {
        // Erro: reverte para estado original
        this.customers.set(originalCustomers);
        this.error.set('Falha ao atualizar. Revertido.');
      }
    });
  }
}
```

## Pattern 9: Cache com TTL

```typescript
interface CacheEntry<T> {
  data: T;
  timestamp: Date;
  ttl: number; // milliseconds
}

@Injectable({ providedIn: 'root' })
export class CategoryController {
  private cache = signal<CacheEntry<Category[]> | null>(null);
  categories = signal<Category[]>([]);

  loadCategories(forceRefresh = false) {
    const cached = this.cache();

    // Verifica se cache é válido
    if (!forceRefresh && cached) {
      const age = Date.now() - cached.timestamp.getTime();
      if (age < cached.ttl) {
        this.categories.set(cached.data);
        return;
      }
    }

    // Busca do servidor
    this.repo.getAll().subscribe({
      next: (data) => {
        this.categories.set(data);
        this.cache.set({
          data,
          timestamp: new Date(),
          ttl: 5 * 60 * 1000 // 5 minutos
        });
      }
    });
  }
}
```

## Pattern 10: Undo/Redo

```typescript
interface History<T> {
  past: T[];
  present: T;
  future: T[];
}

@Injectable({ providedIn: 'root' })
export class EditorController {
  private history = signal<History<string>>({
    past: [],
    present: '',
    future: []
  });

  content = computed(() => this.history().present);
  canUndo = computed(() => this.history().past.length > 0);
  canRedo = computed(() => this.history().future.length > 0);

  updateContent(newContent: string) {
    this.history.update(h => ({
      past: [...h.past, h.present],
      present: newContent,
      future: []
    }));
  }

  undo() {
    if (!this.canUndo()) return;

    this.history.update(h => {
      const previous = h.past[h.past.length - 1];
      return {
        past: h.past.slice(0, -1),
        present: previous,
        future: [h.present, ...h.future]
      };
    });
  }

  redo() {
    if (!this.canRedo()) return;

    this.history.update(h => {
      const next = h.future[0];
      return {
        past: [...h.past, h.present],
        present: next,
        future: h.future.slice(1)
      };
    });
  }
}
```
