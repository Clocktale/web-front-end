# Composition Patterns

## Pattern 1: Atom + Atom

```typescript
// Input + Button
@Component({
  template: `
    <app-input [(value)]="value" />
    <app-button (clicked)="submit()">Submit</app-button>
  `
})
```

## Pattern 2: Conditional Rendering

```typescript
@Component({
  template: `
    <app-label>{{ label() }}</app-label>
    <app-input [(value)]="value" />
    @if (error()) {
      <span class="error">{{ error() }}</span>
    }
  `
})
```

## Pattern 3: State Management

```typescript
export class Component {
  isOpen = signal(false);
  
  toggle() {
    this.isOpen.update(v => !v);
  }
}
```
