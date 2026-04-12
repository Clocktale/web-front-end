import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Info, LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-info-callout',
  standalone: true,
  imports: [LucideAngularModule],
  template: `
    <div class="info-callout" role="status">
      <span class="info-callout__icon" aria-hidden="true">
        <lucide-angular [img]="InfoIcon" [size]="20" />
      </span>
      <p class="info-callout__message">{{ message() }}</p>
    </div>
  `,
  styleUrl: './info-callout.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoCalloutComponent {
  message = input.required<string>();

  protected readonly InfoIcon = Info;
}
