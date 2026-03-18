import { Routes } from '@angular/router';
import { LoginPage } from './ui/modules/auth/login/login.page';

export const routes: Routes = [
  { path: 'login', component: LoginPage },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];
