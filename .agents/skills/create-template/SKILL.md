# Skill: Criar Template

Esta skill ensina como criar Templates no padrão Atomic Design.

## O que é um Template?

Templates são layouts de página que definem a estrutura visual geral sem conteúdo específico. Usam `<ng-content>` para áreas de conteúdo.

**Exemplos**: Main Layout, Auth Layout, Dashboard Layout

## Estrutura Básica

```typescript
@Component({
  selector: 'app-main-layout',
  template: `
    <div class="main-layout">
      <app-header />
      
      <div class="container">
        <app-sidebar />
        
        <main class="content">
          <ng-content />
        </main>
      </div>
      
      <app-footer />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainLayoutComponent {}
```

## Localização

Templates compartilhados ficam no Design System. Templates específicos de um módulo ficam dentro do módulo:

- **Design System** (compartilhado): `src/app/ui/design_system/templates/`
- **Módulo específico**: `src/app/ui/modules/<nome-modulo>/templates/`

```
src/app/ui/design_system/templates/
├── main-layout/
├── auth-layout/
└── dashboard-layout/

src/app/ui/modules/auth/templates/
├── login-layout/
└── ...
```

## ng-content Slots

```typescript
@Component({
  template: `
    <div class="layout">
      <header><ng-content select="[header]" /></header>
      <main><ng-content /></main>
      <footer><ng-content select="[footer]" /></footer>
    </div>
  `
})
```

## Uso

```typescript
<app-main-layout>
  <div header>Custom Header</div>
  <p>Main Content</p>
  <div footer>Custom Footer</div>
</app-main-layout>
```

## Checklist

- [ ] Define estrutura de layout
- [ ] Usa ng-content
- [ ] Não contém conteúdo específico
- [ ] Reutilizável

## Referências

- **references/layout-patterns.md**: Padrões de layout
- **references/ng-content-guide.md**: Guia de ng-content

## Script

```bash
bash .agents/skills/create-template/scripts/generate-template.sh main-layout
```
