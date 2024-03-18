import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
	selector: 'app-time-stamp',
	templateUrl: './time-stamp.component.html',
	styleUrls: ['./time-stamp.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimeStampComponent {
	@Input() set milliseconds(value: number) {
		const millisecondsInASecond = 1000;
		const millisecondsInAMinute = 60 * millisecondsInASecond;
		const millisecondsInAnHour = 60 * millisecondsInAMinute;

		this.hours = Math.floor(value / millisecondsInAnHour);
		value %= millisecondsInAnHour;

		this.minutes = Math.floor(value / millisecondsInAMinute);
		value %= millisecondsInAMinute;

		this.seconds = Math.floor(value / millisecondsInASecond);

		this.showHours = this.hours > 0;
		this.showMinutes = this.showHours || this.minutes > 0;
		this.showSeconds = !this.showMinutes;
	}

	protected hours = 0;
	protected minutes = 0;
	protected seconds = 0;
	protected showSeconds = true;
	protected showMinutes = true;
	protected showHours = true;

	constructor() {}
}
