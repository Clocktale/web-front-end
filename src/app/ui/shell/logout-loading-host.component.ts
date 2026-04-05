import { Component, inject } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';

import { LogoutController } from '../../controllers/logout.controller';

@Component({
  selector: 'app-logout-loading-host',
  standalone: true,
  imports: [TranslocoPipe],
  template: `
    @if (logoutController.loading()) {
      <div class="logout-loading-host" role="presentation">
        <div
          class="logout-loading-host__panel"
          role="status"
          aria-live="polite"
        >
          <span class="logout-loading-host__spinner" aria-hidden="true"></span>
          <p class="logout-loading-host__text">
            {{ 'auth.logout.loadingMessage' | transloco }}
          </p>
        </div>
      </div>
    }
  `,
  styleUrl: './logout-loading-host.component.css',
})
export class LogoutLoadingHostComponent {
  readonly logoutController = inject(LogoutController);
}
