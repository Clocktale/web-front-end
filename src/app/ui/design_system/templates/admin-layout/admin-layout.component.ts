import { Component, ChangeDetectionStrategy } from '@angular/core';
import { SideMenuComponent } from '../../organisms/side-menu/side-menu.component';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [SideMenuComponent],
  template: `
    <div class="admin-layout">
      <app-side-menu />
      <main class="admin-layout__content">
        <ng-content />
      </main>
    </div>
  `,
  styleUrl: './admin-layout.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminLayoutComponent {}
