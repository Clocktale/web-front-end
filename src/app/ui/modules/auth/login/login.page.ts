import { Component } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [TranslocoModule],
  templateUrl: './login.page.html',
  styleUrl: './login.page.css',
})
export class LoginPage {}
