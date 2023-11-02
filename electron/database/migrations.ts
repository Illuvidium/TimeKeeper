import * as Store from 'electron-store';

export const migrations = [
    {
        id: 1,
        upgrade: (store: Store) => {
            store.clear();
            store.set('colours', [
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
            ]);

            store.set('tags', []);
            store.set('tasks', []);
            store.set('clocktimes', []);
            store.set('settings', {});
        },
    },
];

export class Migration {
    id: number;
    upgrade: (store: Store) => void;

    constructor(id: number, upgrade: (store: Store) => void) {
        this.id = id;
        this.upgrade = upgrade;
    }
}
