import * as sqlite3 from 'sqlite3';
import * as sqlite from 'sqlite';
import { migrations } from './migrations';
import { Tag, Task, Colour, ClockTime, SettingKey } from '../../shared/entities';
import { app } from 'electron';
import * as path from 'path';

export class Database {
	private database: sqlite.Database<sqlite3.Database> | undefined;

	constructor() {}

	async initConnection(): Promise<void> {
		const location = path.join(app.getPath('userData'), 'timekeeper.db');
		this.database = await sqlite.open({
			filename: location,
			driver: sqlite3.Database,
		});

		let currentVersion = 0;
		try {
			const v: Version | undefined = await this.database.get('SELECT version FROM Version');
			currentVersion = v?.version ?? 0;
		} catch (err) {
			console.error(err);
		}
		console.log('Current version in electron: ' + currentVersion);

		const migrationsToPerform = migrations.filter(m => m.id > currentVersion).sort((a, b) => a.id - b.id);
		for (const migration of migrationsToPerform) {
			await migration.upgrade(this.database);
			await this.database.run('UPDATE Version SET version = ?', migration.id);
		}
		console.log('database init done');
	}

	// Tags
	async addTag(tag: Tag): Promise<Tag> {
		const result = await this.database?.run('INSERT INTO Tags (Name, Colour, Active) VALUES (?, ?, ?)', tag.name, tag.colour, tag.active);
		tag.id = result?.lastID ?? tag.id;

		return tag;
	}

	async getTag(id: number): Promise<Tag | undefined> {
		return await this.database?.get('SELECT id, name, colour, active FROM Tags WHERE id = ?', id);
	}

	async getAllTags(): Promise<Tag[]> {
		return (await this.database?.all('SELECT id, name, colour, active FROM Tags')) ?? [];
	}

	async getActiveTags(): Promise<Tag[]> {
		return (await this.database?.all('SELECT id, name, colour, active FROM Tags WHERE active = 1')) ?? [];
	}

	async getTagsByIds(ids: number[]): Promise<Tag[]> {
		return (await this.database?.all(`SELECT id, name, colour, active FROM Tags WHERE id in (${ids.map(() => '?').join(',')})`, ids)) ?? [];
	}

	async updateTag(tag: Tag): Promise<Tag> {
		await this.database?.run('UPDATE Tags SET name = ?, colour = ?, active = ? WHERE id = ?', tag.name, tag.colour, tag.active, tag.id);
		return tag;
	}

	// Tasks
	async addTask(task: Task): Promise<Task> {
		const result = await this.database?.run('INSERT INTO Tasks (Name, Active) VALUES (?, ?)', task.name, task.active);
		task.id = result?.lastID ?? task.id;

		for (const tag of task.tags) {
			await this.database?.run('INSERT INTO TaskTags (Task, Tag) VALUES (?, ?)', task.id, tag);
		}

		return task;
	}

	private async getTagsForTask(taskId: number): Promise<number[]> {
		return (await this.database?.all(`SELECT tag FROM TaskTags WHERE task = ?`, taskId))?.map(x => x.tag as number) ?? [];
	}

	private async setTagsForTasks(tasks: Task[]): Promise<Task[]> {
		const taskTags: TaskTag[] =
			(await this.database?.all(
				`SELECT task, tag FROM TaskTags WHERE task IN (${tasks.map(() => '?').join(',')})`,
				tasks.map(t => t.id)
			)) ?? [];
		for (const task of tasks) {
			task.tags = taskTags.filter(tt => tt.task === task.id).map(tt => tt.tag);
		}
		return tasks;
	}

	async getTask(id: number): Promise<Task | undefined> {
		const task: Task | undefined = await this.database?.get('SELECT id, name, active FROM Tasks WHERE id = ?', id);
		if (task) {
			task.tags = await this.getTagsForTask(id);
		}
		return task;
	}

	async getAllTasks(): Promise<Task[]> {
		const tasks: Task[] = (await this.database?.all('SELECT id, name, active FROM Tasks')) ?? [];
		return this.setTagsForTasks(tasks);
	}

	async getActiveTasks(): Promise<Task[]> {
		const tasks: Task[] = (await this.database?.all('SELECT id, name, active FROM Tasks WHERE Active = 1')) ?? [];
		return this.setTagsForTasks(tasks);
	}

	async getTasksByIds(ids: number[]): Promise<Task[]> {
		const tasks: Task[] =
			(await this.database?.all(`SELECT id, name, active FROM Tasks WHERE id IN (${ids.map(() => '?').join(',')})`, ids)) ?? [];
		return this.setTagsForTasks(tasks);
	}

	async updateTask(task: Task): Promise<Task> {
		await this.database?.run('UPDATE Tasks SET name = ?, active = ? WHERE id = ?', task.name, task.active, task.id);
		await this.database?.run('DELETE FROM TaskTags WHERE Task = ?', task.id);
		for (const tag of task.tags) {
			await this.database?.run('INSERT INTO TaskTags (Task, Tag) VALUES (?, ?)', task.id, tag);
		}
		return task;
	}

	// Colour
	async getColourById(id: number): Promise<Colour | undefined> {
		return await this.database?.get('SELECT id, name, background, foreground FROM Colours WHERE id = ?', id);
	}

	async getColourByName(name: string): Promise<Colour | undefined> {
		return await this.database?.get('SELECT id, name, background, foreground FROM Colours WHERE name = ?', name);
	}

	async getAllColours(): Promise<Colour[]> {
		return (await this.database?.all('SELECT id, name, background, foreground FROM Colours')) ?? [];
	}

	// ClockTime
	async addClockTime(clockTime: ClockTime): Promise<ClockTime> {
		const result = await this.database?.run(
			'INSERT INTO ClockTimes (task, comments, start, active) VALUES (?, ?, ?, 1)',
			clockTime.task,
			clockTime.comments,
			clockTime.start
		);
		clockTime.id = result?.lastID ?? clockTime.id;
		return clockTime;
	}

	async getClockTime(id: number): Promise<ClockTime | undefined> {
		return await this.database?.get('SELECT id, task, start, finish, comments, active FROM ClockTimes WHERE id = ?', id);
	}

	async getClockTimesInDateRange(minDate: Date, maxDate: Date): Promise<ClockTime[]> {
		return (
			(await this.database?.all(
				`
				SELECT id, task, start, finish, comments, active 
				FROM ClockTimes
				WHERE active = 1
				AND (
					? BETWEEN start AND IFNULL(finish, strftime('%s') * 1000)
					OR ? BETWEEN start AND IFNULL(finish, strftime('%s') * 1000)
					OR ? < start AND ? > IFNULL(finish, strftime('%s') * 1000)
				)`,
				minDate,
				maxDate,
				minDate,
				maxDate
			)) ?? []
		);
	}

	async getActiveClockTime(): Promise<ClockTime | undefined> {
		return await this.database?.get('SELECT id, task, start, finish, comments, active FROM ClockTimes WHERE finish IS NULL AND active = 1');
	}

	async getClockTimesByIds(ids: number[]): Promise<ClockTime[]> {
		return (
			(await this.database?.all(
				`SELECT id, task, start, finish, comments, active FROM ClockTimes WHERE id IN (${ids.map(() => '?').join(',')})`,
				ids
			)) ?? []
		);
	}

	async updateClockTime(clockTime: ClockTime): Promise<ClockTime> {
		await this.database?.run(
			'UPDATE ClockTimes SET task = ?, start = ?, finish = ?, comments = ?, active = ? WHERE id = ?',
			clockTime.task,
			clockTime.start,
			clockTime.finish,
			clockTime.comments,
			clockTime.active,
			clockTime.id
		);
		return clockTime;
	}

	async getSetting(key: SettingKey): Promise<any> {
		const setting: Setting | undefined = await this.database?.get('SELECT id, name, value FROM Settings WHERE name = ?', key);
		switch (key) {
			case SettingKey.Tags_SortOrder:
			case SettingKey.Tasks_SortOrder:
			case SettingKey.ReportTags_SortOrder:
			case SettingKey.ReportTasks_SortOrder:
				return setting?.value ?? '';
			case SettingKey.Tags_ShowInactive:
			case SettingKey.Tasks_ShowInactive:
				return setting ? setting.value === 'true' : false;
		}
	}

	async updateSetting(key: SettingKey, value: any): Promise<void> {
		await this.database?.run('REPLACE INTO Settings (name, value) VALUES (?, ?)', key, `${value}`);
	}
}

interface Version {
	version: number;
}

interface TaskTag {
	task: number;
	tag: number;
}

interface Setting {
	id: number;
	name: string;
	value: string;
}
