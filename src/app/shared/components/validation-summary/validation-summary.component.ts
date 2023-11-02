import { Component, Input } from '@angular/core';
import { FormGroup } from '../../classes/forms';

@Component({
    selector: 'app-validation-summary',
    templateUrl: './validation-summary.component.html',
    styleUrls: ['./validation-summary.component.scss'],
})
export class ValidationSummaryComponent {
    @Input() formGroup: FormGroup | undefined;
}
