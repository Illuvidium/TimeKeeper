import { Injectable } from '@angular/core';
import { ElectronApi } from '../../../shared/interfaces/electron-api';

@Injectable({
    providedIn: 'root',
})
export class ElectronService {
    private electronAPI: ElectronApi | null;

    get isElectron(): boolean {
        return !!(window && window.electronAPI);
    }

    constructor() {
        // Conditional imports
        if (this.isElectron) {
            this.electronAPI = (window.electronAPI as ElectronApi) || null;
            return;
        }

        this.electronAPI = null;
    }

    getApi(): ElectronApi | null {
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
