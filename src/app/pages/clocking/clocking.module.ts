import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClockDayComponent } from './clock-day/clock-day.component';
import { SharedModule } from '../../shared/shared.module';
import { ClockEntryComponent } from './clock-day/clock-entry/clock-entry.component';
import { ClockEntryEditComponent } from './clock-day/clock-entry/clock-entry-edit/clock-entry-edit.component';

@NgModule({
	declarations: [ClockDayComponent, ClockEntryComponent, ClockEntryEditComponent],
	imports: [CommonModule, SharedModule],
	exports: [ClockDayComponent, ClockEntryComponent, ClockEntryEditComponent],
})
export class ClockingModule {}
