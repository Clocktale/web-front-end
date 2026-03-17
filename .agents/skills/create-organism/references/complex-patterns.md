# Complex Patterns

## Pattern 1: Form with Validation
```typescript
export class FormComponent {
  form = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]]
  });
  
  getError(field: string) {
    const control = this.form.get(field);
    if (control?.hasError('required')) return 'Campo obrigatório';
    if (control?.hasError('email')) return 'Email inválido';
    return null;
  }
}
```

## Pattern 2: Controller Integration
```typescript
export class ListComponent {
  controller = inject(CustomerController);
  
  ngOnInit() {
    this.controller.loadCustomers();
  }
}
```
