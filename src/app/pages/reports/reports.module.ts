import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskReportsComponent } from './task-reports/task-reports.component';
import { SharedModule } from '../../shared/shared.module';
import { TagReportsComponent } from './tag-reports/tag-reports.component';

@NgModule({
	declarations: [TagReportsComponent, TaskReportsComponent],
	imports: [CommonModule, SharedModule],
	exports: [TagReportsComponent, TaskReportsComponent],
})
export class ReportsModule {}
