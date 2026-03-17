# Styling Guide - Como Estilizar Atoms

## Opção 1: Inline Styles

```typescript
@Component({
  selector: 'app-button',
  template: `<button><ng-content /></button>`,
  styles: [`
    button {
      padding: 0.5rem 1rem;
      border-radius: 0.25rem;
      background: #3b82f6;
      color: white;
      border: none;
      cursor: pointer;
    }
    
    button:hover {
      background: #2563eb;
    }
    
    button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `]
})
```

## Opção 2: Arquivo Separado

```typescript
@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrl: './button.component.css'
})
```

## Opção 3: Classes Dinâmicas

```typescript
@Component({
  template: `
    <button [class]="buttonClasses()">
      <ng-content />
    </button>
  `
})
export class ButtonComponent {
  variant = input<'primary' | 'secondary'>('primary');
  size = input<'sm' | 'md' | 'lg'>('md');
  
  buttonClasses = computed(() => 
    `btn btn-${this.variant()} btn-${this.size()}`
  );
}
```

## Tailwind CSS

```typescript
@Component({
  template: `
    <button 
      [class]="'px-4 py-2 rounded ' + variantClasses()">
      <ng-content />
    </button>
  `
})
export class ButtonComponent {
  variant = input<'primary' | 'secondary'>('primary');
  
  variantClasses = computed(() => 
    this.variant() === 'primary'
      ? 'bg-blue-500 text-white hover:bg-blue-600'
      : 'bg-gray-500 text-white hover:bg-gray-600'
  );
}
```
