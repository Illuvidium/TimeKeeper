export interface Tag {
    id: number;
    name: string;
    colour: number;
    active: boolean;
}

export interface Colour {
    id: number;
    name: string;
    background: string;
    foreground: string;
}

export interface Task {
    id: number;
    name: string;
    colour: number;
    tags: number[];
    active: boolean;
}

export interface ClockTime {
    id: number;
    task: number;
    start: Date;
    finish: Date | undefined;
    active: boolean;
}

export interface Setting {
    key: SettingKey;
    value: any;
}

export enum SettingKey {
    Tags_SortOrder = 'Tags_SortOrder',
    Tags_ShowInvactive = 'Tags_ShowInvactive',
}
