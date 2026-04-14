import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SideMenuComponent } from '../../organisms/side-menu/side-menu.component';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [SideMenuComponent, RouterOutlet],
  template: `
    <div class="admin-layout">
      <app-side-menu />
      <main class="admin-layout__content">
        <div class="admin-layout__outlet">
          <router-outlet />
        </div>
      </main>
    </div>
  `,
  styleUrl: './admin-layout.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminLayoutComponent {}
