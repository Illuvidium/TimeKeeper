import { ClockTime, Tag, Task } from '../../../../shared/entities';

export class BaseReport {
	totalMilliseconds = 0;
	percentage = 0;

	calculateTotalMs(clockTimes: ClockTime[], minTime: number, maxTime: number) {
		this.totalMilliseconds = clockTimes
			.map(ct => {
				const dateClockTimeStart = new Date(ct.start);
				const dateClockTimeFinish = ct.finish ? new Date(ct.finish) : new Date();

				return Math.min(dateClockTimeFinish.getTime(), maxTime) - Math.max(dateClockTimeStart.getTime(), minTime);
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

export class TaskReport extends BaseReport {
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

export class TagReport extends BaseReport {
	tag: Tag;
	totalMilliseconds = 0;
	percentage = 0;

	constructor(tag: Tag) {
		super();
		this.tag = tag;
	}
}
