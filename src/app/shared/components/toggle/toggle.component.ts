import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    Output,
} from '@angular/core';

@Component({
    selector: 'app-toggle',
    templateUrl: './toggle.component.html',
    styleUrls: ['./toggle.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToggleComponent {
    @Input() small = false;
    @Input() text = '';
    @Input() set checked(value: boolean) {
        this.isOn = value;
        this.cdr.detectChanges();
    }
    @Output() checkChanged: EventEmitter<boolean> = new EventEmitter<boolean>();

    protected isOn = false;

    constructor(private cdr: ChangeDetectorRef) {}
}
