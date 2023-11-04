import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TasksComponent } from './tasks.component';
import { SharedModule } from '../../shared/shared.module';
import { EditTaskComponent } from './edit-task/edit-task.component';

@NgModule({
    declarations: [TasksComponent, EditTaskComponent],
    imports: [CommonModule, SharedModule],
})
export class TasksModule {}
