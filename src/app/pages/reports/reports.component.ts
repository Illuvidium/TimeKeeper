import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DateRange } from '../../shared/components/date-range-picker/date-range-picker.component';
import { ClockTime, Tag, Task } from '../../../../shared/entities';
import { TagService } from '../../shared/services/tag.service';
import { TaskService } from '../../shared/services/task.service';
import { ClockTimeService } from '../../shared/services/clock-time.service';
import { TagReport, TaskReport } from '../../shared/classes/reports';
import * as moment from 'moment';

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

	private monthAgo: Date = new Date();
	private weekAgo: Date = new Date();
	private today: Date = new Date();

	get isLastMonth(): boolean {
		return moment(this.monthAgo).isSame(moment(this.dateFrom), 'day') && moment(this.today).isSame(moment(this.dateTo), 'day');
	}

	get isLastWeek(): boolean {
		return moment(this.weekAgo).isSame(moment(this.dateFrom), 'day') && moment(this.today).isSame(moment(this.dateTo), 'day');
	}

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
		this.dateTo.setDate(this.dateTo.getDate() + 1);
		this.dateFrom.setMonth(this.dateFrom.getMonth() - 1);

		this.today = new Date(this.dateTo);
		this.weekAgo = new Date(this.dateTo);
		this.weekAgo.setDate(this.weekAgo.getDate() - 6);
		this.monthAgo = new Date(this.dateFrom);

		await this.loadData();
	}

	protected async setLastWeek(): Promise<void> {
		this.dateFrom = this.weekAgo;
		this.dateTo = this.today;
		await this.loadData();
	}

	protected async setLastMonth(): Promise<void> {
		this.dateFrom = this.monthAgo;
		this.dateTo = this.today;
		await this.loadData();
	}

	protected async datesChanged(dateRange: DateRange) {
		this.dateFrom = dateRange.from;
		this.dateTo = dateRange.to;
		await this.loadData();
	}

	private async loadData() {
		this.clockTimes = await this.clockTimeService.getClockTimesInDateRange(this.dateFrom, this.dateTo);

		const taskIdsToLoad = this.clockTimes.map(ct => ct.task).filter(id => !this.tasks.some(t => t.id === id));
		this.tasks = this.tasks.concat(await this.taskService.getTaskByIds(taskIdsToLoad));

		const tagIdsToLoad = this.tasks.flatMap(t => t.tags).filter(id => !this.tags.some(t => t.id === id));
		this.tags = this.tags.concat(await this.tagService.getTagByIds(tagIdsToLoad));

		this.processData();
	}

	private processData() {
		const minTime = this.dateFrom.getTime();
		const maxDate = new Date(this.dateTo);
		maxDate.setDate(maxDate.getDate() + 1);
		const maxTime = maxDate.getTime();

		this.taskReports = this.tasks
			.orderBy(t => t.name)
			.map(t => {
				const report = new TaskReport(
					t,
					this.tags.filter(tag => t.tags.includes(tag.id))
				);
				report.calculateTotalMs(
					this.clockTimes.filter(ct => ct.task === t.id),
					minTime,
					maxTime
				);

				return report;
			})
			.filter(tr => tr.totalMilliseconds > 0);

		this.totalMs = this.taskReports.map(tr => tr.totalMilliseconds).reduce((total: number, ms: number) => total + ms, 0);

		this.tagReports = this.tags
			.orderBy(t => `${t.colour}|${t.name}`)
			.map(t => {
				const taskIds = this.tasks.filter(task => task.tags.includes(t.id)).map(task => task.id);
				const report = new TagReport(t);
				report.calculateTotalMs(
					this.clockTimes.filter(ct => taskIds.includes(ct.task)),
					minTime,
					maxTime
				);

				return report;
			})
			.filter(tr => tr.totalMilliseconds > 0);

		for (const taskReport of this.taskReports) {
			taskReport.calculatePercentage(this.totalMs);
		}

		for (const tagReport of this.tagReports) {
			tagReport.calculatePercentage(this.totalMs);
		}

		this.cdr.detectChanges();
	}
}
