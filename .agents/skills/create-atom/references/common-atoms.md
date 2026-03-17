# Common Atoms - Atoms Comuns e Exemplos

## Button
```typescript
@Component({
  selector: 'app-button',
  template: `<button [type]="type()" [disabled]="disabled()" (click)="clicked.emit()"><ng-content /></button>`
})
export class ButtonComponent {
  type = input<'button' | 'submit'>('button');
  variant = input<'primary' | 'secondary'>('primary');
  size = input<'sm' | 'md' | 'lg'>('md');
  disabled = input(false);
  clicked = output<void>();
}
```

## Input
```typescript
@Component({
  selector: 'app-input',
  template: `<input [type]="type()" [placeholder]="placeholder()" [(ngModel)]="value" />`
})
export class InputComponent {
  type = input<'text' | 'email' | 'password'>('text');
  placeholder = input('');
  value = model('');
}
```

## Label
```typescript
@Component({
  selector: 'app-label',
  template: `<label [class.required]="required()"><ng-content /></label>`
})
export class LabelComponent {
  required = input(false);
}
```

## Icon
```typescript
@Component({
  selector: 'app-icon',
  template: `<i [class]="'icon-' + name()" [attr.aria-label]="name()"></i>`
})
export class IconComponent {
  name = input.required<string>();
  size = input<'sm' | 'md' | 'lg'>('md');
}
```

## Badge
```typescript
@Component({
  selector: 'app-badge',
  template: `<span [class]="'badge badge-' + variant()"><ng-content /></span>`
})
export class BadgeComponent {
  variant = input<'success' | 'warning' | 'error'>('success');
}
```

## Avatar
```typescript
@Component({
  selector: 'app-avatar',
  template: `
    @if (imageUrl()) {
      <img [src]="imageUrl()" [alt]="name()" />
    } @else {
      <div class="avatar-initials">{{ initials() }}</div>
    }
  `
})
export class AvatarComponent {
  name = input.required<string>();
  imageUrl = input<string>();
  size = input<'sm' | 'md' | 'lg'>('md');
  
  initials = computed(() => 
    this.name().split(' ').map(n => n[0]).join('').toUpperCase()
  );
}
```
