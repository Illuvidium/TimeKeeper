import { ClockTime } from '../../../../shared/entities';
import * as moment from 'moment';

export class ClockTimeDateGroup {
	private momentDate: moment.Moment;

	date: Date;
	clockTimes: ClockTime[] = [];
	clockTimesWithOverlap: ClockTime[] = [];
	isRunning = false;
	isOpen = false;
	totalElapsedMs = 0;
	formattedDate = '';
	get hasOverlap(): boolean {
		return this.clockTimesWithOverlap.length > 0;
	}

	get orderedClockTimes(): ClockTime[] {
		return this.clockTimes.orderBy(ct => new Date(ct.start));
	}

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

		this.clockTimesWithOverlap = [];
		for (const clockTime of this.clockTimes) {
			if (this.clockTimeOverlaps(clockTime)) {
				this.clockTimesWithOverlap.push(clockTime);
			}
		}
	}

	private clockTimeOverlaps(clockTime: ClockTime): boolean {
		for (const clockTimeOther of this.clockTimes.filter(ct => ct.id !== clockTime.id)) {
			const startDateOne = new Date(clockTime.start);
			const finishDateOne = clockTime.finish ? new Date(clockTime.finish) : new Date();
			const startDateTwo = new Date(clockTimeOther.start);
			const finishDateTow = clockTimeOther.finish ? new Date(clockTimeOther.finish) : new Date();

			if (startDateOne > finishDateTow || startDateTwo > finishDateOne) {
				continue;
			}

			const overlapStart = startDateOne > startDateTwo ? startDateOne : startDateTwo;
			const overlapEnd = finishDateOne < finishDateTow ? finishDateOne : finishDateTow;
			const overlapSeconds = (overlapEnd.getTime() - overlapStart.getTime()) / 1000;
			if (overlapSeconds > 59) return true;
		}

		return false;
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
