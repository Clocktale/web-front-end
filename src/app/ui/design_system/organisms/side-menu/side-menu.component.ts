import {
  Component,
  inject,
  computed,
  signal,
  ChangeDetectionStrategy,
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
} from 'lucide-angular';
import { TranslocoModule } from '@jsverse/transloco';
import { AuthSessionController } from '../../../../controllers/auth-session.controller';
import { LogoutController } from '../../../../controllers/logout.controller';

interface MenuItem {
  labelKey: string;
  route: string;
  icon: LucideIconData;
}

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
    <ng-container *transloco="let t; prefix: 'admin.sideMenu'">
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
            *ngFor="let item of mainMenuItems"
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
              *ngFor="let item of bottomMenuItems"
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
                [img]="LogOutIcon"
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

  protected readonly LayoutDashboardIcon = LayoutDashboard;
  protected readonly FilmIcon = Film;
  protected readonly FileTextIcon = FileText;
  protected readonly UsersIcon = Users;
  protected readonly BuildingIcon = Building;
  protected readonly LayersIcon = Layers;
  protected readonly TvIcon = Tv;
  protected readonly SettingsIcon = Settings;
  protected readonly LogOutIcon = LogOut;

  isExpanded = signal(false);

  protected readonly mainMenuItems: MenuItem[] = [
    { labelKey: 'nav.dashboard', route: '/admin/dashboard', icon: LayoutDashboard },
    { labelKey: 'nav.animes', route: '/admin/animes', icon: Film },
    { labelKey: 'nav.reports', route: '/admin/reports', icon: FileText },
    { labelKey: 'nav.authors', route: '/admin/authors', icon: Users },
    { labelKey: 'nav.animeStudios', route: '/admin/studios', icon: Building },
    { labelKey: 'nav.animeCategories', route: '/admin/categories', icon: Layers },
    { labelKey: 'nav.streamings', route: '/admin/streamings', icon: Tv },
  ];

  protected readonly bottomMenuItems: MenuItem[] = [
    { labelKey: 'nav.settings', route: '/admin/settings', icon: Settings },
  ];

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
