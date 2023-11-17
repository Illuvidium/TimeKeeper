import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbDateStruct, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { ClockTime, Tag, Task } from '../../../../../../../shared/entities';
import { DropdownItem } from '../../../../../shared/components/dropdown/dropdown.component';
import {
	DateNonFutureValidator,
	DateTimeAfterOtherDateTime,
	FormControl,
	FormGroup,
	RequiredValidator,
	TimeNonFutureValidator,
} from '../../../../../shared/classes/forms';
import { ValidationService } from '../../../../../shared/services/validation.service';

@Component({
	selector: 'app-clock-entry-edit',
	templateUrl: './clock-entry-edit.component.html',
	styleUrl: './clock-entry-edit.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClockEntryEditComponent {
	@Input() tags: Tag[] = [];
	@Input() tasks: Task[] = [];
	@Input() set clockTime(value: ClockTime | undefined) {
		if (!value) return;
		this.editClockTime = value;

		const startDate = new Date(value.start);
		this.dateModelStart = { day: startDate.getDate(), month: startDate.getMonth() + 1, year: startDate.getFullYear() };
		this.timeModelStart = { hour: startDate.getHours(), minute: startDate.getMinutes(), second: startDate.getSeconds() };

		this.clockEntryForm = new FormGroup({
			task: new FormControl(this.editClockTime.task, 'Task', [new RequiredValidator()]),
			startDate: new FormControl(this.dateModelStart, 'Start date', [new RequiredValidator(), new DateNonFutureValidator()]),
			startTime: new FormControl(this.timeModelStart, 'Start time', [new RequiredValidator()]),
			comments: new FormControl(this.editClockTime.comments, 'Comments', []),
		});

		this.clockEntryForm.controls.startTime.validators.push(
			new TimeNonFutureValidator(this.clockEntryForm.controls.startDate as FormControl<NgbDateStruct>)
		);

		if (!value.finish) return;

		const finishDate = new Date(value.finish);
		this.dateModelFinish = { day: finishDate.getDate(), month: finishDate.getMonth() + 1, year: finishDate.getFullYear() };
		this.timeModelFinish = { hour: finishDate.getHours(), minute: finishDate.getMinutes(), second: finishDate.getSeconds() };

		this.clockEntryForm.controls.finishDate = new FormControl(this.dateModelFinish, 'Finish date', [
			new RequiredValidator(),
			new DateNonFutureValidator(),
		]);
		this.clockEntryForm.controls.finishTime = new FormControl(this.timeModelFinish, 'Finish time', [new RequiredValidator()]);
		this.clockEntryForm.controls.finishTime.validators.push(
			new TimeNonFutureValidator(this.clockEntryForm.controls.finishDate as FormControl<NgbDateStruct>)
		);
		this.clockEntryForm.controls.finishDate.validators.push(
			new DateTimeAfterOtherDateTime(
				this.clockEntryForm.controls.startDate as FormControl<NgbDateStruct>,
				this.clockEntryForm.controls.startTime as FormControl<NgbTimeStruct>,
				this.clockEntryForm.controls.finishTime as FormControl<NgbTimeStruct>
			)
		);
	}
	@Output() cancel: EventEmitter<void> = new EventEmitter<void>();
	@Output() save: EventEmitter<ClockTime> = new EventEmitter<ClockTime>();

	protected editClockTime: ClockTime;

	dateModelStart: NgbDateStruct = { day: 7, month: 4, year: 2023 };
	timeModelStart: NgbTimeStruct = { hour: 13, minute: 30, second: 30 };
	dateModelFinish: NgbDateStruct = { day: 7, month: 4, year: 2023 };
	timeModelFinish: NgbTimeStruct = { hour: 13, minute: 30, second: 30 };

	protected clockEntryForm = new FormGroup([]);

	get taskOptions(): DropdownItem[] {
		return this.tasks
			.filter(t => t.active || this.clockTime?.task === t.id)
			.orderBy(t => t.name)
			.map(
				t =>
					new DropdownItem(
						t.id,
						t.name,
						this.tags.filter(tag => t.tags.includes(tag.id))
					)
			);
	}

	get showFinish(): boolean {
		return !!this.editClockTime.finish;
	}

	constructor(protected validationService: ValidationService) {
		this.editClockTime = {
			active: true,
			id: 0,
			task: 0,
			start: new Date(),
			finish: undefined,
			comments: '',
		};
	}

	// setTask(value: any) {
	// 	this.editClockTime.task = value;
	// }

	cancelEdit() {
		this.cancel.emit();
	}

	saveEdit() {
		this.clockEntryForm.registerSubmitAttempt();
		if (!this.clockEntryForm.valid) return;

		this.editClockTime.task = this.clockEntryForm.controls.task.value;
		this.editClockTime.comments = this.clockEntryForm.controls.comments.value;

		const startDateStruct = this.clockEntryForm.controls.startDate.value as NgbDateStruct;
		const startTimeStruct = this.clockEntryForm.controls.startTime.value as NgbTimeStruct;
		this.editClockTime.start = new Date(
			startDateStruct.year,
			startDateStruct.month - 1,
			startDateStruct.day,
			startTimeStruct.hour,
			startTimeStruct.minute,
			startTimeStruct.second
		);

		if (this.editClockTime.finish) {
			const finishDateStruct = this.clockEntryForm.controls.finishDate.value as NgbDateStruct;
			const finishTimeStruct = this.clockEntryForm.controls.finishTime.value as NgbTimeStruct;
			this.editClockTime.finish = new Date(
				finishDateStruct.year,
				finishDateStruct.month - 1,
				finishDateStruct.day,
				finishTimeStruct.hour,
				finishTimeStruct.minute,
				finishTimeStruct.second
			);
		}

		this.save.emit(this.editClockTime);
	}
}
