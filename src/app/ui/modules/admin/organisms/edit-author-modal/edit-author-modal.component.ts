import {
  Component,
  inject,
  ChangeDetectionStrategy,
} from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';

import { EditAuthorModalController } from '../../../../../controllers/edit-author-modal.controller';
import { SingleNameFormModalComponent } from '../../../../design_system/organisms/single-name-form-modal/single-name-form-modal.component';

@Component({
  selector: 'app-edit-author-modal',
  standalone: true,
  imports: [SingleNameFormModalComponent, TranslocoPipe],
  template: `
    <app-single-name-form-modal
      [title]="'admin.authors.editModalTitle' | transloco"
      titleId="edit-author-modal-title"
      [fieldLabel]="'admin.authors.nameFieldLabel' | transloco"
      [placeholder]="'admin.authors.editNamePlaceholder' | transloco"
      [primaryLabel]="'admin.authors.saveChanges' | transloco"
      [bannerMessage]="'admin.authors.editNameBanner' | transloco"
      [fieldValue]="modal.name()"
      (fieldValueChange)="modal.setName($event)"
      [submitting]="modal.submitting()"
      [primaryDisabled]="!modal.isNameValid()"
      (closeRequested)="modal.close()"
      (primaryAction)="modal.submit()"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditAuthorModalComponent {
  readonly modal = inject(EditAuthorModalController);
}
