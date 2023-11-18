import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { FormControlDirective } from './directives/form-control.directive';
import { FormsModule } from '@angular/forms';
import { TagComponent } from './components/tag/tag.component';
import { DropdownComponent } from './components/dropdown/dropdown.component';
import { ColourDropdownComponent } from './components/dropdown/colour-dropdown/colour-dropdown.component';
import { ToggleComponent } from './components/toggle/toggle.component';
import { ValidationSummaryComponent } from './components/validation-summary/validation-summary.component';
import { TagSelectComponent } from './components/tag-select/tag-select.component';
import { StopwatchComponent } from './components/stopwatch/stopwatch.component';
import { ClockBarComponent } from './components/clock-bar/clock-bar.component';
import { TimeStampComponent } from './components/time-stamp/time-stamp.component';
import { DateRangePickerComponent } from './components/date-range-picker/date-range-picker.component';

@NgModule({
	declarations: [
		FormControlDirective,
		TagComponent,
		DropdownComponent,
		ColourDropdownComponent,
		ToggleComponent,
		ValidationSummaryComponent,
		TagSelectComponent,
		StopwatchComponent,
		ClockBarComponent,
		TimeStampComponent,
		DateRangePickerComponent,
	],
	imports: [CommonModule, TranslateModule, FormsModule, NgbModule],
	exports: [
		TranslateModule,
		FormControlDirective,
		FormsModule,
		NgbModule,
		TagComponent,
		DropdownComponent,
		ColourDropdownComponent,
		ToggleComponent,
		ValidationSummaryComponent,
		TagSelectComponent,
		StopwatchComponent,
		ClockBarComponent,
		TimeStampComponent,
		DateRangePickerComponent,
	],
})
export class SharedModule {}
