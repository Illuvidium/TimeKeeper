import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
} from '@angular/core';
import {
    FormGroup,
    FormControl,
    RequiredValidator,
} from '../../../shared/classes/forms';
import { Task } from '../../../../../shared/entities';
import { TaskService } from '../../../shared/services/task.service';

@Component({
    selector: 'app-edit-task',
    templateUrl: './edit-task.component.html',
    styleUrls: ['./edit-task.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditTaskComponent implements OnInit {
    @Input() id = 0;
    @Output() taskSaved: EventEmitter<Task> = new EventEmitter<Task>();

    protected task: Task | undefined = undefined;

    protected taskForm = new FormGroup({
        Description: new FormControl('', [new RequiredValidator()]),
        Tags: new FormControl([]),
    });

    constructor(
        private taskService: TaskService,
        private cdr: ChangeDetectorRef
    ) {}

    async ngOnInit(): Promise<void> {
        if (this.id === 0) return;

        this.task = await this.taskService.getTaskById(this.id);
        this.taskForm = new FormGroup({
            Description: new FormControl(this.task?.name, [
                new RequiredValidator(),
            ]),
            Tags: new FormControl(this.task?.tags || []),
        });

        this.cdr.detectChanges();
    }

    async saveTask() {
        this.taskForm.registerSubmitAttempt();
        if (!this.taskForm.valid) return;

        this.id === 0 ? await this.addTask() : await this.updateTask();
    }

    async addTask() {
        const task: Task = {
            id: 0,
            name: this.taskForm.controls.Description.value,
            tags: this.taskForm.controls.Tags.value,
            active: true,
        };

        this.taskSaved.emit(await this.taskService.addTask(task));
        setTimeout(() => {
            this.taskForm.reset();
            this.cdr.detectChanges();
        }, 0);
    }

    async updateTask() {
        if (this.task === undefined) return;

        this.task.name = this.taskForm.controls.Description.value;
        this.task.tags = this.taskForm.controls.Tags.value;

        this.taskSaved.emit(await this.taskService.updateTask(this.task));
        setTimeout(() => {
            this.taskForm.reset();
            this.cdr.detectChanges();
        }, 0);
    }
}
