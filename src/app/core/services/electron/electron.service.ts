import { Injectable } from '@angular/core';
import { IElectronApi } from '../../../../../shared/electron-api.interface';

@Injectable({
    providedIn: 'root',
})
export class ElectronService {
    private electronAPI: IElectronApi | null;

    get isElectron(): boolean {
        return !!(window && window.electronAPI);
    }

    constructor() {
        // Conditional imports
        if (this.isElectron) {
            this.electronAPI = (window.electronAPI as IElectronApi) || null;
            return;
        }

        this.electronAPI = null;
    }

    getApi(): IElectronApi | null {
        return this.electronAPI;
    }

    minimize(): Promise<any> {
        return this.electronAPI?.minimizeWindow() || Promise.resolve(false);
    }

    maximize(): Promise<any> {
        return this.electronAPI?.maximizeWindow() || Promise.resolve(false);
    }

    close(): Promise<any> {
        return this.electronAPI?.closeWindow() || Promise.resolve(false);
    }
}
