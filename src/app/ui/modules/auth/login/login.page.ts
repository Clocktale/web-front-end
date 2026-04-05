import { Component, inject } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { ButtonComponent } from '../../../design_system/atoms/button/button.component';
import { ButtonVariant } from '../../../design_system/atoms/button/button-variant';
import { TextFieldComponent } from '../../../design_system/molecules/text-field/text-field.component';
import { LoginController } from '../../../../controllers/login.controller';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [TranslocoModule, ButtonComponent, TextFieldComponent],
  templateUrl: './login.page.html',
  styleUrl: './login.page.css',
})
export class LoginPage {
  readonly login = inject(LoginController);
  readonly ButtonVariant = ButtonVariant;

  onSubmit(event: Event): void {
    event.preventDefault();
    this.login.login();
  }

  onRememberMeChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.login.setRememberMe(target.checked);
  }

  onSignUpClick(event: Event): void {
    event.preventDefault();
    this.login.navigateToSignUp();
  }
}
