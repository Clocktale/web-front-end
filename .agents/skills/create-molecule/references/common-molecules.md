# Common Molecules

## Form Field
```typescript
@Component({
  selector: 'app-form-field',
  template: `
    <div>
      <app-label [required]="required()">{{ label() }}</app-label>
      <app-input [type]="type()" [(value)]="value" />
      @if (error()) { <span class="error">{{ error() }}</span> }
    </div>
  `
})
export class FormFieldComponent {
  label = input.required<string>();
  type = input<'text' | 'email'>('text');
  required = input(false);
  error = input<string | null>(null);
  value = model('');
}
```

## Search Bar
```typescript
@Component({
  selector: 'app-search-bar',
  template: `
    <div class="search-bar">
      <app-input [(value)]="term" />
      <app-button (clicked)="search.emit(term())">Buscar</app-button>
    </div>
  `
})
export class SearchBarComponent {
  term = signal('');
  search = output<string>();
}
```

## Card Header
```typescript
@Component({
  selector: 'app-card-header',
  template: `
    <div class="card-header">
      <h3>{{ title() }}</h3>
      @if (subtitle()) { <p>{{ subtitle() }}</p> }
      @if (icon()) { <app-icon [name]="icon()!" /> }
    </div>
  `
})
export class CardHeaderComponent {
  title = input.required<string>();
  subtitle = input<string>();
  icon = input<string>();
}
```
