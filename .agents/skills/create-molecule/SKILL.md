# Skill: Criar Molecule

Esta skill ensina como criar componentes Molecule no padrão Atomic Design.

## O que é uma Molecule?

Molecules são combinações de atoms que formam componentes funcionais simples. Têm propósito específico e são relativamente simples.

**Exemplos**: Form Field (label + input + error), Search Bar (input + button), Card Header (title + subtitle + icon)

## Quando Criar uma Molecule

- ✅ Composto por 2 ou mais atoms
- ✅ Tem propósito bem definido
- ✅ Ainda relativamente simples
- ✅ Reutilizável em múltiplos contexts

## Estrutura Básica

```typescript
@Component({
  selector: 'app-form-field',
  template: `
    <div class="form-field">
      <app-label [required]="required()">
        {{ label() }}
      </app-label>
      
      <app-input
        [type]="type()"
        [placeholder]="placeholder()"
        [(value)]="value"
      />
      
      @if (error()) {
        <span class="error">{{ error() }}</span>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormFieldComponent {
  label = input.required<string>();
  type = input<'text' | 'email'>('text');
  placeholder = input('');
  required = input(false);
  error = input<string | null>(null);
  value = model('');
}
```

## Localização

```
src/app/ui/molecules/
├── form-field/
├── search-bar/
├── card-header/
└── menu-item/
```

## Características

- Composta por atoms
- Pode ter estado local simples
- Usa input() e output()
- OnPush change detection

## Exemplos

### Search Bar

```typescript
@Component({
  selector: 'app-search-bar',
  template: `
    <div class="search-bar">
      <app-input
        type="text"
        [placeholder]="placeholder()"
        [(value)]="searchTerm"
      />
      <app-button (clicked)="search.emit(searchTerm())">
        Buscar
      </app-button>
    </div>
  `
})
export class SearchBarComponent {
  placeholder = input('Buscar...');
  searchTerm = signal('');
  search = output<string>();
}
```

## Checklist

- [ ] Composta por atoms
- [ ] Tem propósito claro
- [ ] Usa OnPush
- [ ] Sem lógica de negócio
- [ ] Sem injeção de controllers

## Referências

- **references/common-molecules.md**: Exemplos completos
- **references/composition-patterns.md**: Padrões de composição

## Script

```bash
bash .agents/skills/create-molecule/scripts/generate-molecule.sh search-bar
```
