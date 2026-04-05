import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastHostComponent } from './ui/shell/toast-host.component';
import { LogoutLoadingHostComponent } from './ui/shell/logout-loading-host.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastHostComponent, LogoutLoadingHostComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('clocktale_frontend');
}
