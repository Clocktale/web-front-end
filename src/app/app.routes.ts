import { Routes } from '@angular/router';
import { redirectIfAuthenticatedGuard } from './guards/redirect-if-authenticated.guard';
import { LoginPage } from './ui/modules/auth/login/login.page';
import { RegisterPage } from './ui/modules/auth/register/register.page';
import { ExplorePage } from './ui/modules/explore/explore.page';
import { AuthorsPage } from './ui/modules/admin/authors/authors.page';

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
  { path: 'admin/authors', component: AuthorsPage },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];
