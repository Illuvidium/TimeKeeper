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
	@Input() tags: Tag[] = [];
	@Input() tasks: Task[] = [];
	@Input() clockTime: ClockTime | undefined;
	@Input() overlaps = false;

	private tickSubscription: SubscriptionLike;
	protected taskDescription = '';
	protected activeTags: Tag[] = [];
	protected timeElapsedMs = 0;
	protected startFinish = '';
	protected editMode = false;

	constructor(private clockTimeService: ClockTimeService, private cdr: ChangeDetectorRef) {
		this.tickSubscription = this.clockTimeService.tick.subscribe(() => {
			if (!this.clockTime?.finish ?? false) {
				this.setTimeData();
				this.cdr.detectChanges();
			}
		});
	}

	ngOnInit(): void {
		const task = this.tasks.find(t => t.id === this.clockTime?.task);
		this.taskDescription = task?.name || '';
		this.setTimeData();
		this.activeTags = this.tags.filter(t => (task?.tags || []).includes(t.id));
	}

	ngOnDestroy(): void {
		this.tickSubscription.unsubscribe();
	}

	setTimeData(): void {
		this.startFinish = getStartFinishTimeString(this.clockTime as ClockTime, this.date as Date);
		this.timeElapsedMs = calculateElapsedForDate(this.clockTime as ClockTime, this.date as Date);
	}

	cancel() {
		this.editMode = !this.editMode;
	}

	async save(clockTime: ClockTime) {
		await this.clockTimeService.updateClockTime(clockTime);
		this.setTimeData();
		this.editMode = false;
		this.cdr.detectChanges();
	}
}
