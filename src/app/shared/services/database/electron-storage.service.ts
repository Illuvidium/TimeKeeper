import { Injectable } from '@angular/core';
import { DataAccess } from '../../interfaces/data-access';
import {
    Tag,
    Task,
    Colour,
    ClockTime,
    SettingKey,
} from '../../../../../shared/entities';
import { ElectronService } from '../../../core/services';
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
    async getTagsByFilter(filter: (tag: Tag) => boolean): Promise<Tag[]> {
        const allTags = await this.electronAPI?.getAllTags();
        return allTags?.filter(filter) || Promise.reject();
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
    async getTasksByFilter(filter: (task: Task) => boolean): Promise<Task[]> {
        const allTasks = await this.electronAPI?.getAllTasks();
        return allTasks?.filter(filter) || Promise.reject();
    }
    updateTask(task: Task): Promise<Task> {
        return this.electronAPI?.updateTask(task) || Promise.reject();
    }
    getColour(id: number): Promise<Colour | undefined> {
        return this.electronAPI?.getColour(id) || Promise.reject();
    }
    async getColoursByFilter(
        filter: (colour: Colour) => boolean
    ): Promise<Colour[]> {
        const allColours = await this.electronAPI?.getAllColours();
        return allColours?.filter(filter) || Promise.reject();
    }
    addClockTime(clockTime: ClockTime): Promise<ClockTime> {
        return this.electronAPI?.addClockTime(clockTime) || Promise.reject();
    }
    getClockTime(id: number): Promise<ClockTime | undefined> {
        return this.electronAPI?.getClockTime(id) || Promise.reject();
    }
    async getClockTimesByFilter(
        filter: (clockTime: ClockTime) => boolean
    ): Promise<ClockTime[]> {
        const allClockTimes = await this.electronAPI?.getAllClockTimes();
        return allClockTimes?.filter(filter) || Promise.reject();
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
