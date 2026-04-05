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
import { AuthSessionController } from '../../../../controllers/auth-session.controller';
import { LogoutController } from '../../../../controllers/logout.controller';

interface MenuItem {
  label: string;
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
  ],
  host: {
    class: 'side-menu',
    '(mouseenter)': 'onMouseEnter()',
    '(mouseleave)': 'onMouseLeave()',
  },
  template: `
    <aside class="side-menu__container" [class.side-menu__container--expanded]="isExpanded()">
      <div class="side-menu__header">
        <div class="side-menu__avatar">
          {{ userInitial() }}
        </div>
        <div class="side-menu__user-info">
          <span class="side-menu__user-name">{{ userName() }}</span>
        </div>
      </div>

      <nav class="side-menu__nav">
        <a
          *ngFor="let item of mainMenuItems"
          [routerLink]="item.route"
          routerLinkActive="side-menu__item--active"
          class="side-menu__item"
          [title]="item.label"
        >
          <lucide-angular
            [img]="item.icon"
            [size]="20"
            class="side-menu__icon"
          />
          <span class="side-menu__label">{{ item.label }}</span>
        </a>

        <div class="side-menu__footer">
          <div class="side-menu__divider"></div>

          <a
            *ngFor="let item of bottomMenuItems"
            [routerLink]="item.route"
            routerLinkActive="side-menu__item--active"
            class="side-menu__item"
            [title]="item.label"
          >
            <lucide-angular
              [img]="item.icon"
              [size]="20"
              class="side-menu__icon"
            />
            <span class="side-menu__label">{{ item.label }}</span>
          </a>

          <button
            type="button"
            class="side-menu__item side-menu__item--button"
            [disabled]="logoutController.loading()"
            (click)="logout()"
            title="Logout"
          >
            <lucide-angular
              [img]="LogOutIcon"
              [size]="20"
              class="side-menu__icon"
            />
            <span class="side-menu__label">Logout</span>
          </button>
        </div>
      </nav>
    </aside>
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
    { label: 'Dashboard', route: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Animes', route: '/admin/animes', icon: Film },
    { label: 'Relatórios', route: '/admin/reports', icon: FileText },
    { label: 'Autores', route: '/admin/authors', icon: Users },
    { label: 'Estúdios de Anime', route: '/admin/studios', icon: Building },
    { label: 'Categorias de Anime', route: '/admin/categories', icon: Layers },
    { label: 'Streamings', route: '/admin/streamings', icon: Tv },
  ];

  protected readonly bottomMenuItems: MenuItem[] = [
    { label: 'Configurações', route: '/admin/settings', icon: Settings },
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
    return user?.nickname ?? 'Usuário';
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
