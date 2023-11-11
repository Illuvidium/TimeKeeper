import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
} from '@angular/core';
import { SubscriptionLike } from 'rxjs';
import { ClockTime, Task, Tag } from '../../../../../shared/entities';
import { DropdownItem } from '../dropdown/dropdown.component';
import { ElectronService } from '../../services/electron.service';
import { TagEventType, TagService } from '../../services/tag.service';
import { TaskEventType, TaskService } from '../../services/task.service';
import { ClockTimeService } from '../../services/clock-time.service';

@Component({
    selector: 'app-clock-bar',
    templateUrl: './clock-bar.component.html',
    styleUrls: ['./clock-bar.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClockBarComponent implements OnInit, OnDestroy {
    private tagSavedSubscription: SubscriptionLike;
    private taskSavedSubscription: SubscriptionLike;
    private tickSubscription: SubscriptionLike;

    protected activeClockTime: ClockTime | undefined;
    protected tasks: Task[] = [];
    protected tags: Tag[] = [];

    protected dummyValue: undefined | number;

    protected activeTaskDescription: string | undefined;
    protected activeTaskTags: Tag[] | undefined;
    protected timeTakenMs = 0;

    get dropdownPlaceholder(): string {
        return this.activeClockTime ? 'Switch task' : 'Start clocking';
    }

    get taskOptions(): DropdownItem[] {
        return this.tasks
            .filter((t) => t.active || this.activeClockTime?.task === t.id)
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
    ) {
        this.tagSavedSubscription = this.tagService.tagSaved.subscribe(
            (event) => {
                switch (event.type) {
                    case TagEventType.Added:
                        this.tags.push(event.tag);
                        break;
                    case TagEventType.Updated:
                        this.tags = this.tags.filter(
                            (t) => t.id !== event.tag.id
                        );
                        this.tags.push(event.tag);
                        break;
                }

                this.cdr.detectChanges();
            }
        );

        this.taskSavedSubscription = this.taskService.taskSaved.subscribe(
            (event) => {
                switch (event.type) {
                    case TaskEventType.Added:
                        this.tasks.push(event.task);
                        break;
                    case TaskEventType.Updated:
                        this.tasks = this.tasks.filter(
                            (t) => t.id !== event.task.id
                        );
                        this.tasks.push(event.task);
                        break;
                }

                const newTagIds = event.task.tags.filter(
                    (id) => !this.tags.some((t) => t.id === id)
                );
                if (newTagIds.length > 0) {
                    this.tagService
                        .getTagByIds(newTagIds)
                        .then((tags) => {
                            this.tags = this.tags.concat(tags);
                            this.setTaskDesctiption();
                            this.cdr.detectChanges();
                        })
                        .catch(() => {});
                }

                this.setTaskDesctiption();
                this.cdr.detectChanges();
            }
        );

        this.tickSubscription = this.clockTimeService.tick.subscribe(() => {
            this.updateTimeTaken();
            this.cdr.detectChanges();
        });
    }

    async ngOnInit(): Promise<void> {
        this.activeClockTime = await this.clockTimeService.getActiveClockTime();

        if (this.activeClockTime) {
            await this.electronService.getApi()?.setActiveIcon();
            this.updateTimeTaken();
            this.clockTimeService.startTicking();
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

    ngOnDestroy(): void {
        this.tagSavedSubscription.unsubscribe();
        this.taskSavedSubscription.unsubscribe();
        this.tickSubscription.unsubscribe();
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
        this.clockTimeService.startTicking();
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

    updateTimeTaken() {
        if (!this.activeClockTime) {
            this.timeTakenMs = 0;
            return;
        }
        const now = new Date().getTime();
        this.timeTakenMs = now - new Date(this.activeClockTime.start).getTime();
    }

    async stopTask(setIdle = true) {
        setIdle && this.clockTimeService.stopTicking();
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
