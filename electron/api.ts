import { ipcRenderer } from 'electron';
import { Tag, Task, Colour, ClockTime, SettingKey } from '../shared/entities';
import { IElectronApi } from '../shared/electron-api.interface';

export const api: IElectronApi = {
	consoleTest: (title: string): Promise<any> => ipcRenderer.invoke('consoleTest', title),

	// Window
	minimizeWindow: (): Promise<any> => ipcRenderer.invoke('minimizeWindow'),
	maximizeWindow: (): Promise<any> => ipcRenderer.invoke('maximizeWindow'),
	closeWindow: (): Promise<any> => ipcRenderer.invoke('closeWindow'),
	setActiveIcon: (): Promise<any> => ipcRenderer.invoke('setActiveIcon'),
	setIdleIcon: (): Promise<any> => ipcRenderer.invoke('setIdleIcon'),

	// Tags
	addTag: (tag: Tag): Promise<Tag> => ipcRenderer.invoke('addTag', tag) as Promise<Tag>,
	getTag: (id: number): Promise<Tag | undefined> => ipcRenderer.invoke('getTag', id) as Promise<Tag | undefined>,
	getAllTags: (): Promise<Tag[]> => ipcRenderer.invoke('getAllTags') as Promise<Tag[]>,
	getActiveTags: (): Promise<Tag[]> => ipcRenderer.invoke('getActiveTags') as Promise<Tag[]>,
	getTagsByIds: (ids: number[]): Promise<Tag[]> => ipcRenderer.invoke('getTagsByIds', ids) as Promise<Tag[]>,
	updateTag: (tag: Tag): Promise<Tag> => ipcRenderer.invoke('updateTag', tag) as Promise<Tag>,
	deleteTag: (tag: Tag): Promise<boolean> => ipcRenderer.invoke('deleteTag', tag) as Promise<boolean>,

	// Tasks
	addTask: (task: Task): Promise<Task> => ipcRenderer.invoke('addTask', task) as Promise<Task>,
	getTask: (id: number): Promise<Task | undefined> => ipcRenderer.invoke('getTask', id) as Promise<Task | undefined>,
	getAllTasks: (): Promise<Task[]> => ipcRenderer.invoke('getAllTasks') as Promise<Task[]>,
	getActiveTasks: (): Promise<Task[]> => ipcRenderer.invoke('getActiveTasks') as Promise<Task[]>,
	getTasksByIds: (ids: number[]): Promise<Task[]> => ipcRenderer.invoke('getTasksByIds', ids) as Promise<Task[]>,
	updateTask: (task: Task): Promise<Task> => ipcRenderer.invoke('updateTask', task) as Promise<Task>,
	deleteTask: (task: Task): Promise<boolean> => ipcRenderer.invoke('deleteTask', task) as Promise<boolean>,

	// Colours
	getColourById: (id: number): Promise<Colour | undefined> => ipcRenderer.invoke('getColourById', id) as Promise<Colour | undefined>,
	getColourByName: (name: string): Promise<Colour | undefined> => ipcRenderer.invoke('getColourByName', name) as Promise<Colour | undefined>,
	getAllColours: (): Promise<Colour[]> => ipcRenderer.invoke('getAllColours') as Promise<Colour[]>,

	// ClockTimes
	addClockTime: (clockTime: ClockTime): Promise<ClockTime> => ipcRenderer.invoke('addClockTime', clockTime) as Promise<ClockTime>,
	getClockTime: (id: number): Promise<ClockTime | undefined> => ipcRenderer.invoke('getClockTime', id) as Promise<ClockTime | undefined>,
	getClockTimesInDateRange: (minDate: Date, maxDate: Date): Promise<ClockTime[]> =>
		ipcRenderer.invoke('getClockTimesInDateRange', minDate, maxDate) as Promise<ClockTime[]>,
	getActiveClockTime: (): Promise<ClockTime | undefined> => ipcRenderer.invoke('getActiveClockTime') as Promise<ClockTime | undefined>,
	getClockTimesByIds: (ids: number[]): Promise<ClockTime[]> => ipcRenderer.invoke('getClockTimesByIds', ids) as Promise<ClockTime[]>,
	updateClockTime: (clockTime: ClockTime): Promise<ClockTime> => ipcRenderer.invoke('updateClockTime', clockTime) as Promise<ClockTime>,
	deleteClockTime: (clockTime: ClockTime): Promise<boolean> => ipcRenderer.invoke('deleteClockTime', clockTime) as Promise<boolean>,

	getSetting: (key: SettingKey): Promise<any> => ipcRenderer.invoke('getSetting', key),
	updateSetting: (key: SettingKey, value: any): Promise<any> => ipcRenderer.invoke('updateSetting', key, value),
};
