# ng-content Guide

## Basic ng-content

```typescript
@Component({
  template: `
    <div class="card">
      <ng-content />
    </div>
  `
})
```

## Named Slots

```typescript
@Component({
  template: `
    <div class="card">
      <header><ng-content select="[header]" /></header>
      <main><ng-content /></main>
      <footer><ng-content select="[footer]" /></footer>
    </div>
  `
})
```

## Usage

```html
<app-card>
  <div header>Header Content</div>
  <p>Body Content</p>
  <div footer>Footer Content</div>
</app-card>
```
