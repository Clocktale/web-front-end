import { Component } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-explore-page',
  standalone: true,
  imports: [TranslocoModule],
  template: `
    <p *transloco="let t; prefix: 'auth.explore'">{{ t('comingSoon') }}</p>
  `,
})
export class ExplorePage {}
