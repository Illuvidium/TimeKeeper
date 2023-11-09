import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClockDayComponent } from './clock-day/clock-day.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
    declarations: [ClockDayComponent],
    imports: [CommonModule, SharedModule],
    exports: [ClockDayComponent],
})
export class ClockingModule {}
