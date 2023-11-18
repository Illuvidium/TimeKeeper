import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ClockTime, Tag, Task } from '../../../../../../shared/entities';
import { calculateElapsedForDate, getStartFinishTimeString } from '../../../../shared/classes/clock-time-date-group';
import { SubscriptionLike } from 'rxjs';
import { ClockTimeService } from '../../../../shared/services/clock-time.service';

@Component({
	selector: 'app-clock-entry',
	templateUrl: './clock-entry.component.html',
	styleUrls: ['./clock-entry.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClockEntryComponent implements OnInit, OnDestroy {
	@Input() date: Date | undefined;
	@Input() set tags(value: Tag[]) {
		this._tags = value;
		this.setEntryData();
	}
	@Input() set tasks(value: Task[]) {
		this._tasks = value;
		this.setEntryData();
	}
	@Input() set clockTime(value: ClockTime | undefined) {
		this._clockTime = value;
		this.setEntryData();
	}
	@Input() overlaps = false;

	private tickSubscription: SubscriptionLike;
	protected _tags: Tag[] = [];
	protected _tasks: Task[] = [];
	protected _clockTime: ClockTime | undefined;

	protected taskDescription = '';
	protected activeTags: Tag[] = [];
	protected timeElapsedMs = 0;
	protected startFinish = '';
	protected editMode = false;

	constructor(private clockTimeService: ClockTimeService, private cdr: ChangeDetectorRef) {
		this.tickSubscription = this.clockTimeService.tick.subscribe(() => {
			if (!this.clockTime?.finish ?? false) {
				this.setEntryData();
			}
		});
	}

	ngOnInit(): void {
		this.setEntryData();
	}

	ngOnDestroy(): void {
		this.tickSubscription.unsubscribe();
	}

	setEntryData(): void {
		const task = this._tasks.find(t => t.id === this._clockTime?.task);
		this.taskDescription = task?.name || '';
		this.activeTags = this._tags.filter(t => (task?.tags || []).includes(t.id));
		if (this._clockTime) {
			this.startFinish = getStartFinishTimeString(this._clockTime, this.date as Date);
			this.timeElapsedMs = calculateElapsedForDate(this._clockTime, this.date as Date);
		}

		this.cdr.detectChanges();
	}

	cancel() {
		this.editMode = !this.editMode;
	}

	async save(clockTime: ClockTime) {
		await this.clockTimeService.updateClockTime(clockTime);
		this.setEntryData();
		this.editMode = false;
		this.cdr.detectChanges();
	}
}
