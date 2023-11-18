/* eslint-disable @typescript-eslint/no-var-requires */
import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import { Database } from './database/database';
import { Tag, Task, Colour, ClockTime, SettingKey } from '../shared/entities';
import * as Splashscreen from '@trodi/electron-splashscreen';

let win: BrowserWindow | null = null;
const database: Database = new Database();

const args = process.argv.slice(1),
	serve = args.some(val => val === '--serve');

const createWindow = async () => {
	// Create the browser window.
	const windowOptions = {
		width: 1200,
		height: 800,
		minWidth: 800,
		minHeight: 600,
		autoHideMenuBar: true,
		frame: false,
		title: 'Timekeeper',
		icon: path.join(__dirname, 'icons/default.png'),

		webPreferences: {
			nodeIntegration: true,
			allowRunningInsecureContent: serve,
			contextIsolation: true,
			preload: path.join(__dirname, 'preload.js'),
		},
	};

	win = Splashscreen.initSplashScreen({
		windowOpts: windowOptions,
		templateUrl: path.join(__dirname, 'splash/index.html'),
		delay: 0, // force show immediately since example will load fast
		minVisible: 500, // show for 1.5s so example is obvious
		splashScreenOpts: {
			height: 600,
			width: 800,
		},
	});
	//win = new BrowserWindow(windowOptions);

	win.setMenuBarVisibility(false);
	win.setMenu(null);

	// Emitted when the window is closed.
	win.on('closed', () => {
		// Dereference the window object, usually you would store window
		// in an array if your app supports multi windows, this is the time
		// when you should delete the corresponding element.
		win = null;
	});

	win.on('maximize', () => {
		win?.webContents
			.executeJavaScript(`window.fromElectron.maximizeChanged(true)`)
			.then(() => {})
			.catch(() => {});
	});

	win.on('unmaximize', () => {
		win?.webContents
			.executeJavaScript(`window.fromElectron.maximizeChanged(false)`)
			.then(() => {})
			.catch(() => {});
	});

	ipcMain.handle('consoleTest', (event, title: string) => {
		console.log('logging: ' + title);
		return 'Message received: ' + title;
	});

	ipcMain.handle('minimizeWindow', () => {
		win?.minimize();
	});

	ipcMain.handle('maximizeWindow', () => {
		if (win != null) {
			win.isMaximized() ? win.unmaximize() : win.maximize();
		}
	});

	ipcMain.handle('closeWindow', () => {
		win?.close();
	});

	ipcMain.handle('setActiveIcon', () => {
		win?.setIcon(path.join(__dirname, 'icons/active.png'));
	});

	ipcMain.handle('setIdleIcon', () => {
		win?.setIcon(path.join(__dirname, 'icons/idle.png'));
	});

	// Tags
	ipcMain.handle('addTag', async (event, tag: Tag): Promise<Tag> => await database.addTag(tag));
	ipcMain.handle('getTag', async (event, id: number): Promise<Tag | undefined> => await database.getTag(id));
	ipcMain.handle('getAllTags', async (): Promise<Tag[]> => await database.getAllTags());
	ipcMain.handle('getActiveTags', async (): Promise<Tag[]> => await database.getActiveTags());
	ipcMain.handle('getTagsByIds', async (event, ids: number[]): Promise<Tag[]> => await database.getTagsByIds(ids));
	ipcMain.handle('updateTag', async (event, tag: Tag): Promise<Tag> => await database.updateTag(tag));

	// Tasks
	ipcMain.handle('addTask', async (event, task: Task): Promise<Task> => await database.addTask(task));
	ipcMain.handle('getTask', async (event, id: number): Promise<Task | undefined> => await database.getTask(id));
	ipcMain.handle('getAllTasks', async (): Promise<Task[]> => await database.getAllTasks());
	ipcMain.handle('getActiveTasks', async (): Promise<Task[]> => await database.getActiveTasks());
	ipcMain.handle('getTasksByIds', async (event, ids: number[]): Promise<Task[]> => await database.getTasksByIds(ids));
	ipcMain.handle('updateTask', async (event, Task: Task): Promise<Task> => await database.updateTask(Task));

	// Colours
	ipcMain.handle('getColourById', async (event, id: number): Promise<Colour | undefined> => await database.getColourById(id));
	ipcMain.handle('getColourByName', async (event, name: string): Promise<Colour | undefined> => await database.getColourByName(name));
	ipcMain.handle('getAllColours', async (): Promise<Colour[]> => await database.getAllColours());

	// ClockTimes
	ipcMain.handle('addClockTime', async (event, clockTime: ClockTime): Promise<ClockTime> => await database.addClockTime(clockTime));
	ipcMain.handle('getClockTime', async (event, id: number): Promise<ClockTime | undefined> => await database.getClockTime(id));
	ipcMain.handle(
		'getClockTimesInDateRange',
		async (event, minDate: Date, maxDate: Date): Promise<ClockTime[]> => await database.getClockTimesInDateRange(minDate, maxDate)
	);
	ipcMain.handle('getActiveClockTime', async (): Promise<ClockTime | undefined> => await database.getActiveClockTime());
	ipcMain.handle('getClockTimesByIds', async (event, ids: number[]): Promise<ClockTime[]> => await database.getClockTimesByIds(ids));
	ipcMain.handle('updateClockTime', async (event, clockTime: ClockTime): Promise<ClockTime> => await database.updateClockTime(clockTime));

	// Settings
	ipcMain.handle('getSetting', async (event, key: SettingKey): Promise<any> => await database.getSetting(key));
	ipcMain.handle('updateSetting', async (event, key: SettingKey, value: any): Promise<any> => await database.updateSetting(key, value));

	if (serve) {
		const electronDebug: any = await import('electron-debug');
		electronDebug();

		const electronReloader: any = await import('electron-reloader');
		electronReloader(module);

		await win.loadURL('http://localhost:4200');
	} else {
		// Path when running electron executable
		let pathIndex = './index.html';

		if (fs.existsSync(path.join(__dirname, '../dist/index.html'))) {
			// Path when running electron in local folder
			pathIndex = '../dist/index.html';
		}

		const url = new URL(path.join('file:', __dirname, pathIndex));
		await win.loadURL(url.href);
	}

	return win;
};

try {
	app.whenReady()
		.then(async () => {
			await database.initConnection();
			await createWindow();

			app.on('activate', () => {
				if (BrowserWindow.getAllWindows().length === 0)
					createWindow()
						.then(() => {})
						.catch(() => {});
			});
		})
		.catch(err => {
			console.error(err);
		});

	app.on('window-all-closed', () => {
		if (process.platform !== 'darwin') app.quit();
	});
	// // This method will be called when Electron has finished
	// // initialization and is ready to create browser windows.
	// // Some APIs can only be used after this event occurs.
	// // Added 400 ms to fix the black background issue while using transparent window. More detais at https://github.com/electron/electron/issues/15947
	// app.on('ready', () => setTimeout(createWindow, 400));

	// // Quit when all windows are closed.
	// app.on('window-all-closed', () => {
	//     // On OS X it is common for applications and their menu bar
	//     // to stay active until the user quits explicitly with Cmd + Q
	//     if (process.platform !== 'darwin') {
	//         app.quit();
	//     }
	// });

	// app.on('activate', () => {
	//     // On OS X it's common to re-create a window in the app when the
	//     // dock icon is clicked and there are no other windows open.
	//     if (win === null) {
	//         createWindow();
	//     }
	// });
} catch (e) {
	// Catch Error
	// throw e;
}
