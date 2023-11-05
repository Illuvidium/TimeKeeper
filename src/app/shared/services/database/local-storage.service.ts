import { Injectable } from '@angular/core';
import { DataAccess } from '../../interfaces/data-access';
import {
    Tag,
    Task,
    Colour,
    ClockTime,
    SettingKey,
} from '../../../../../shared/entities';

@Injectable({
    providedIn: 'root',
})
export class LocalStorageService implements DataAccess {
    private migrations = [
        {
            id: 1,
            upgrade: () => {
                localStorage.setItem(
                    'colours',
                    JSON.stringify([
                        {
                            id: 1,
                            name: 'Maroon',
                            background: '#800000',
                            foreground: '#ffffff',
                        },
                        {
                            id: 2,
                            name: 'Brown',
                            background: '#9A6324',
                            foreground: '#ffffff',
                        },
                        {
                            id: 3,
                            name: 'Olive',
                            background: '#808000',
                            foreground: '#ffffff',
                        },
                        {
                            id: 4,
                            name: 'Teal',
                            background: '#469990',
                            foreground: '#ffffff',
                        },
                        {
                            id: 5,
                            name: 'Navy',
                            background: '#000075',
                            foreground: '#ffffff',
                        },
                        {
                            id: 6,
                            name: 'Black',
                            background: '#000000',
                            foreground: '#ffffff',
                        },
                        {
                            id: 7,
                            name: 'Red',
                            background: '#e6194B',
                            foreground: '#ffffff',
                        },
                        {
                            id: 8,
                            name: 'Orange',
                            background: '#f58231',
                            foreground: '#ffffff',
                        },
                        {
                            id: 9,
                            name: 'Yellow',
                            background: '#ffe119',
                            foreground: '#000000',
                        },
                        {
                            id: 10,
                            name: 'Lime',
                            background: '#bfef45',
                            foreground: '#000000',
                        },
                        {
                            id: 11,
                            name: 'Green',
                            background: '#3cb44b',
                            foreground: '#ffffff',
                        },
                        {
                            id: 12,
                            name: 'Cyan',
                            background: '#42d4f4',
                            foreground: '#000000',
                        },
                        {
                            id: 13,
                            name: 'Blue',
                            background: '#4363d8',
                            foreground: '#ffffff',
                        },
                        {
                            id: 14,
                            name: 'Purple',
                            background: '#911eb4',
                            foreground: '#ffffff',
                        },
                        {
                            id: 15,
                            name: 'Magenta',
                            background: '#f032e6',
                            foreground: '#ffffff',
                        },
                        {
                            id: 16,
                            name: 'Pink',
                            background: '#fabed4',
                            foreground: '#000000',
                        },
                        {
                            id: 17,
                            name: 'Apricot',
                            background: '#ffd8b1',
                            foreground: '#000000',
                        },
                        {
                            id: 18,
                            name: 'Beige',
                            background: '#fffac8',
                            foreground: '#000000',
                        },
                        {
                            id: 19,
                            name: 'Mint',
                            background: '#aaffc3',
                            foreground: '#000000',
                        },
                        {
                            id: 20,
                            name: 'Lavender',
                            background: '#dcbeff',
                            foreground: '#000000',
                        },
                        {
                            id: 21,
                            name: 'White',
                            background: '#ffffff',
                            foreground: '#000000',
                        },
                    ])
                );
                localStorage.setItem('tags', JSON.stringify([]));
                localStorage.setItem('tasks', JSON.stringify([]));
                localStorage.setItem('clocktimes', JSON.stringify([]));
                localStorage.setItem('settings', JSON.stringify({}));
            },
        },
    ];

    constructor() {
        const currentVersion = parseInt(
            localStorage.getItem('version') || '0',
            10
        );
        console.log(`Current version is: ${currentVersion}`);

        const migrations = this.migrations
            .filter((m) => m.id > currentVersion)
            .sort((a, b) => a.id - b.id);

        for (const migration of migrations) {
            console.log(`Upgrading to: ${migration.id}`);
            migration.upgrade();
            localStorage.setItem('version', `${migration.id}`);
        }
    }

    addTag(tag: Tag): Promise<Tag> {
        const tags = JSON.parse(localStorage.getItem('tags') || '') as Tag[];
        const maxId =
            tags.length > 0 ? tags.sort((a, b) => b.id - a.id)[0].id : 0;
        tag.id = maxId + 1;

        tags.push(tag);
        localStorage.setItem('tags', JSON.stringify(tags));

        return Promise.resolve(tag);
    }

    getTag(id: number): Promise<Tag | undefined> {
        const tags = JSON.parse(localStorage.getItem('tags') || '') as Tag[];
        return Promise.resolve(tags.find((t) => t.id === id));
    }

    getTagsByFilter(filter: (tag: Tag) => boolean): Promise<Tag[]> {
        const tags = JSON.parse(localStorage.getItem('tags') || '') as Tag[];
        return Promise.resolve(tags.filter(filter));
    }

    updateTag(tag: Tag): Promise<Tag> {
        const tags = JSON.parse(localStorage.getItem('tags') || '') as Tag[];
        const currentTag = tags.find((t) => t.id === tag.id);
        if (!currentTag) return this.addTag(tag);

        currentTag.name = tag.name;
        currentTag.colour = tag.colour;
        currentTag.active = tag.active;

        localStorage.setItem('tags', JSON.stringify(tags));

        return Promise.resolve(currentTag);
    }

    addTask(task: Task): Promise<Task> {
        const tasks = JSON.parse(localStorage.getItem('tasks') || '') as Task[];
        const maxId =
            tasks.length > 0 ? tasks.sort((a, b) => b.id - a.id)[0].id : 0;
        task.id = maxId + 1;

        tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(tasks));

        return Promise.resolve(task);
    }

    getTask(id: number): Promise<Task | undefined> {
        const tasks = JSON.parse(localStorage.getItem('tasks') || '') as Task[];
        return Promise.resolve(tasks.find((t) => t.id === id));
    }

    getTasksByFilter(filter: (task: Task) => boolean): Promise<Task[]> {
        const tasks = JSON.parse(localStorage.getItem('tasks') || '') as Task[];
        return Promise.resolve(tasks.filter(filter));
    }

    updateTask(task: Task): Promise<Task> {
        const tasks = JSON.parse(localStorage.getItem('tasks') || '') as Task[];
        const currentTask = tasks.find((t) => t.id === task.id);
        if (!currentTask) return this.addTask(task);

        currentTask.name = task.name;
        currentTask.tags = task.tags;
        currentTask.active = task.active;

        localStorage.setItem('tasks', JSON.stringify(tasks));

        return Promise.resolve(currentTask);
    }

    getColour(id: number): Promise<Colour | undefined> {
        const colours = JSON.parse(
            localStorage.getItem('colours') || ''
        ) as Colour[];
        return Promise.resolve(colours.find((c) => c.id === id));
    }

    getColoursByFilter(filter: (tag: Colour) => boolean): Promise<Colour[]> {
        const colours = JSON.parse(
            localStorage.getItem('colours') || ''
        ) as Colour[];
        return Promise.resolve(colours.filter(filter));
    }

    addClockTime(clockTime: ClockTime): Promise<ClockTime> {
        const clockTimes = JSON.parse(
            localStorage.getItem('clocktimes') || ''
        ) as ClockTime[];
        const maxId =
            clockTimes.length > 0
                ? clockTimes.sort((a, b) => b.id - a.id)[0].id
                : 0;
        clockTime.id = maxId + 1;

        clockTimes.push(clockTime);
        localStorage.setItem('clocktimes', JSON.stringify(clockTimes));

        return Promise.resolve(clockTime);
    }

    getClockTime(id: number): Promise<ClockTime | undefined> {
        const clockTimes = JSON.parse(
            localStorage.getItem('clocktimes') || ''
        ) as ClockTime[];
        return Promise.resolve(clockTimes.find((t) => t.id === id));
    }

    getClockTimesByFilter(
        filter: (clockTime: ClockTime) => boolean
    ): Promise<ClockTime[]> {
        const clockTimes = JSON.parse(
            localStorage.getItem('clocktimes') || ''
        ) as ClockTime[];
        return Promise.resolve(clockTimes.filter(filter));
    }

    updateClockTime(clockTime: ClockTime): Promise<ClockTime> {
        const clockTimes = JSON.parse(
            localStorage.getItem('clocktimes') || ''
        ) as ClockTime[];
        const currentClockTime = clockTimes.find((t) => t.id === clockTime.id);
        if (!currentClockTime) return this.addClockTime(clockTime);

        currentClockTime.task = clockTime.task;
        currentClockTime.start = clockTime.start;
        currentClockTime.finish = clockTime.finish;
        currentClockTime.active = clockTime.active;

        localStorage.setItem('clocktimes', JSON.stringify(clockTimes));

        return Promise.resolve(currentClockTime);
    }

    getSetting(key: SettingKey): any {
        const settings = JSON.parse(localStorage.getItem('settings') || '{}');
        return settings[key];
    }

    updateSetting(key: SettingKey, value: any): any {
        const settings = JSON.parse(localStorage.getItem('settings') || '{}');
        settings[key] = value;
        localStorage.setItem('settings', JSON.stringify(settings));
    }
}
