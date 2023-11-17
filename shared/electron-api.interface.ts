import { Tag, Task, Colour, ClockTime, SettingKey } from './entities';

export interface IElectronApi {
	consoleTest(input: string): Promise<string>;

	// Window
	minimizeWindow(): Promise<any>;
	maximizeWindow(): Promise<any>;
	closeWindow(): Promise<any>;
	setActiveIcon(): Promise<any>;
	setIdleIcon(): Promise<any>;

	// Tags
	addTag(tag: Tag): Promise<Tag>;
	getTag(id: number): Promise<Tag | undefined>;
	getAllTags(): Promise<Tag[]>;
	getActiveTags(): Promise<Tag[]>;
	getTagsByIds(ids: number[]): Promise<Tag[]>;
	updateTag(tag: Tag): Promise<Tag>;
	deleteTag(tag: Tag): Promise<boolean>;

	// Tasks
	addTask(task: Task): Promise<Task>;
	getTask(id: number): Promise<Task | undefined>;
	getAllTasks(): Promise<Task[]>;
	getActiveTasks(): Promise<Task[]>;
	getTasksByIds(ids: number[]): Promise<Task[]>;
	updateTask(task: Task): Promise<Task>;
	deleteTask(task: Task): Promise<boolean>;

	// Colours
	getColourById(id: number): Promise<Colour | undefined>;
	getColourByName(name: string): Promise<Colour | undefined>;
	getAllColours(): Promise<Colour[]>;

	// ClockTimes
	addClockTime(clockTime: ClockTime): Promise<ClockTime>;
	getClockTime(id: number): Promise<ClockTime | undefined>;
	getClockTimesInDateRange(minDate: Date, maxDate: Date): Promise<ClockTime[]>;
	getActiveClockTime(): Promise<ClockTime | undefined>;
	getClockTimesByIds(ids: number[]): Promise<ClockTime[]>;
	updateClockTime(clockTime: ClockTime): Promise<ClockTime>;
	deleteClockTime(clockTime: ClockTime): Promise<boolean>;

	// Settings
	getSetting(key: SettingKey): any;
	updateSetting(key: SettingKey, value: any): any;
}
