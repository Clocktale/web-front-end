# Layout Patterns

## Main Layout
```typescript
@Component({
  template: `
    <div class="main-layout">
      <app-header />
      <div class="container">
        <app-sidebar />
        <main><ng-content /></main>
      </div>
      <app-footer />
    </div>
  `
})
export class MainLayoutComponent {}
```

## Auth Layout
```typescript
@Component({
  template: `
    <div class="auth-layout">
      <div class="auth-card">
        <div class="logo">Logo</div>
        <ng-content />
      </div>
    </div>
  `
})
export class AuthLayoutComponent {}
```

## Dashboard Layout
```typescript
@Component({
  template: `
    <div class="dashboard">
      <app-header />
      <div class="dashboard-content">
        <ng-content />
      </div>
    </div>
  `
})
export class DashboardLayoutComponent {}
```
