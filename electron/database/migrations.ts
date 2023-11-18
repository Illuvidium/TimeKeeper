import * as sqlite3 from 'sqlite3';
import * as sqlite from 'sqlite';

export const migrations = [
	{
		id: 1,
		upgrade: async (db: sqlite.Database<sqlite3.Database>) => {
			//db.serialize(() => {
			await db.run('CREATE TABLE Version(version INTEGER)');
			await db.run(
				'CREATE TABLE Colours(id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, background TEXT NOT NULL, foreground TEXT NOT NULL)'
			);
			await db.run(
				'CREATE TABLE Tags(id INTEGER PRIMARY KEY AUTOINCREMENT, colour INTEGER NOT NULL, name TEXT NOT NULL, active BOOLEAN NOT NULL)'
			);
			await db.run('CREATE TABLE Tasks(id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, active BOOLEAN NOT NULL)');
			await db.run(
				'CREATE TABLE TaskTags(task INTEGER, tag INTEGER, FOREIGN KEY (task) REFERENCES Tasks(id), FOREIGN KEY (tag) REFERENCES Tags(id))'
			);
			await db.run(
				'CREATE TABLE ClockTimes(id INTEGER PRIMARY KEY AUTOINCREMENT, task INTEGER NOT NULL, start DATETIME NOT NULL, finish DATETIME, comments TEXT NOT NULL, active BOOLEAN NOT NULL)'
			);
			await db.run('CREATE TABLE Settings(id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT UNIQUE, value TEXT)');

			await db.run(`INSERT INTO Colours
                    VALUES
                    (NULL, 'Maroon', '#800000', '#ffffff'),
                    (NULL, 'Brown', '#9A6324', '#ffffff'),
                    (NULL, 'Olive', '#808000', '#ffffff'),
                    (NULL, 'Teal', '#469990', '#ffffff'),
                    (NULL, 'Navy', '#000075', '#ffffff'),
                    (NULL, 'Black', '#000000', '#ffffff'),
                    (NULL, 'Red', '#e6194B', '#ffffff'),
                    (NULL, 'Orange', '#f58231', '#ffffff'),
                    (NULL, 'Yellow', '#ffe119', '#000000'),
                    (NULL, 'Lime', '#bfef45', '#000000'),
                    (NULL, 'Green', '#3cb44b', '#ffffff'),
                    (NULL, 'Cyan', '#42d4f4', '#000000'),
                    (NULL, 'Blue', '#4363d8', '#ffffff'),
                    (NULL, 'Purple', '#911eb4', '#ffffff'),
                    (NULL, 'Magenta', '#f032e6', '#ffffff'),
                    (NULL, 'Pink', '#fabed4', '#000000'),
                    (NULL, 'Apricot', '#ffd8b1', '#000000'),
                    (NULL, 'Beige', '#fffac8', '#000000'),
                    (NULL, 'Mint', '#aaffc3', '#000000'),
                    (NULL, 'Lavender', '#dcbeff', '#000000'),
                    (NULL, 'White', '#ffffff', '#000000');`);

			await db.run(`INSERT INTO Version VALUES (1);`);
			//});
		},
	},
];

export class Migration {
	id: number;
	upgrade: (db: sqlite.Database<sqlite3.Database>) => void;

	constructor(id: number, upgrade: (db: sqlite.Database<sqlite3.Database>) => void) {
		this.id = id;
		this.upgrade = upgrade;
	}
}
