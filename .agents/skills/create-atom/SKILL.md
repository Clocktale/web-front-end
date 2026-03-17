# Skill: Criar Atom

Esta skill ensina como criar componentes Atom no padrão Atomic Design.

## O que é um Atom?

Atoms são os blocos de construção mais básicos da UI. São componentes indivisíveis que geralmente mapeiam elementos HTML.

**Exemplos**: Button, Input, Label, Icon, Badge, Avatar, Checkbox, Radio

## Quando Criar um Atom

- ✅ Componente básico e indivisível
- ✅ Altamente reutilizável
- ✅ Não depende de outros componentes
- ✅ Representa elemento UI fundamental

## Quando NÃO Criar

- ❌ Componente composto (use Molecule)
- ❌ Contém lógica de negócio (use Organism)
- ❌ Específico de uma tela (use diretamente)

## Estrutura Básica

```typescript
import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-button',
  template: `
    <button 
      [type]="type()"
      [disabled]="disabled()"
      [class]="buttonClasses()"
      (click)="clicked.emit()">
      <ng-content />
    </button>
  `,
  styles: [`
    button {
      padding: 0.5rem 1rem;
      border-radius: 0.25rem;
      cursor: pointer;
      transition: all 0.2s;
    }
    
    .primary { background: #3b82f6; color: white; }
    .secondary { background: #6b7280; color: white; }
    
    button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonComponent {
  type = input<'button' | 'submit' | 'reset'>('button');
  variant = input<'primary' | 'secondary'>('primary');
  disabled = input(false);
  
  clicked = output<void>();
  
  buttonClasses = computed(() => this.variant());
}
```

## Localização

```
src/app/ui/atoms/
├── button/
│   └── button.component.ts
├── input/
│   └── input.component.ts
├── label/
│   └── label.component.ts
└── icon/
    └── icon.component.ts
```

## Características de um Atom

### 1. Stateless (sem estado complexo)

```typescript
// ✅ Bom - Apenas props
export class ButtonComponent {
  label = input<string>('');
  disabled = input(false);
}

// ❌ Ruim - Estado complexo
export class ButtonComponent {
  private data = signal<Data[]>([]);
  controller = inject(DataController);
}
```

### 2. Usa input() e output()

```typescript
// Inputs
size = input<'small' | 'medium' | 'large'>('medium');
disabled = input(false);

// Outputs
clicked = output<void>();
valueChanged = output<string>();
```

### 3. OnPush Change Detection

```typescript
@Component({
  // ...
  changeDetection: ChangeDetectionStrategy.OnPush
})
```

### 4. Usa ng-content para composição

```typescript
template: `
  <button>
    <ng-content />
  </button>
`
```

## Exemplos Completos

### Button Atom

```typescript
@Component({
  selector: 'app-button',
  template: `
    <button 
      [type]="type()"
      [disabled]="disabled()"
      [class]="'btn btn-' + variant() + ' btn-' + size()">
      @if (loading()) {
        <span class="spinner"></span>
      }
      <ng-content />
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonComponent {
  type = input<'button' | 'submit' | 'reset'>('button');
  variant = input<'primary' | 'secondary' | 'danger'>('primary');
  size = input<'small' | 'medium' | 'large'>('medium');
  disabled = input(false);
  loading = input(false);
  
  clicked = output<void>();
}
```

### Input Atom

```typescript
@Component({
  selector: 'app-input',
  template: `
    <input
      [type]="type()"
      [placeholder]="placeholder()"
      [disabled]="disabled()"
      [(ngModel)]="value"
      class="input"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputComponent {
  type = input<'text' | 'email' | 'password' | 'number'>('text');
  placeholder = input('');
  disabled = input(false);
  value = model('');
}
```

## Acessibilidade

Sempre implemente:
- Atributos ARIA apropriados
- Labels descritivos
- Estados de foco visíveis
- Suporte a teclado

```typescript
template: `
  <button
    [attr.aria-label]="ariaLabel()"
    [attr.aria-pressed]="pressed()"
    [attr.aria-disabled]="disabled()">
    <ng-content />
  </button>
`
```

## Nomenclatura

- **Arquivo**: `button.component.ts`
- **Classe**: `ButtonComponent`
- **Selector**: `app-button`
- **Localização**: `src/app/ui/atoms/button/`

## Checklist

- [ ] Componente é indivisível
- [ ] Usa `input()` e `output()`
- [ ] OnPush change detection
- [ ] Acessibilidade implementada
- [ ] Estilos inline ou arquivo separado
- [ ] Usa `ng-content` quando apropriado
- [ ] Sem lógica de negócio
- [ ] Sem injeção de services/controllers

## Referências

- **references/common-atoms.md**: Lista completa de atoms comuns
- **references/styling-guide.md**: Como estilizar atoms

## Script

```bash
bash .agents/skills/create-atom/scripts/generate-atom.sh button
```

## Regras

- Atom NÃO injeta controllers
- Atom NÃO faz requisições
- Atom NÃO contém lógica de negócio
- Atom é altamente reutilizável
