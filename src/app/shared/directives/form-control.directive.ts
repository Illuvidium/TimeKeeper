import { AfterViewInit, Directive, DoCheck, ElementRef, EventEmitter, HostListener, Input, KeyValueDiffers, Output } from '@angular/core';
import { FormControl } from '../classes/forms';

@Directive({
	selector: '[formControlDirective]',
})
export class FormControlDirective implements DoCheck, AfterViewInit {
	@Input() set formControlDirective(value: FormControl) {
		this.myFormControl = value;
		this.setInputValue(value.value);
		this.setCssClass();
	}
	@Output() resetValue: EventEmitter<any> = new EventEmitter<any>();

	private stateDiffer: any;
	private myFormControl: FormControl = new FormControl('');
	private htmlElement: HTMLInputElement | HTMLButtonElement | undefined;

	@HostListener('keyup') keyup() {
		this.setModelValue();
	}
	@HostListener('keydown') keydown() {
		this.setModelValue();
	}
	@HostListener('keypress') keypress() {
		this.setModelValue();
	}
	@HostListener('click') click() {
		this.setModelValue();
	}

	@HostListener('change') change() {
		this.setModelValue();
		this.setCssClass();
	}

	constructor(private elementRef: ElementRef, differs: KeyValueDiffers) {
		this.stateDiffer = differs.find([]).create();
	}

	ngAfterViewInit(): void {
		this.htmlElement =
			this.elementRef.nativeElement.tagName === 'INPUT'
				? this.elementRef.nativeElement
				: this.elementRef.nativeElement.querySelector('.frm-control');

		this.htmlElement?.setAttribute('autocomplete', 'off');
		this.setCssClass();
	}

	ngDoCheck(): void {
		const changes = this.stateDiffer.diff(this.myFormControl);
		if (changes) {
			changes.forEachChangedItem((elt: any) => {
				if (elt.key === 'submitAttempted') {
					console.log(this.htmlElement);
					this.setInputValue(this.myFormControl.initialValue);
					this.setCssClass();
				}
			});
		}
	}

	private setInputValue(value: any) {
		if (this.htmlElement) {
			this.htmlElement.value = value;
			this.resetValue.emit(value);
		}
	}

	private setModelValue() {
		const stringValue = this.htmlElement?.value || '';
		switch (typeof this.myFormControl.value) {
			case 'number':
				this.myFormControl.value = parseFloat(stringValue);
				break;
			case 'boolean':
				this.myFormControl.value = !!stringValue;
				break;
			default:
				this.myFormControl.value = stringValue;
		}
	}

	private setCssClass() {
		const classes = ['frm-control', this.myFormControl.validationClass];

		if (this.htmlElement !== undefined) {
			if (this.htmlElement.classList.contains('dropdown-toggle')) classes.push('dropdown-toggle');
			this.htmlElement.className = classes.filter(c => !!c).join(' ');
		}
	}
}
