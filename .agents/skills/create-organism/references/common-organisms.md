# Common Organisms

## Header
```typescript
@Component({
  selector: 'app-header',
  template: `
    <header>
      <div class="logo">Logo</div>
      <nav><ng-content select="[nav]" /></nav>
      <app-search-bar />
      <div class="user">{{ authController.currentUser()?.name }}</div>
    </header>
  `
})
export class HeaderComponent {
  authController = inject(AuthController);
}
```

## Customer Form
```typescript
@Component({
  selector: 'app-customer-form',
  template: `
    <form (ngSubmit)="submit.emit(form.value)">
      <app-form-field label="Nome" [(value)]="name" />
      <app-form-field label="Email" [(value)]="email" />
      <app-button type="submit">Salvar</app-button>
    </form>
  `
})
export class CustomerFormComponent {
  name = signal('');
  email = signal('');
  submit = output<CustomerInput>();
}
```
