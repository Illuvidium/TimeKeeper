import { Injectable } from '@angular/core';
import { DataAccess } from '../../interfaces/data-access';
import { Tag, Task, Colour, ClockTime, SettingKey } from '../../../../../shared/entities';
import { LocalStorageService } from './local-storage.service';
import { ElectronStorageService } from './electron-storage.service';
import { ElectronService } from '../electron.service';

@Injectable({
	providedIn: 'root',
})
export class DatabaseService implements DataAccess {
	private database: DataAccess;

	constructor(
		private localStorageService: LocalStorageService,
		private electronStorageService: ElectronStorageService,
		private electronService: ElectronService
	) {
		this.database = electronService.isElectron ? electronStorageService : localStorageService;
	}

	async addTag(tag: Tag): Promise<Tag> {
		return await this.database.addTag(tag);
	}

	getTag(id: number): Promise<Tag | undefined> {
		return this.database.getTag(id);
	}

	async getAllTags(): Promise<Tag[]> {
		const tags = await this.database.getAllTags();
		return this.getActiveLinksForTags(tags);
	}

	async getActiveTags(): Promise<Tag[]> {
		const tags = await this.database.getActiveTags();
		return this.getActiveLinksForTags(tags);
	}

	async getTagsByIds(ids: number[]): Promise<Tag[]> {
		const tags = await this.database.getTagsByIds(ids);
		return this.getActiveLinksForTags(tags);
	}

	private async getActiveLinksForTags(tags: Tag[]): Promise<Tag[]> {
		if (tags.length === 0) return tags;
		const tasks = await this.database.getActiveTasks();
		for (const tag of tags) {
			tag.activeLinks = tasks.filter(t => t.tags.includes(tag.id)).length;
		}
		return tags;
	}

	updateTag(tag: Tag): Promise<Tag> {
		return this.database.updateTag(tag);
	}

	addTask(task: Task): Promise<Task> {
		return this.database.addTask(task);
	}

	getTask(id: number): Promise<Task | undefined> {
		return this.database.getTask(id);
	}

	getAllTasks(): Promise<Task[]> {
		return this.database.getAllTasks();
	}

	getActiveTasks(): Promise<Task[]> {
		return this.database.getActiveTasks();
	}

	getTasksByIds(ids: number[]): Promise<Task[]> {
		return this.database.getTasksByIds(ids);
	}

	updateTask(task: Task): Promise<Task> {
		return this.database.updateTask(task);
	}

	getColourById(id: number): Promise<Colour | undefined> {
		return this.database.getColourById(id);
	}

	getColourByName(name: string): Promise<Colour | undefined> {
		return this.database.getColourByName(name);
	}

	getAllColours(): Promise<Colour[]> {
		return this.database.getAllColours();
	}

	addClockTime(clockTime: ClockTime): Promise<ClockTime> {
		return this.database.addClockTime(clockTime);
	}

	getClockTime(id: number): Promise<ClockTime | undefined> {
		return this.database.getClockTime(id);
	}

	getClockTimesInDateRange(minDate: Date, maxDate: Date): Promise<ClockTime[]> {
		return this.database.getClockTimesInDateRange(minDate, maxDate);
	}

	getActiveClockTime(): Promise<ClockTime | undefined> {
		return this.database.getActiveClockTime();
	}

	getClockTimesByIds(ids: number[]): Promise<ClockTime[]> {
		return this.database.getClockTimesByIds(ids);
	}

	updateClockTime(clockTime: ClockTime): Promise<ClockTime> {
		return this.database.updateClockTime(clockTime);
	}

	getSetting(key: SettingKey): any {
		return this.database.getSetting(key);
	}

	updateSetting(key: SettingKey, value: any): any {
		return this.database.updateSetting(key, value);
	}
}
