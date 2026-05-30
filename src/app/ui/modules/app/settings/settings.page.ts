import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { LucideAngularModule, Globe } from 'lucide-angular';
import { TranslocoModule } from '@jsverse/transloco';

import { SettingsController } from '../../../../controllers/settings.controller';
import { RadioTileComponent } from '../../../design_system/molecules/radio-tile/radio-tile.component';
import type { AppLocale } from '../../../../types/app-locale.type';

@Component({
  selector: 'app-settings-page',
  standalone: true,
  imports: [TranslocoModule, LucideAngularModule, RadioTileComponent],
  template: `
    <div class="settings-page" *transloco="let t; prefix: 'app.settings'">
      <header class="settings-page__header">
        <h1 class="settings-page__title">{{ t('title') }}</h1>
      </header>

      <section
        class="settings-page__section"
        role="radiogroup"
        [attr.aria-label]="t('languageSectionTitle')"
      >
        <div class="settings-page__section-heading">
          <lucide-angular
            [img]="GlobeIcon"
            [size]="18"
            class="settings-page__section-icon"
            aria-hidden="true"
          />
          <h2 class="settings-page__section-title">{{ t('languageSectionTitle') }}</h2>
        </div>

        <div class="settings-page__language-list">
          @for (option of controller.languageOptions; track option.value) {
            <app-radio-tile
              [label]="option.label"
              [selected]="controller.selectedLang() === option.value"
              [ariaLabel]="t('languageOptionAriaLabel', { language: option.label })"
              (select)="onLanguageSelect(option.value)"
            />
          }
        </div>
      </section>
    </div>
  `,
  styleUrl: './settings.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsPage implements OnInit {
  protected readonly controller = inject(SettingsController);
  protected readonly GlobeIcon = Globe;

  ngOnInit(): void {
    this.controller.syncFromActiveLang();
  }

  onLanguageSelect(locale: AppLocale): void {
    this.controller.selectLanguage(locale);
  }
}
