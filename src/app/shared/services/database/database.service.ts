import { Injectable } from '@angular/core';
import { DataAccess } from '../../interfaces/data-access';
import {
    Tag,
    Task,
    Colour,
    ClockTime,
    SettingKey,
} from '../../../../../shared/entities';
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
        this.database = electronService.isElectron
            ? electronStorageService
            : localStorageService;
    }

    addTag(tag: Tag): Promise<Tag> {
        return this.database.addTag(tag);
    }

    getTag(id: number): Promise<Tag | undefined> {
        return this.database.getTag(id);
    }

    async getTagsByFilter(filter: (tag: Tag) => boolean): Promise<Tag[]> {
        const tags = await this.database.getTagsByFilter(filter);
        for (const tag of tags) {
            const tasks = await this.database.getTasksByFilter((task) =>
                task.tags.includes(tag.id)
            );
            tag.activeLinks = tasks.length;
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

    getTasksByFilter(filter: (task: Task) => boolean): Promise<Task[]> {
        return this.database.getTasksByFilter(filter);
    }

    updateTask(task: Task): Promise<Task> {
        return this.database.updateTask(task);
    }

    getColour(id: number): Promise<Colour | undefined> {
        return this.database.getColour(id);
    }

    getColoursByFilter(
        filter: (colour: Colour) => boolean = () => true
    ): Promise<Colour[]> {
        return this.database.getColoursByFilter(filter);
    }

    addClockTime(clockTime: ClockTime): Promise<ClockTime> {
        return this.database.addClockTime(clockTime);
    }

    getClockTime(id: number): Promise<ClockTime | undefined> {
        return this.database.getClockTime(id);
    }

    getClockTimesByFilter(
        filter: (clockTime: ClockTime) => boolean
    ): Promise<ClockTime[]> {
        return this.database.getClockTimesByFilter(filter);
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
