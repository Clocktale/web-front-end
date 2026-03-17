# Orchestration Examples - Orquestração de Múltiplos Repositories

## Pattern 1: Sequential Loading

Carrega dados em sequência, onde cada passo depende do anterior.

```typescript
@Injectable({ providedIn: 'root' })
export class OrderDetailController {
  private orderRepo = inject(OrderRepository);
  private customerRepo = inject(CustomerRepository);
  private productRepo = inject(ProductRepository);

  order = signal<Order | null>(null);
  customer = signal<Customer | null>(null);
  products = signal<Product[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  loadOrderDetails(orderId: string) {
    this.loading.set(true);
    this.error.set(null);

    // 1. Busca a ordem
    this.orderRepo.get(orderId).subscribe({
      next: (order) => {
        this.order.set(order);

        // 2. Busca o cliente da ordem
        this.customerRepo.get(order.customerId).subscribe({
          next: (customer) => {
            this.customer.set(customer);
          },
          error: (err) => {
            console.error('Erro ao carregar cliente:', err);
          }
        });

        // 3. Busca os produtos da ordem
        this.productRepo.getByIds(order.productIds).subscribe({
          next: (products) => {
            this.products.set(products);
            this.loading.set(false);
          },
          error: (err) => {
            this.error.set('Erro ao carregar produtos');
            this.loading.set(false);
          }
        });
      },
      error: (err) => {
        this.error.set('Erro ao carregar ordem');
        this.loading.set(false);
      }
    });
  }
}
```

## Pattern 2: Parallel Loading com forkJoin

Carrega múltiplos dados em paralelo.

```typescript
import { forkJoin } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DashboardController {
  private customerRepo = inject(CustomerRepository);
  private orderRepo = inject(OrderRepository);
  private productRepo = inject(ProductRepository);

  customers = signal<Customer[]>([]);
  orders = signal<Order[]>([]);
  products = signal<Product[]>([]);
  loading = signal(false);

  loadDashboard() {
    this.loading.set(true);

    // Carrega tudo em paralelo
    forkJoin({
      customers: this.customerRepo.getAll(),
      orders: this.orderRepo.getAll(),
      products: this.productRepo.getAll()
    }).subscribe({
      next: ({ customers, orders, products }) => {
        this.customers.set(customers);
        this.orders.set(orders);
        this.products.set(products);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Erro ao carregar dashboard:', err);
        this.loading.set(false);
      }
    });
  }
}
```

## Pattern 3: Dependent Parallel Loading

Carrega dados onde alguns dependem de outros.

```typescript
import { switchMap, forkJoin } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProjectController {
  private projectRepo = inject(ProjectRepository);
  private taskRepo = inject(TaskRepository);
  private userRepo = inject(UserRepository);

  project = signal<Project | null>(null);
  tasks = signal<Task[]>([]);
  assignedUsers = signal<User[]>([]);
  loading = signal(false);

  loadProject(projectId: string) {
    this.loading.set(true);

    this.projectRepo.get(projectId).pipe(
      switchMap(project => {
        this.project.set(project);

        // Busca tasks e users em paralelo
        return forkJoin({
          tasks: this.taskRepo.getByProject(project.id),
          users: this.userRepo.getByIds(project.assignedUserIds)
        });
      })
    ).subscribe({
      next: ({ tasks, users }) => {
        this.tasks.set(tasks);
        this.assignedUsers.set(users);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Erro:', err);
        this.loading.set(false);
      }
    });
  }
}
```

## Pattern 4: Conditional Loading

Carrega dados condicionalmente baseado em regras.

```typescript
@Injectable({ providedIn: 'root' })
export class UserDashboardController {
  private authController = inject(AuthController);
  private userRepo = inject(UserRepository);
  private adminRepo = inject(AdminRepository);

  userData = signal<any>(null);
  loading = signal(false);

  loadUserData() {
    this.loading.set(true);
    const currentUser = this.authController.currentUser();

    if (!currentUser) {
      this.loading.set(false);
      return;
    }

    // Carrega dados diferentes baseado no role
    if (currentUser.role === 'admin') {
      this.adminRepo.getDashboard().subscribe({
        next: (data) => {
          this.userData.set(data);
          this.loading.set(false);
        }
      });
    } else {
      this.userRepo.getDashboard(currentUser.id).subscribe({
        next: (data) => {
          this.userData.set(data);
          this.loading.set(false);
        }
      });
    }
  }
}
```

## Pattern 5: Cascading Updates

Atualiza múltiplos recursos em cascata.

```typescript
@Injectable({ providedIn: 'root' })
export class OrderController {
  private orderRepo = inject(OrderRepository);
  private inventoryRepo = inject(InventoryRepository);
  private notificationRepo = inject(NotificationRepository);

  processing = signal(false);

  completeOrder(orderId: string) {
    this.processing.set(true);

    // 1. Atualiza a ordem
    this.orderRepo.updateStatus(orderId, 'completed').pipe(
      switchMap(order => {
        // 2. Atualiza inventário
        return this.inventoryRepo.updateStock(order.productIds);
      }),
      switchMap(() => {
        // 3. Envia notificação
        return this.notificationRepo.sendOrderComplete(orderId);
      })
    ).subscribe({
      next: () => {
        this.processing.set(false);
        // Recarrega dados
        this.loadOrders();
      },
      error: (err) => {
        console.error('Erro ao completar ordem:', err);
        this.processing.set(false);
      }
    });
  }
}
```

## Pattern 6: Aggregation from Multiple Sources

Agrega dados de múltiplas fontes.

```typescript
interface OrderWithDetails {
  order: Order;
  customer: Customer;
  products: Product[];
  totalValue: number;
}

@Injectable({ providedIn: 'root' })
export class ReportController {
  private orderRepo = inject(OrderRepository);
  private customerRepo = inject(CustomerRepository);
  private productRepo = inject(ProductRepository);

  ordersWithDetails = signal<OrderWithDetails[]>([]);
  loading = signal(false);

  loadOrdersReport() {
    this.loading.set(true);

    this.orderRepo.getAll().pipe(
      switchMap(orders => {
        // Para cada ordem, busca customer e products
        const detailRequests = orders.map(order =>
          forkJoin({
            order: [order],
            customer: this.customerRepo.get(order.customerId),
            products: this.productRepo.getByIds(order.productIds)
          })
        );

        return forkJoin(detailRequests);
      })
    ).subscribe({
      next: (results) => {
        const ordersWithDetails = results.map(({ order, customer, products }) => ({
          order: order[0],
          customer,
          products,
          totalValue: products.reduce((sum, p) => sum + p.price, 0)
        }));

        this.ordersWithDetails.set(ordersWithDetails);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Erro:', err);
        this.loading.set(false);
      }
    });
  }
}
```

## Pattern 7: Batch Operations

Executa operações em lote.

```typescript
@Injectable({ providedIn: 'root' })
export class BulkOperationController {
  private customerRepo = inject(CustomerRepository);
  private emailRepo = inject(EmailRepository);

  processing = signal(false);
  progress = signal(0);

  sendBulkEmails(customerIds: string[], emailTemplate: string) {
    this.processing.set(true);
    this.progress.set(0);

    // Busca todos os customers
    this.customerRepo.getByIds(customerIds).pipe(
      switchMap(customers => {
        // Envia email para cada um sequencialmente
        const total = customers.length;
        let completed = 0;

        const emailRequests = customers.map((customer, index) =>
          this.emailRepo.send(customer.email, emailTemplate).pipe(
            tap(() => {
              completed++;
              this.progress.set((completed / total) * 100);
            })
          )
        );

        // Executa em paralelo mas com controle
        return forkJoin(emailRequests);
      })
    ).subscribe({
      next: () => {
        this.processing.set(false);
        this.progress.set(100);
      },
      error: (err) => {
        console.error('Erro no envio em massa:', err);
        this.processing.set(false);
      }
    });
  }
}
```

## Pattern 8: Real-time Sync

Sincroniza dados em tempo real entre múltiplas fontes.

```typescript
@Injectable({ providedIn: 'root' })
export class ChatController {
  private messageRepo = inject(MessageRepository);
  private userRepo = inject(UserRepository);
  private presenceRepo = inject(PresenceRepository);

  messages = signal<Message[]>([]);
  users = signal<User[]>([]);
  onlineUsers = signal<string[]>([]);

  initializeChat(channelId: string) {
    // Carrega mensagens iniciais
    this.messageRepo.getByChannel(channelId).subscribe({
      next: (messages) => this.messages.set(messages)
    });

    // Carrega usuários do canal
    this.userRepo.getByChannel(channelId).subscribe({
      next: (users) => this.users.set(users)
    });

    // Observa presença em tempo real
    this.presenceRepo.watchOnline(channelId).subscribe({
      next: (onlineUserIds) => this.onlineUsers.set(onlineUserIds)
    });

    // Observa novas mensagens em tempo real
    this.messageRepo.watchNew(channelId).subscribe({
      next: (newMessage) => {
        this.messages.update(msgs => [...msgs, newMessage]);
      }
    });
  }
}
```

## Boas Práticas

### 1. Sempre gerencie loading states

```typescript
// ✅ Bom
loadData() {
  this.loading.set(true);
  this.repo.getData().subscribe({
    next: (data) => {
      this.data.set(data);
      this.loading.set(false);
    },
    error: () => this.loading.set(false)
  });
}
```

### 2. Trate erros em cada operação

```typescript
// ✅ Bom
forkJoin({
  users: this.userRepo.getAll().pipe(
    catchError(err => {
      console.error('Erro ao carregar users:', err);
      return of([]);
    })
  ),
  orders: this.orderRepo.getAll().pipe(
    catchError(err => {
      console.error('Erro ao carregar orders:', err);
      return of([]);
    })
  )
}).subscribe(...);
```

### 3. Use switchMap para operações dependentes

```typescript
// ✅ Bom
this.orderRepo.get(id).pipe(
  switchMap(order => this.customerRepo.get(order.customerId))
).subscribe(...);
```

### 4. Considere cancelamento

```typescript
private loadSubscription?: Subscription;

loadData() {
  // Cancela requisição anterior
  this.loadSubscription?.unsubscribe();

  this.loadSubscription = this.repo.getData().subscribe(...);
}

ngOnDestroy() {
  this.loadSubscription?.unsubscribe();
}
```
