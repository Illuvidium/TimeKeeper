import { Tag, Task, Colour, ClockTime, SettingKey } from './entities';

export interface ElectronApi {
    consoleTest(input: string): Promise<string>;

    minimizeWindow(): Promise<any>;
    maximizeWindow(): Promise<any>;
    closeWindow(): Promise<any>;

    // Tags
    addTag(tag: Tag): Promise<Tag>;
    getTag(id: number): Promise<Tag | undefined>;
    getAllTags(): Promise<Tag[]>;
    updateTag(tag: Tag): Promise<Tag>;
    deleteTag(tag: Tag): Promise<boolean>;

    // Tasks
    addTask(task: Task): Promise<Task>;
    getTask(id: number): Promise<Task | undefined>;
    getAllTasks(): Promise<Task[]>;
    updateTask(task: Task): Promise<Task>;
    deleteTask(task: Task): Promise<boolean>;

    // Colours
    getColour(id: number): Promise<Colour | undefined>;
    getAllColours(): Promise<Colour[]>;

    // ClockTimes
    addClockTime(clockTime: ClockTime): Promise<ClockTime>;
    getClockTime(id: number): Promise<ClockTime | undefined>;
    getAllClockTimes(): Promise<ClockTime[]>;
    updateClockTime(clockTime: ClockTime): Promise<ClockTime>;
    deleteClockTime(clockTime: ClockTime): Promise<boolean>;

    // Settings
    getSetting(key: SettingKey): any;
    updateSetting(key: SettingKey, value: any): any;
}
