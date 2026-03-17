# Skill: Criar Organism

Esta skill ensina como criar componentes Organism no padrão Atomic Design.

## O que é um Organism?

Organisms são componentes complexos compostos por molecules e/ou atoms. São autossuficientes e geralmente representam seções distintas da interface.

**Exemplos**: Header completo, Sidebar, Product Card, Customer Form, Data Table

## Quando Criar um Organism

- ✅ Componente complexo e autossuficiente
- ✅ Representa seção distinta da UI
- ✅ Pode injetar controllers
- ✅ Composto por molecules e atoms

## Estrutura Básica

```typescript
@Component({
  selector: 'app-customer-form',
  template: `
    <form [formGroup]="form" (ngSubmit)="handleSubmit()">
      <app-form-field
        label="Nome"
        [error]="getError('name')"
        [(value)]="form.controls.name.value"
      />
      
      <app-form-field
        label="Email"
        type="email"
        [error]="getError('email')"
        [(value)]="form.controls.email.value"
      />
      
      <div class="actions">
        <app-button variant="secondary" (clicked)="cancel.emit()">
          Cancelar
        </app-button>
        <app-button type="submit" [disabled]="form.invalid">
          Salvar
        </app-button>
      </div>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerFormComponent {
  initialData = input<Customer | null>(null);
  loading = input(false);
  
  submit = output<CustomerInput>();
  cancel = output<void>();
  
  form: FormGroup;
  
  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }
  
  handleSubmit() {
    if (this.form.valid) {
      this.submit.emit(this.form.value);
    }
  }
  
  getError(field: string): string | null {
    const control = this.form.get(field);
    if (control?.invalid && control?.touched) {
      return 'Campo inválido';
    }
    return null;
  }
}
```

## Localização

```
src/app/ui/organisms/
├── header/
├── sidebar/
├── customer-form/
└── product-card/
```

## Pode Injetar Controllers

```typescript
@Component({
  selector: 'app-header'
})
export class HeaderComponent {
  authController = inject(AuthController);
  
  logout() {
    this.authController.logout();
  }
}
```

## Checklist

- [ ] Composto por molecules e atoms
- [ ] Tem propósito claro
- [ ] Pode injetar controllers
- [ ] OnPush change detection

## Referências

- **references/common-organisms.md**: Exemplos completos
- **references/complex-patterns.md**: Padrões avançados

## Script

```bash
bash .agents/skills/create-organism/scripts/generate-organism.sh customer-form
```
