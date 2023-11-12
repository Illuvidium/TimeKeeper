import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnInit,
} from '@angular/core';
import { DateRange } from '../../shared/components/date-range-picker/date-range-picker.component';
import { ClockTime, Tag, Task } from '../../../../shared/entities';
import { TagService } from '../../shared/services/tag.service';
import { TaskService } from '../../shared/services/task.service';
import { ClockTimeService } from '../../shared/services/clock-time.service';

@Component({
    selector: 'app-reports',
    templateUrl: './reports.component.html',
    styleUrls: ['./reports.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportsComponent implements OnInit {
    protected dateFrom = new Date();
    protected dateTo = new Date();
    protected tasks: Task[] = [];
    protected tags: Tag[] = [];
    protected clockTimes: ClockTime[] = [];
    protected taskReports: TaskReport[] = [];
    protected tagReports: TagReport[] = [];
    protected totalMs = 0;

    constructor(
        private tagService: TagService,
        private taskService: TaskService,
        private clockTimeService: ClockTimeService,
        private cdr: ChangeDetectorRef
    ) {}

    async ngOnInit(): Promise<void> {
        this.dateTo.setHours(0);
        this.dateTo.setMinutes(0);
        this.dateTo.setHours(0);
        this.dateTo.setMinutes(0);
        this.dateTo.setSeconds(0);
        this.dateTo.setMilliseconds(0);
        this.dateFrom.setMonth(this.dateFrom.getMonth() - 1);
        await this.loadData();
    }

    protected async datesChanged(dateRange: DateRange) {
        this.dateFrom = dateRange.from;
        this.dateTo = dateRange.to;
        await this.loadData();
    }

    private async loadData() {
        this.clockTimes = await this.clockTimeService.getClockTimesInDateRange(
            this.dateFrom,
            this.dateTo
        );

        const taskIdsToLoad = this.clockTimes
            .map((ct) => ct.task)
            .filter((id) => !this.tasks.some((t) => t.id === id));

        this.tasks = this.tasks.concat(
            await this.taskService.getTaskByIds(taskIdsToLoad)
        );

        const tagIdsToLoad = this.tasks
            .flatMap((t) => t.tags)
            .filter((id) => !this.tags.some((t) => t.id === id));

        this.tags = this.tags.concat(
            await this.tagService.getTagByIds(tagIdsToLoad)
        );

        this.processData();
    }

    private processData() {
        const minTime = this.dateFrom.getTime();
        const maxDate = new Date(this.dateTo);
        maxDate.setDate(maxDate.getDate() + 1);
        const maxTime = maxDate.getTime();

        this.taskReports = this.tasks
            .orderBy((t) => t.name)
            .map((t) => {
                const report = new TaskReport(
                    t,
                    this.tags.filter((tag) => t.tags.includes(tag.id))
                );
                report.calculateTotalMs(
                    this.clockTimes.filter((ct) => ct.task === t.id),
                    minTime,
                    maxTime
                );

                return report;
            })
            .filter((tr) => tr.totalMilliseconds > 0);

        this.totalMs = this.taskReports
            .map((tr) => tr.totalMilliseconds)
            .reduce((total: number, ms: number) => total + ms, 0);

        this.tagReports = this.tags
            .orderBy((t) => `${t.colour}|${t.name}`)
            .map((t) => {
                const taskIds = this.tasks
                    .filter((task) => task.tags.includes(t.id))
                    .map((task) => task.id);
                const report = new TagReport(t);
                report.calculateTotalMs(
                    this.clockTimes.filter((ct) => taskIds.includes(ct.task)),
                    minTime,
                    maxTime
                );

                return report;
            })
            .filter((tr) => tr.totalMilliseconds > 0);

        for (const taskReport of this.taskReports)
            taskReport.calculatePercentage(this.totalMs);

        for (const tagReport of this.tagReports)
            tagReport.calculatePercentage(this.totalMs);

        this.cdr.detectChanges();
    }
}

class BaseReport {
    totalMilliseconds = 0;
    percentage = 0;

    calculateTotalMs(
        clockTimes: ClockTime[],
        minTime: number,
        maxTime: number
    ) {
        this.totalMilliseconds = clockTimes
            .map((ct) => {
                const dateClockTimeStart = new Date(ct.start);
                const dateClockTimeFinish = ct.finish
                    ? new Date(ct.finish)
                    : new Date();

                return (
                    Math.min(dateClockTimeFinish.getTime(), maxTime) -
                    Math.max(dateClockTimeStart.getTime(), minTime)
                );
            })
            .reduce((sum: number, total: number) => sum + total, 0);
    }

    calculatePercentage(totalMs: number) {
        if (totalMs === 0) {
            this.percentage = 0;
            return;
        }

        this.percentage = Math.round((this.totalMilliseconds / totalMs) * 100);
    }
}

class TaskReport extends BaseReport {
    task: Task;
    tags: Tag[] = [];
    totalMilliseconds = 0;
    percentage = 0;

    constructor(task: Task, tags: Tag[]) {
        super();
        this.task = task;
        this.tags = tags;
    }
}

class TagReport extends BaseReport {
    tag: Tag;
    totalMilliseconds = 0;
    percentage = 0;

    constructor(tag: Tag) {
        super();
        this.tag = tag;
    }
}
