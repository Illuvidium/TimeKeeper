import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { PageNotFoundComponent } from './components/';
import { FormControlDirective } from './directives/form-control.directive';
import { FormsModule } from '@angular/forms';
import { TagComponent } from './components/tag/tag.component';
import { DropdownComponent } from './components/dropdown/dropdown.component';
import { ColourDropdownComponent } from './components/dropdown/colour-dropdown/colour-dropdown.component';
import { ToggleComponent } from './components/toggle/toggle.component';
import { ValidationSummaryComponent } from './components/validation-summary/validation-summary.component';
import { TagSelectComponent } from './components/tag-select/tag-select.component';

@NgModule({
    declarations: [
        PageNotFoundComponent,
        FormControlDirective,
        TagComponent,
        DropdownComponent,
        ColourDropdownComponent,
        ToggleComponent,
        ValidationSummaryComponent,
        TagSelectComponent,
    ],
    imports: [
        CommonModule,
        TranslateModule,
        FormsModule,
        NgbModule,
        // ReactiveFormsModule,
    ],
    exports: [
        TranslateModule,
        FormControlDirective,
        FormsModule,
        NgbModule,
        //ReactiveFormsModule,
        TagComponent,
        DropdownComponent,
        ColourDropdownComponent,
        ToggleComponent,
        ValidationSummaryComponent,
        TagSelectComponent,
    ],
})
export class SharedModule {}
