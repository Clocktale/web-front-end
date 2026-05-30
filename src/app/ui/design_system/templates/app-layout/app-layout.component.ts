import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SideMenuComponent } from '../../organisms/side-menu/side-menu.component';

@Component({
  selector: 'app-app-layout',
  standalone: true,
  imports: [SideMenuComponent, RouterOutlet],
  template: `
    <div class="app-layout">
      <app-side-menu [variant]="'user'" />
      <main class="app-layout__content">
        <div class="app-layout__outlet">
          <router-outlet />
        </div>
      </main>
    </div>
  `,
  styleUrl: './app-layout.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppLayoutComponent {}
