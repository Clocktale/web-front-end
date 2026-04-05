import { Component, inject } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { ButtonComponent } from '../../../design_system/atoms/button/button.component';
import { ButtonVariant } from '../../../design_system/atoms/button/button-variant';
import { TextFieldComponent } from '../../../design_system/molecules/text-field/text-field.component';
import { RegisterController } from '../../../../controllers/register.controller';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [TranslocoModule, ButtonComponent, TextFieldComponent],
  template: `
    <ng-container *transloco="let t; prefix: 'auth.register'">
      <div class="register-layout">
        <div
          class="register-layout__image"
          role="img"
          [attr.aria-label]="t('imageAlt')"
        ></div>
        <div class="register-layout__form">
          <form
            class="register-form"
            [class.register-form--loading]="register.loading()"
            (submit)="onSubmit($event)"
            novalidate
          >
            <header class="register-form__header">
              <h1 class="register-form__title">{{ t('title') }}</h1>
              <p class="register-form__subtitle">{{ t('subtitle') }}</p>
            </header>

            <app-text-field
              [label]="t('usernameLabel')"
              [placeholder]="t('usernamePlaceholder')"
              type="text"
              [value]="register.username()"
              (valueChanged)="register.setUsername($event)"
              (fieldBlur)="register.onUsernameBlur()"
              [errorText]="register.usernameError()"
              [loading]="register.loading()"
              autocomplete="username"
            >
              <svg
                leading
                class="register-form__field-icon"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                  fill="currentColor"
                />
              </svg>
            </app-text-field>

            <app-text-field
              [label]="t('nicknameLabel')"
              [placeholder]="t('nicknamePlaceholder')"
              type="text"
              [value]="register.nickname()"
              (valueChanged)="register.setNickname($event)"
              (fieldBlur)="register.onNicknameBlur()"
              [errorText]="register.nicknameError()"
              [loading]="register.loading()"
              autocomplete="nickname"
            >
              <svg
                leading
                class="register-form__field-icon"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                  fill="currentColor"
                />
              </svg>
            </app-text-field>

            <app-text-field
              [label]="t('emailLabel')"
              [placeholder]="t('emailPlaceholder')"
              type="email"
              [value]="register.email()"
              (valueChanged)="register.setEmail($event)"
              (fieldBlur)="register.onEmailBlur()"
              [errorText]="register.emailError()"
              [loading]="register.loading()"
              autocomplete="email"
            >
              <svg
                leading
                class="register-form__field-icon"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"
                  fill="currentColor"
                />
              </svg>
            </app-text-field>

            <app-text-field
              [label]="t('passwordLabel')"
              [placeholder]="t('passwordPlaceholder')"
              [type]="register.passwordFieldType()"
              [value]="register.password()"
              (valueChanged)="register.setPassword($event)"
              (fieldBlur)="register.onPasswordBlur()"
              [errorText]="register.passwordError()"
              [loading]="register.loading()"
              autocomplete="new-password"
            >
              <svg
                leading
                class="register-form__field-icon"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"
                  fill="currentColor"
                />
              </svg>
              <button
                trailing
                type="button"
                class="register-form__icon-button"
                [attr.aria-label]="
                  register.passwordVisible() ? t('eyeHide') : t('eyeShow')
                "
                (click)="register.togglePasswordVisibility()"
              >
                @if (register.passwordVisible()) {
                  <svg
                    class="register-form__field-icon"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46A11.804 11.804 0 0 0 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78 3.15 3.15.02-.16c0-2.76-2.24-5-5-5l-.17.01z"
                      fill="currentColor"
                    />
                  </svg>
                } @else {
                  <svg
                    class="register-form__field-icon"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"
                      fill="currentColor"
                    />
                  </svg>
                }
              </button>
            </app-text-field>

            <div class="register-form__rules" aria-live="polite">
              <p class="register-form__rules-title">
                {{ t('passwordRulesTitle') }}
              </p>
              <ul class="register-form__rules-list" role="list">
                <li
                  class="register-form__rule"
                  [class.register-form__rule--met]="
                    register.passwordRules().lengthInRange
                  "
                >
                  {{ t('ruleLength') }}
                </li>
                <li
                  class="register-form__rule"
                  [class.register-form__rule--met]="
                    register.passwordRules().hasUppercase
                  "
                >
                  {{ t('ruleUppercase') }}
                </li>
                <li
                  class="register-form__rule"
                  [class.register-form__rule--met]="
                    register.passwordRules().hasLowercase
                  "
                >
                  {{ t('ruleLowercase') }}
                </li>
                <li
                  class="register-form__rule"
                  [class.register-form__rule--met]="
                    register.passwordRules().hasDigit
                  "
                >
                  {{ t('ruleDigit') }}
                </li>
                <li
                  class="register-form__rule"
                  [class.register-form__rule--met]="
                    register.passwordRules().hasSpecialChar
                  "
                >
                  {{ t('ruleSpecial') }}
                </li>
              </ul>
            </div>

            <app-button
              type="submit"
              [variant]="ButtonVariant.Primary"
              [fullWidth]="true"
              [disabled]="!register.canSubmit()"
              [loading]="register.loading()"
            >
              {{ t('submitPrimary') }}
            </app-button>

            <p class="register-form__footer">
              {{ t('hasAccount') }}
              <a
                href="/login"
                class="register-form__footer-link"
                (click)="onLoginClick($event)"
              >
                {{ t('loginLink') }}
              </a>
            </p>
          </form>
        </div>
      </div>
    </ng-container>
  `,
  styleUrl: './register.page.css',
})
export class RegisterPage {
  readonly register = inject(RegisterController);
  readonly ButtonVariant = ButtonVariant;

  onSubmit(event: Event): void {
    event.preventDefault();
    this.register.register();
  }

  onLoginClick(event: Event): void {
    event.preventDefault();
    this.register.navigateToLogin();
  }
}
