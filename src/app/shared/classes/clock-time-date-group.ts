import { ClockTime } from '../../../../shared/entities';
import * as moment from 'moment';

export class ClockTimeDateGroup {
	private momentDate: moment.Moment;

	date: Date;
	clockTimes: ClockTime[] = [];
	isRunning = false;
	isOpen = false;
	totalElapsedMs = 0;
	formattedDate = '';

	constructor(date: Date, clockTimes: ClockTime[]) {
		this.date = date;
		this.clockTimes = clockTimes.orderBy(ct => ct.start);
		this.momentDate = moment(this.date);
		this.isOpen = this.momentDate.isSame(new Date(), 'day');
		this.updateStats();
	}

	updateStats() {
		if (!this.date) return;

		const minTime: number = this.momentDate.startOf('day').toDate().getTime();
		const maxTime: number = Math.min(this.momentDate.endOf('day').toDate().getTime() + 1, new Date().getTime());

		this.isRunning = this.clockTimes.some(ct => !ct.finish);
		this.totalElapsedMs = this.clockTimes
			.map(ct => calculateElapsedMs(ct, minTime, maxTime))
			.reduce((sum: number, current: number) => sum + current, 0);
		this.formattedDate = this.momentDate.format('dddd D MMM YYYY');
	}
}

export function calculateElapsedForDate(clockTime: ClockTime, date: Date) {
	const momentDate = moment(date);
	const minTime: number = momentDate.startOf('day').toDate().getTime();
	const maxTime: number = Math.min(momentDate.endOf('day').toDate().getTime() + 1, new Date().getTime());

	return calculateElapsedMs(clockTime, minTime, maxTime);
}

export function calculateElapsedMs(clockTime: ClockTime, minTime: number, maxTime: number) {
	const ctStartTime = new Date(clockTime.start).getTime();
	if (ctStartTime > maxTime) return 0;

	const ctFinish = clockTime.finish ? new Date(clockTime.finish).getTime() : maxTime;
	if (ctFinish < minTime) return 0;

	const result = Math.min(ctFinish, maxTime) - Math.max(minTime, ctStartTime);

	return result;
}

export function getStartFinishTimeString(clockTime: ClockTime, date: Date): string {
	const momentDate = moment(date);
	const momentStart = moment(clockTime?.start);
	const startTime = momentStart.isBefore(momentDate, 'day') ? '00:00' : momentStart.locale('nl').format('LT');

	if (!clockTime.finish) return `${startTime} -`;

	const momentFinish = moment(clockTime?.finish);
	const finishTime = momentFinish.isAfter(momentDate, 'day') ? '23:59' : momentFinish.locale('nl').format('LT');

	return `${startTime} - ${finishTime}`;
}
