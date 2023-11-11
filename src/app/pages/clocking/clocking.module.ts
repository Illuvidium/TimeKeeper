import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClockDayComponent } from './clock-day/clock-day.component';
import { SharedModule } from '../../shared/shared.module';
import { ClockEntryComponent } from './clock-day/clock-entry/clock-entry.component';

@NgModule({
    declarations: [ClockDayComponent, ClockEntryComponent],
    imports: [CommonModule, SharedModule],
    exports: [ClockDayComponent],
})
export class ClockingModule {}
