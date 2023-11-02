import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    Output,
} from '@angular/core';
import { v4 as uuidv4 } from 'uuid';

@Component({
    selector: 'app-dropdown',
    templateUrl: './dropdown.component.html',
    styleUrls: ['./dropdown.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownComponent {
    @Input() items: DropdownItem[] = [];
    @Input() ghost = false;
    @Input() set selectedValue(value: any) {
        this._selectedValue = value;
    }
    @Output() selectedValueChanged: EventEmitter<any> = new EventEmitter<any>();

    protected id: string = uuidv4();
    protected get selectedItem(): DropdownItem | undefined {
        return (
            this.items.find((x) => x.value === this._selectedValue) ??
            this.items.find((x) => x)
        );
    }
    protected _selectedValue: any;

    protected select(item: DropdownItem) {
        this._selectedValue = item.value;
        this.selectedValueChanged.emit(item.value);
    }
}

export class DropdownItem {
    value: any;
    text = '';
    foreground = 'inherit';
    background = 'inherit';

    constructor(value: any, text: string) {
        this.value = value;
        this.text = text;
    }
}
