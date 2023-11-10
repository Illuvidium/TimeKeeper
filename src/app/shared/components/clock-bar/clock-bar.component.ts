import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnInit,
} from '@angular/core';
import { ClockTime, Task, Tag } from '../../../../../shared/entities';
import { DropdownItem } from '../dropdown/dropdown.component';
import { ElectronService } from '../../services/electron.service';
import { TagService } from '../../services/tag.service';
import { TaskService } from '../../services/task.service';
import { ClockTimeService } from '../../services/clock-time.service';

@Component({
    selector: 'app-clock-bar',
    templateUrl: './clock-bar.component.html',
    styleUrls: ['./clock-bar.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClockBarComponent implements OnInit {
    protected activeClockTime: ClockTime | undefined;
    protected tasks: Task[] = [];
    protected tags: Tag[] = [];

    protected dummyValue: undefined | number;
    protected updateInterval: any | undefined;

    protected activeTaskDescription: string | undefined;
    protected activeTaskTags: Tag[] | undefined;
    protected timeTakenMs = 0;

    get dropdownPlaceholder(): string {
        return this.activeClockTime ? 'Switch task' : 'Start clocking';
    }

    get taskOptions(): DropdownItem[] {
        return this.tasks
            .orderBy((t) => t.name)
            .map(
                (t) =>
                    new DropdownItem(
                        t.id,
                        t.name,
                        this.tags.filter((tag) => t.tags.includes(tag.id))
                    )
            );
    }

    constructor(
        private electronService: ElectronService,
        private tagService: TagService,
        private taskService: TaskService,
        private clockTimeService: ClockTimeService,
        private cdr: ChangeDetectorRef
    ) {}

    async ngOnInit(): Promise<void> {
        this.activeClockTime = await this.clockTimeService.getActiveClockTime();

        if (this.activeClockTime) {
            await this.electronService.getApi()?.setActiveIcon();
            this.updateTimeTaken();
            this.startInterval();
        } else {
            await this.electronService.getApi()?.setIdleIcon();
        }

        await this.loadTasks();
        this.tags = await this.tagService.getTagByIds(
            this.tasks.flatMap((task) => task.tags)
        );

        this.setTaskDesctiption();
        this.cdr.detectChanges();
    }

    async loadTasks() {
        this.tasks = await this.taskService.getActiveTasks();
        if (
            this.activeClockTime &&
            !this.tasks.some((t) => t.id === this.activeClockTime?.task)
        ) {
            const task = await this.taskService.getTaskById(
                this.activeClockTime?.task
            );
            task && this.tasks.push(task);
        }
    }

    async startTask(taskId: number) {
        setTimeout(() => (this.dummyValue = undefined), 0);
        this.dummyValue = taskId;

        if (this.activeClockTime?.task === taskId) return;

        await this.stopTask(false);

        this.activeClockTime = await this.clockTimeService.addClockTime({
            active: true,
            id: 0,
            task: taskId,
            start: new Date(),
            finish: undefined,
        });

        this.setTaskDesctiption();
        this.startInterval();
        await this.electronService.getApi()?.setActiveIcon();
    }

    setTaskDesctiption() {
        if (!this.activeClockTime) return;

        const task = this.tasks.find(
            (t) => t.id === this.activeClockTime?.task
        );
        this.activeTaskDescription = task?.name;
        this.activeTaskTags = this.tags.filter((t) =>
            task?.tags.includes(t.id)
        );
    }

    startInterval() {
        this.updateInterval = setInterval(() => {
            this.updateTimeTaken();
            this.cdr.detectChanges();
        }, 1000);
    }

    updateTimeTaken() {
        if (!this.activeClockTime) {
            this.timeTakenMs = 0;
            return;
        }
        const now = new Date().getTime();
        this.timeTakenMs = now - new Date(this.activeClockTime.start).getTime();
    }

    async stopTask(setIdle = true) {
        if (this.activeClockTime) {
            this.activeClockTime.finish = new Date();
            await this.clockTimeService.updateClockTime(this.activeClockTime);
            if (setIdle) {
                this.activeClockTime = undefined;
                await this.electronService.getApi()?.setIdleIcon();
            }
        }
    }
}
