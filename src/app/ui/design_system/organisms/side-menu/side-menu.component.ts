import {
  Component,
  inject,
  computed,
  signal,
  ChangeDetectionStrategy,
  input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {
  LucideAngularModule,
  LucideIconData,
  LayoutDashboard,
  Film,
  FileText,
  Users,
  Building,
  Layers,
  Tv,
  Settings,
  LogOut,
  Home,
  Search,
  SquarePen,
  Info,
  Power,
} from 'lucide-angular';
import { TranslocoModule } from '@jsverse/transloco';
import { AuthSessionController } from '../../../../controllers/auth-session.controller';
import { LogoutController } from '../../../../controllers/logout.controller';

export type SideMenuVariant = 'admin' | 'user';

interface MenuItem {
  labelKey: string;
  route: string;
  icon: LucideIconData;
}

const ADMIN_MAIN_ITEMS: MenuItem[] = [
  { labelKey: 'nav.dashboard', route: '/admin/dashboard', icon: LayoutDashboard },
  { labelKey: 'nav.animes', route: '/admin/animes', icon: Film },
  { labelKey: 'nav.reports', route: '/admin/reports', icon: FileText },
  { labelKey: 'nav.authors', route: '/admin/authors', icon: Users },
  { labelKey: 'nav.animeStudios', route: '/admin/studios', icon: Building },
  { labelKey: 'nav.animeCategories', route: '/admin/categories', icon: Layers },
  { labelKey: 'nav.streamings', route: '/admin/streamings', icon: Tv },
];

const ADMIN_BOTTOM_ITEMS: MenuItem[] = [
  { labelKey: 'nav.settings', route: '/admin/settings', icon: Settings },
];

const USER_MAIN_ITEMS: MenuItem[] = [
  { labelKey: 'nav.home', route: '/app/home', icon: Home },
  { labelKey: 'nav.search', route: '/app/search', icon: Search },
  { labelKey: 'nav.edit', route: '/app/edit', icon: SquarePen },
];

const USER_BOTTOM_ITEMS: MenuItem[] = [
  { labelKey: 'nav.settings', route: '/app/settings', icon: Settings },
  { labelKey: 'nav.info', route: '/app/info', icon: Info },
];

@Component({
  selector: 'app-side-menu',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    LucideAngularModule,
    TranslocoModule,
  ],
  host: {
    class: 'side-menu',
    '(mouseenter)': 'onMouseEnter()',
    '(mouseleave)': 'onMouseLeave()',
  },
  template: `
    <ng-container *transloco="let t; prefix: i18nPrefix()">
      <aside class="side-menu__container" [class.side-menu__container--expanded]="isExpanded()">
        <div class="side-menu__header">
          <div class="side-menu__avatar">
            {{ userInitial() }}
          </div>
          <div class="side-menu__user-info">
            <span class="side-menu__user-name">{{ userName() || t('fallbackUser') }}</span>
          </div>
        </div>

        <nav class="side-menu__nav">
          <a
            *ngFor="let item of mainMenuItems()"
            [routerLink]="item.route"
            routerLinkActive="side-menu__item--active"
            class="side-menu__item"
            [title]="t(item.labelKey)"
          >
            <lucide-angular
              [img]="item.icon"
              [size]="20"
              class="side-menu__icon"
            />
            <span class="side-menu__label">{{ t(item.labelKey) }}</span>
          </a>

          <div class="side-menu__footer">
            <div class="side-menu__divider"></div>

            <a
              *ngFor="let item of bottomMenuItems()"
              [routerLink]="item.route"
              routerLinkActive="side-menu__item--active"
              class="side-menu__item"
              [title]="t(item.labelKey)"
            >
              <lucide-angular
                [img]="item.icon"
                [size]="20"
                class="side-menu__icon"
              />
              <span class="side-menu__label">{{ t(item.labelKey) }}</span>
            </a>

            <button
              type="button"
              class="side-menu__item side-menu__item--button"
              [disabled]="logoutController.loading()"
              (click)="logout()"
              [title]="t('logout')"
            >
              <lucide-angular
                [img]="logoutIcon()"
                [size]="20"
                class="side-menu__icon"
              />
              <span class="side-menu__label">{{ t('logout') }}</span>
            </button>
          </div>
        </nav>
      </aside>
    </ng-container>
  `,
  styleUrl: './side-menu.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideMenuComponent {
  private readonly authSession = inject(AuthSessionController);
  readonly logoutController = inject(LogoutController);

  /** Área de administração (`admin.sideMenu`) ou utilizador (`app.sideMenu`). */
  variant = input<SideMenuVariant>('admin');

  isExpanded = signal(false);

  protected readonly i18nPrefix = computed(() =>
    this.variant() === 'admin' ? 'admin.sideMenu' : 'app.sideMenu'
  );

  protected readonly mainMenuItems = computed(() =>
    this.variant() === 'admin' ? ADMIN_MAIN_ITEMS : USER_MAIN_ITEMS
  );

  protected readonly bottomMenuItems = computed(() =>
    this.variant() === 'admin' ? ADMIN_BOTTOM_ITEMS : USER_BOTTOM_ITEMS
  );

  protected readonly logoutIcon = computed(() =>
    this.variant() === 'user' ? Power : LogOut
  );

  userInitial = computed(() => {
    const user = this.authSession.user();
    if (!user?.nickname) {
      return '?';
    }
    return user.nickname.charAt(0).toUpperCase();
  });

  userName = computed(() => {
    const user = this.authSession.user();
    const nickname = user?.nickname?.trim();
    return nickname || '';
  });

  onMouseEnter(): void {
    this.isExpanded.set(true);
  }

  onMouseLeave(): void {
    this.isExpanded.set(false);
  }

  logout(): void {
    this.logoutController.logout();
  }
}
