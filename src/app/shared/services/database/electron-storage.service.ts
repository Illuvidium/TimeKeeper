import { Injectable } from '@angular/core';
import { DataAccess } from '../../interfaces/data-access';
import { Tag, Task, Colour, ClockTime, SettingKey } from '../../../../../shared/entities';
import { ElectronService } from '../electron.service';
import { IElectronApi } from '../../../../../shared/electron-api.interface';

@Injectable({
	providedIn: 'root',
})
export class ElectronStorageService implements DataAccess {
	private electronAPI: IElectronApi | null;

	constructor(private electronService: ElectronService) {
		this.electronAPI = electronService.getApi();
	}

	addTag(tag: Tag): Promise<Tag> {
		return this.electronAPI?.addTag(tag) || Promise.reject();
	}
	getTag(id: number): Promise<Tag | undefined> {
		return this.electronAPI?.getTag(id) || Promise.reject();
	}
	getAllTags(): Promise<Tag[]> {
		return this.electronAPI?.getAllTags() || Promise.reject();
	}
	getActiveTags(): Promise<Tag[]> {
		return this.electronAPI?.getActiveTags() || Promise.reject();
	}
	getTagsByIds(ids: number[]): Promise<Tag[]> {
		return this.electronAPI?.getTagsByIds(ids) || Promise.reject();
	}
	updateTag(tag: Tag): Promise<Tag> {
		return this.electronAPI?.updateTag(tag) || Promise.reject();
	}
	addTask(task: Task): Promise<Task> {
		return this.electronAPI?.addTask(task) || Promise.reject();
	}
	getTask(id: number): Promise<Task | undefined> {
		return this.electronAPI?.getTask(id) || Promise.reject();
	}
	getAllTasks(): Promise<Task[]> {
		return this.electronAPI?.getAllTasks() || Promise.reject();
	}
	getActiveTasks(): Promise<Task[]> {
		return this.electronAPI?.getActiveTasks() || Promise.reject();
	}
	getTasksByIds(ids: number[]): Promise<Task[]> {
		return this.electronAPI?.getTasksByIds(ids) || Promise.reject();
	}
	updateTask(task: Task): Promise<Task> {
		return this.electronAPI?.updateTask(task) || Promise.reject();
	}
	getColourById(id: number): Promise<Colour | undefined> {
		return this.electronAPI?.getColourById(id) || Promise.reject();
	}
	getColourByName(name: string): Promise<Colour | undefined> {
		return this.electronAPI?.getColourByName(name) || Promise.reject();
	}
	getAllColours(): Promise<Colour[]> {
		return this.electronAPI?.getAllColours() || Promise.reject();
	}
	addClockTime(clockTime: ClockTime): Promise<ClockTime> {
		return this.electronAPI?.addClockTime(clockTime) || Promise.reject();
	}
	getClockTime(id: number): Promise<ClockTime | undefined> {
		return this.electronAPI?.getClockTime(id) || Promise.reject();
	}
	getClockTimesInDateRange(minDate: Date, maxDate: Date): Promise<ClockTime[]> {
		return this.electronAPI?.getClockTimesInDateRange(minDate, maxDate) || Promise.reject();
	}
	getActiveClockTime(): Promise<ClockTime | undefined> {
		return this.electronAPI?.getActiveClockTime() || Promise.reject();
	}
	getClockTimesByIds(ids: number[]): Promise<ClockTime[]> {
		return this.electronAPI?.getClockTimesByIds(ids) || Promise.reject();
	}
	updateClockTime(clockTime: ClockTime): Promise<ClockTime> {
		return this.electronAPI?.updateClockTime(clockTime) || Promise.reject();
	}

	getSetting(key: SettingKey): any {
		return this.electronAPI?.getSetting(key) || Promise.reject();
	}

	updateSetting(key: SettingKey, value: any): any {
		return this.electronAPI?.updateSetting(key, value) || Promise.reject();
	}
}
