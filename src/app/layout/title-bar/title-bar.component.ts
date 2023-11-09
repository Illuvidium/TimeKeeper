import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    NgZone,
    OnInit,
} from '@angular/core';
import { ElectronService } from '../../shared/services/electron.service';

@Component({
    selector: 'app-title-bar',
    templateUrl: './title-bar.component.html',
    styleUrls: ['./title-bar.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TitleBarComponent implements OnInit {
    protected maximiseIcon = 'fa-window-maximize';

    constructor(
        private electronService: ElectronService,
        private ngZone: NgZone,
        private cdr: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        window.fromElectron = {
            maximizeChanged: (isMaximised: boolean) => {
                this.ngZone.run(() => {
                    this.maximiseIcon = isMaximised
                        ? 'fa-window-restore'
                        : 'fa-window-maximize';
                    this.cdr.detectChanges();
                });
            },
        };
    }

    async minimise() {
        await this.electronService.minimize();
    }

    async maximise() {
        await this.electronService.maximize();
    }

    async close() {
        //BrowserWindow.getFocusedWindow()?.close();
        await this.electronService.close();
    }
}
