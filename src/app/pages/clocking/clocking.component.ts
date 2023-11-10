import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnInit,
} from '@angular/core';
import { ClockTime, Tag, Task } from '../../../../shared/entities';
import { TagService } from '../../shared/services/tag.service';
import { TaskService } from '../../shared/services/task.service';
import { ClockTimeService } from '../../shared/services/clock-time.service';

@Component({
    selector: 'app-clocking',
    templateUrl: './clocking.component.html',
    styleUrls: ['./clocking.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClockingComponent implements OnInit {
    private lastLoadedMinDate: Date | undefined;
    protected tasks: Task[] = [];
    protected tags: Tag[] = [];
    protected clockTimes: ClockTime[] = [];
    protected clockTimeDates: ClockTimeDateGroup[] = [];

    constructor(
        private tagService: TagService,
        private taskService: TaskService,
        private clockTimeService: ClockTimeService,
        private cdr: ChangeDetectorRef
    ) {}

    async ngOnInit(): Promise<void> {
        await this.loadMoreDates();
    }

    protected async loadMoreDates() {
        const maxDate = this.lastLoadedMinDate || new Date();

        if (this.lastLoadedMinDate === undefined) {
            maxDate.setHours(0);
            maxDate.setMinutes(0);
            maxDate.setSeconds(0);
            maxDate.setMilliseconds(0);
            maxDate.setDate(maxDate.getDate() + 1);
        }

        const minDate = new Date(maxDate);
        minDate.setDate(minDate.getDate() - 14);

        let entries = await this.clockTimeService.getClockTimesInDateRange(
            minDate,
            maxDate
        );
        entries = entries.filter(
            (ct) => !this.clockTimes.some((c) => c.id === ct.id)
        );

        // Process new entries and assign them to dates
        const dateKeyToday = `${new Date().getFullYear()}-${
            new Date().getMonth() + 1
        }-${new Date().getDate()}`;
        while (maxDate >= minDate) {
            const limit = new Date(maxDate);
            limit.setDate(limit.getDate() - 1);

            const dateKey = `${limit.getFullYear()}-${
                limit.getMonth() + 1
            }-${limit.getDate()}`;

            const dayEntries = entries.filter((c) => {
                const start = new Date(c.start);
                const finish = c.finish ? new Date(c.finish) : new Date();
                if (start >= limit && start < maxDate) return true;
                if (finish >= limit && finish < maxDate) return true;
                if (start < limit && finish >= maxDate) return true;
                return false;
            });

            if (dayEntries.length) {
                this.clockTimeDates.push({
                    date: new Date(limit),
                    dateKey: dateKey,
                    clocktimes: dayEntries,
                    hasActiveClockTime:
                        dateKeyToday === dateKey &&
                        dayEntries.some((c) => !c.finish),
                    isOpen: dateKeyToday === dateKey,
                    tasks: this.tasks,
                    tags: this.tags,
                });
            }

            maxDate.setDate(maxDate.getDate() - 1);
        }

        this.clockTimes = this.clockTimes.concat(entries);
        this.lastLoadedMinDate = minDate;

        const newTaskIds = entries
            .map((c) => c.task)
            .filter((id) => !this.tasks.some((t) => t.id === id));

        if (!newTaskIds.length) {
            this.cdr.detectChanges();
            return;
        }

        const newTasks = await this.taskService.getTaskByIds(newTaskIds);
        this.tasks = this.tasks.concat(newTasks);

        const newTagIds = newTasks
            .flatMap((t) => t.tags)
            .filter((id) => !this.tags.some((t) => t.id === id));

        if (!newTagIds.length) {
            this.cdr.detectChanges();
            return;
        }

        const newTags = await this.tagService.getTagByIds(newTagIds);
        this.tags = this.tags.concat(newTags);

        this.cdr.detectChanges();
    }
}

export class ClockTimeDateGroup {
    date: Date;
    dateKey = '';
    clocktimes: ClockTime[] = [];
    hasActiveClockTime = false;
    isOpen = false;
    tasks: Task[] = [];
    tags: Tag[] = [];

    constructor() {
        this.date = new Date();
    }
}
