import { Routes } from '@angular/router';
import { redirectIfAuthenticatedGuard } from './guards/redirect-if-authenticated.guard';
import { AdminLayoutComponent } from './ui/design_system/templates/admin-layout/admin-layout.component';
import { AppLayoutComponent } from './ui/design_system/templates/app-layout/app-layout.component';
import { LoginPage } from './ui/modules/auth/login/login.page';
import { RegisterPage } from './ui/modules/auth/register/register.page';
import { ExplorePage } from './ui/modules/explore/explore.page';
import { AuthorsPage } from './ui/modules/admin/authors/authors.page';
import { StreamingsPage } from './ui/modules/admin/streamings/streamings.page';
import { AnimeSearchPage } from './ui/modules/app/anime-search/anime-search.page';
import { SettingsPage } from './ui/modules/app/settings/settings.page';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginPage,
    canActivate: [redirectIfAuthenticatedGuard],
  },
  {
    path: 'signup',
    component: RegisterPage,
    canActivate: [redirectIfAuthenticatedGuard],
  },
  { path: 'explore', component: ExplorePage },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
      { path: 'authors', component: AuthorsPage },
      { path: 'streamings', component: StreamingsPage },
    ],
  },
  {
    path: 'app',
    component: AppLayoutComponent,
    children: [
      { path: 'search', component: AnimeSearchPage },
      { path: 'settings', component: SettingsPage },
    ],
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];
