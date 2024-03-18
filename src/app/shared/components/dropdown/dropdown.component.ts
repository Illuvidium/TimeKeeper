import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { Tag } from '../../../../../shared/entities';

@Component({
	selector: 'app-dropdown',
	templateUrl: './dropdown.component.html',
	styleUrls: ['./dropdown.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownComponent {
	@Input() items: DropdownItem[] = [];
	@Input() ghost = false;
	@Input() placeholder = '';
	@Input() set selectedValue(value: any) {
		this._selectedValue = value;
	}
	@Output() selectedValueChanged: EventEmitter<any> = new EventEmitter<any>();

	protected id: string = uuidv4();
	protected get selectedItem(): DropdownItem | undefined {
		return this.items.find(x => x.value === this._selectedValue);
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
	foreground: string | undefined = undefined;
	background: string | undefined = undefined;
	tags: Tag[] = [];

	constructor(value: any, text: string, tags: Tag[] = []) {
		this.value = value;
		this.text = text;
		this.tags = tags;
	}
}
