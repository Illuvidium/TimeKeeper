import { Tag, Task, Colour, ClockTime, SettingKey } from './entities';

export interface DataAccess {
    // Tags
    addTag(tag: Tag): Promise<Tag>;
    getTag(id: number): Promise<Tag | undefined>;
    getTagsByFilter(filter: (tag: Tag) => boolean): Promise<Tag[]>;
    updateTag(tag: Tag): Promise<Tag>;

    // Tasks
    addTask(task: Task): Promise<Task>;
    getTask(id: number): Promise<Task | undefined>;
    getTasksByFilter(filter: (task: Task) => boolean): Promise<Task[]>;
    updateTask(task: Task): Promise<Task>;

    // Colours
    getColour(id: number): Promise<Colour | undefined>;
    getColoursByFilter(filter: (colour: Colour) => boolean): Promise<Colour[]>;

    // ClockTimes
    addClockTime(clockTime: ClockTime): Promise<ClockTime>;
    getClockTime(id: number): Promise<ClockTime | undefined>;
    getClockTimesByFilter(
        filter: (clockTime: ClockTime) => boolean
    ): Promise<ClockTime[]>;
    updateClockTime(clockTime: ClockTime): Promise<ClockTime>;

    // Settings
    getSetting(key: SettingKey): any;
    updateSetting(key: SettingKey, value: any): any;
}
