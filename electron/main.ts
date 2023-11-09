import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import * as electronDebug from 'electron-debug';
import * as electronReloader from 'electron-reloader';
import { Database } from './database/database';
import { Tag, Task, Colour, ClockTime, SettingKey } from '../shared/entities';

let win: BrowserWindow | null = null;
const database: Database = new Database();

const args = process.argv.slice(1),
    serve = args.some((val) => val === '--serve');

const createWindow = async () => {
    // Create the browser window.
    win = new BrowserWindow({
        x: 0,
        y: 0,
        width: 1200,
        height: 800,
        minWidth: 800,
        minHeight: 400,
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
    });

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

    ipcMain.handle('addTag', (event, tag: Tag): Tag => database.addTag(tag));
    ipcMain.handle('getTag', (event, id: number): Tag | undefined =>
        database.getTag(id)
    );
    ipcMain.handle('getAllTags', (): Tag[] =>
        database.getTagsByFilter(() => true)
    );
    ipcMain.handle(
        'updateTag',
        (event, tag: Tag): Tag => database.updateTag(tag)
    );
    ipcMain.handle('deleteTag', (event, tag: Tag): boolean =>
        database.deleteTag(tag)
    );

    ipcMain.handle(
        'addTask',
        (event, task: Task): Task => database.addTask(task)
    );
    ipcMain.handle('getTask', (event, id: number): Task | undefined =>
        database.getTask(id)
    );
    ipcMain.handle('getAllTasks', (): Task[] =>
        database.getTasksByFilter(() => true)
    );
    ipcMain.handle(
        'updateTask',
        (event, Task: Task): Task => database.updateTask(Task)
    );
    ipcMain.handle('deleteTask', (event, task: Task): boolean =>
        database.deleteTask(task)
    );

    ipcMain.handle('getColour', (event, id: number): Colour | undefined =>
        database.getColour(id)
    );
    ipcMain.handle('getAllColours', (): Colour[] =>
        database.getColoursByFilter(() => true)
    );

    ipcMain.handle(
        'addClockTime',
        (event, clockTime: ClockTime): ClockTime =>
            database.addClockTime(clockTime)
    );
    ipcMain.handle('getClockTime', (event, id: number): ClockTime | undefined =>
        database.getClockTime(id)
    );
    ipcMain.handle('getAllClockTimes', (): ClockTime[] =>
        database.getClockTimesByFilter(() => true)
    );
    ipcMain.handle(
        'updateClockTime',
        (event, clockTime: ClockTime): ClockTime =>
            database.updateClockTime(clockTime)
    );
    ipcMain.handle('deleteClockTime', (event, clockTime: ClockTime): boolean =>
        database.deleteClockTime(clockTime)
    );

    ipcMain.handle('getSetting', (event, key: SettingKey): any =>
        database.getSetting(key)
    );
    ipcMain.handle('updateSetting', (event, key: SettingKey, value: any): any =>
        database.updateSetting(key, value)
    );

    if (serve) {
        //const debug = require('electron-debug');
        electronDebug();

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
            await createWindow();

            app.on('activate', () => {
                if (BrowserWindow.getAllWindows().length === 0)
                    createWindow()
                        .then(() => {})
                        .catch(() => {});
            });
        })
        .catch(() => {});

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
