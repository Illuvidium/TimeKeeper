import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ClockTime, Tag, Task } from '../../../../shared/entities';
import { TagService } from '../../shared/services/tag.service';
import { TaskService } from '../../shared/services/task.service';
import { ClockTimeService } from '../../shared/services/clock-time.service';
import * as moment from 'moment';
import { ClockTimeDateGroup } from '../../shared/classes/clock-time-date-group';
import { SubscriptionLike } from 'rxjs';

@Component({
	selector: 'app-clocking',
	templateUrl: './clocking.component.html',
	styleUrls: ['./clocking.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClockingComponent implements OnInit, OnDestroy {
	private clockTimeSavedSubscription: SubscriptionLike;
	private tickSubscription: SubscriptionLike;
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
	) {
		this.clockTimeSavedSubscription = this.clockTimeService.clockTimeSaved.subscribe(event => {
			const momentDate = moment(event.clockTime.start);
			let dateGroup = this.clockTimeDates.find(x => moment(x.date).isSame(momentDate, 'day'));
			if (!dateGroup) {
				dateGroup = new ClockTimeDateGroup(event.clockTime.start, []);
				this.clockTimeDates.push(dateGroup);
				this.clockTimeDates = this.clockTimeDates.orderBy(ctd => new Date(ctd.date).getTime() * -1);
			}

			dateGroup.clockTimes = dateGroup.clockTimes.filter(ct => ct.id !== event.clockTime.id);
			dateGroup.clockTimes.push(event.clockTime);

			if (!this.tasks.some(t => t.id === event.clockTime.task)) {
				this.taskService
					.getTaskById(event.clockTime.task)
					.then(t => {
						this.tasks.push(t as Task);
						dateGroup?.updateStats();
						this.cdr.detectChanges();

						const newTagIds = t?.tags.filter(id => !this.tags.some(tag => tag.id === id)) ?? [];
						if (newTagIds.length > 0) {
							this.tagService
								.getTagByIds(newTagIds)
								.then(tags => {
									this.tags = this.tags.concat(tags);
									dateGroup?.updateStats();
									this.cdr.detectChanges();
								})
								.catch(() => {});
						}
					})
					.catch(() => {});
			}

			dateGroup.updateStats();
			this.cdr.detectChanges();
		});

		this.tickSubscription = this.clockTimeService.tick.subscribe(() => {
			for (const clockTimeDate of this.clockTimeDates.filter(ctd => ctd.clockTimes.some(ct => !ct.finish))) {
				clockTimeDate.updateStats();
			}

			this.cdr.detectChanges();
		});
	}

	async ngOnInit(): Promise<void> {
		await this.loadMoreDates();
	}

	ngOnDestroy(): void {
		this.clockTimeSavedSubscription.unsubscribe();
		this.tickSubscription.unsubscribe();
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
		minDate.setDate(minDate.getDate() - 30);

		let entries = await this.clockTimeService.getClockTimesInDateRange(minDate, maxDate);
		entries = entries.filter(ct => !this.clockTimes.some(c => c.id === ct.id));

		// Process new entries and assign them to dates
		while (maxDate >= minDate) {
			const limit = new Date(maxDate);
			limit.setDate(limit.getDate() - 1);

			const dayEntries = entries.filter(c => {
				const start = new Date(c.start);
				const finish = c.finish ? new Date(c.finish) : new Date();
				if (start >= limit && start < maxDate) return true;
				if (finish >= limit && finish < maxDate) return true;
				if (start < limit && finish >= maxDate) return true;
				return false;
			});

			if (dayEntries.length) {
				this.clockTimeDates.push(new ClockTimeDateGroup(new Date(limit), dayEntries));
			}

			maxDate.setDate(maxDate.getDate() - 1);
		}

		this.clockTimes = this.clockTimes.concat(entries);
		this.lastLoadedMinDate = minDate;

		const newTaskIds = entries.map(c => c.task).filter(id => !this.tasks.some(t => t.id === id));

		if (!newTaskIds.length) {
			this.cdr.detectChanges();
			return;
		}

		const newTasks = await this.taskService.getTaskByIds(newTaskIds);
		this.tasks = this.tasks.concat(newTasks);

		const newTagIds = newTasks.flatMap(t => t.tags).filter(id => !this.tags.some(t => t.id === id));

		if (!newTagIds.length) {
			this.cdr.detectChanges();
			return;
		}

		const newTags = await this.tagService.getTagByIds(newTagIds);
		this.tags = this.tags.concat(newTags);

		this.cdr.detectChanges();
	}
}
