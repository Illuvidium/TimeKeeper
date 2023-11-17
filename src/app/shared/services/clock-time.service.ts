import { Injectable } from '@angular/core';
import { ClockTime } from '../../../../shared/entities';
import { Subject, Observable } from 'rxjs';
import { DatabaseService } from './database/database.service';

@Injectable({
	providedIn: 'root',
})
export class ClockTimeService {
	private clockTimeSavedSource: Subject<ClockTimeEvent> = new Subject();
	clockTimeSaved: Observable<ClockTimeEvent> = this.clockTimeSavedSource.asObservable();

	private tickSource: Subject<void> = new Subject<void>();
	tick: Observable<void> = this.tickSource.asObservable();

	private tickInterval: number | undefined;

	startTicking() {
		if (!this.tickInterval) this.tickInterval = window.setInterval(() => this.tickSource.next(), 1000);
		this.tickSource.next();
	}

	stopTicking() {
		if (this.tickInterval) {
			clearInterval(this.tickInterval);
			this.tickInterval = undefined;
		}
	}

	constructor(private databaseService: DatabaseService) {}

	async addClockTime(clockTime: ClockTime): Promise<ClockTime> {
		clockTime = await this.databaseService.addClockTime(clockTime);
		this.clockTimeSavedSource.next(new ClockTimeEvent(clockTime, ClockTimeEventType.Added));
		return clockTime;
	}

	async updateClockTime(clockTime: ClockTime): Promise<ClockTime> {
		clockTime = await this.databaseService.updateClockTime(clockTime);
		this.clockTimeSavedSource.next(new ClockTimeEvent(clockTime, ClockTimeEventType.Updated));
		return clockTime;
	}

	// async getAllClockTimes(): Promise<ClockTime[]> {
	// 	return await this.databaseService.getClockTimesByFilter(() => true);
	// }

	async getClockTimesInDateRange(minDate: Date, maxDate: Date): Promise<ClockTime[]> {
		return await this.databaseService.getClockTimesInDateRange(minDate, maxDate);
	}

	async getActiveClockTime(): Promise<ClockTime | undefined> {
		return await this.databaseService.getActiveClockTime();
	}

	async getClockTimeById(id: number): Promise<ClockTime | undefined> {
		return await this.databaseService.getClockTime(id);
	}

	async getClockTimeByIds(ids: number[]): Promise<ClockTime[]> {
		return await this.databaseService.getClockTimesByIds(ids);
	}
}

export class ClockTimeEvent {
	clockTime: ClockTime;
	type: ClockTimeEventType;

	constructor(clockTime: ClockTime, type: ClockTimeEventType) {
		this.clockTime = clockTime;
		this.type = type;
	}
}

export enum ClockTimeEventType {
	Added,
	Updated,
}
