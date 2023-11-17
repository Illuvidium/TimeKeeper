import * as Store from 'electron-store';
import { migrations } from './migrations';
import { Tag, Task, Colour, ClockTime, SettingKey } from '../../shared/entities';

export class Database {
	private database: Store;

	constructor() {
		this.database = new Store({
			name: 'time-keeper',
			fileExtension: 'database',
		});

		const currentVersion = this.database.get('version', 0) as number;
		const migrationsToPerform = migrations.filter(m => m.id > currentVersion).sort((a, b) => a.id - b.id);

		for (const migration of migrationsToPerform) {
			migration.upgrade(this.database);
			this.database.set('version', migration.id);
		}
	}

	addTag(tag: Tag): Tag {
		const tags = this.database.get('tags') as Tag[];
		const maxId = tags.length > 0 ? tags.sort((a, b) => b.id - a.id)[0].id : 0;
		tag.id = maxId + 1;

		tags.push(tag);
		this.database.set('tags', tags);

		return tag;
	}

	getTag(id: number): Tag | undefined {
		const tags = this.database.get('tags') as Tag[];
		return tags.find(t => t.id === id);
	}

	getAllTags(): Tag[] {
		const tags = this.database.get('tags') as Tag[];
		return tags;
	}

	getActiveTags(): Tag[] {
		const tags = this.database.get('tags') as Tag[];
		return tags.filter(t => t.active);
	}

	getTagsByIds(ids: number[]): Tag[] {
		const tags = this.database.get('tags') as Tag[];
		return tags.filter(t => ids.includes(t.id));
	}

	updateTag(tag: Tag): Tag {
		const tags = this.database.get('tags') as Tag[];
		const currentTag = tags.find(t => t.id === tag.id);
		if (!currentTag) return this.addTag(tag);

		currentTag.name = tag.name;
		currentTag.colour = tag.colour;
		currentTag.active = tag.active;

		this.database.set('tags', tags);

		return currentTag;
	}

	deleteTag(tag: Tag): boolean {
		const currentTag = this.getTag(tag.id);
		if (!currentTag) return true;

		currentTag.active = false;
		this.updateTag(currentTag);
		return true;
	}

	addTask(task: Task): Task {
		const tasks = this.database.get('tasks') as Task[];
		const maxId = tasks.length > 0 ? tasks.sort((a, b) => b.id - a.id)[0].id : 0;
		task.id = maxId + 1;

		tasks.push(task);
		this.database.set('tasks', tasks);

		return task;
	}

	getTask(id: number): Task | undefined {
		const tasks = this.database.get('tasks') as Task[];
		return tasks.find(t => t.id === id);
	}

	getAllTasks(): Task[] {
		const tasks = this.database.get('tasks') as Task[];
		return tasks;
	}

	getActiveTasks(): Task[] {
		const tasks = this.database.get('tasks') as Task[];
		return tasks.filter(t => t.active);
	}

	getTasksByIds(ids: number[]): Task[] {
		const tasks = this.database.get('tasks') as Task[];
		return tasks.filter(t => ids.includes(t.id));
	}

	updateTask(task: Task): Task {
		const tasks = this.database.get('tasks') as Task[];
		const currentTask = tasks.find(t => t.id === task.id);
		if (!currentTask) return this.addTask(task);

		currentTask.name = task.name;
		currentTask.tags = task.tags;
		currentTask.active = task.active;

		this.database.set('tasks', tasks);

		return currentTask;
	}

	deleteTask(task: Task): boolean {
		const currentTask = this.getTask(task.id);
		if (!currentTask) return true;

		currentTask.active = false;
		this.updateTask(currentTask);
		return true;
	}

	getColourById(id: number): Colour | undefined {
		const colours = this.database.get('colours') as Colour[];
		return colours.find(c => c.id === id);
	}

	getColourByName(name: string): Colour | undefined {
		const colours = this.database.get('colours') as Colour[];
		return colours.find(c => c.name === name);
	}

	getAllColours(): Colour[] {
		const colours = this.database.get('colours') as Colour[];
		return colours;
	}

	addClockTime(clockTime: ClockTime): ClockTime {
		const clockTimes = this.database.get('clocktimes') as ClockTime[];
		const maxId = clockTimes.length > 0 ? clockTimes.sort((a, b) => b.id - a.id)[0].id : 0;
		clockTime.id = maxId + 1;

		clockTimes.push(clockTime);
		this.database.set('clocktimes', clockTimes);

		return clockTime;
	}

	getClockTime(id: number): ClockTime | undefined {
		const clockTimes = this.database.get('clocktimes') as ClockTime[];
		return clockTimes.find(t => t.id === id);
	}

	getClockTimesInDateRange(minDate: Date, maxDate: Date): ClockTime[] {
		const clockTimes = this.database.get('clocktimes') as ClockTime[];
		return clockTimes.filter(c => {
			const start = new Date(c.start);
			const finish = c.finish ? new Date(c.finish) : new Date();
			if (start >= minDate && start <= maxDate) return true;
			if (finish >= minDate && finish <= maxDate) return true;
			if (start < minDate && finish >= maxDate) return true;
			return false;
		});
	}

	getActiveClockTime(): ClockTime | undefined {
		const clockTimes = this.database.get('clocktimes') as ClockTime[];
		return clockTimes.find(t => !t.finish);
	}

	getClockTimesByIds(ids: number[]): ClockTime[] {
		const clockTimes = this.database.get('clocktimes') as ClockTime[];
		return clockTimes.filter(c => ids.includes(c.id));
	}

	updateClockTime(clockTime: ClockTime): ClockTime {
		const clockTimes = this.database.get('clocktimes') as ClockTime[];
		const currentClockTime = clockTimes.find(t => t.id === clockTime.id);
		if (!currentClockTime) return this.addClockTime(clockTime);

		currentClockTime.task = clockTime.task;
		currentClockTime.start = clockTime.start;
		currentClockTime.finish = clockTime.finish;
		currentClockTime.active = clockTime.active;

		this.database.set('clocktimes', clockTimes);

		return currentClockTime;
	}

	deleteClockTime(clockTime: ClockTime): boolean {
		const currentClockTime = this.getClockTime(clockTime.id);
		if (!currentClockTime) return true;

		currentClockTime.active = false;
		this.updateClockTime(currentClockTime);
		return true;
	}

	getSetting(key: SettingKey): any {
		const settings = (this.database.get('settings') as any) ?? {};
		return settings[key];
	}

	updateSetting(key: SettingKey, value: any): any {
		const settings = (this.database.get('settings') as any) ?? {};
		settings[key] = value;
		this.database.set('settings', settings);
	}
}
