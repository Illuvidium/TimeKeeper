import { AfterViewInit, Directive, DoCheck, ElementRef, EventEmitter, HostListener, Input, KeyValueDiffers, OnDestroy, Output } from '@angular/core';
import { FormControl } from '../classes/forms';
import { ValidationService } from '../services/validation.service';
import { SubscriptionLike } from 'rxjs';
import * as moment from 'moment';

@Directive({
	selector: '[formControlDirective]',
})
export class FormControlDirective implements DoCheck, AfterViewInit, OnDestroy {
	@Input() set formControlDirective(value: FormControl<any>) {
		this.myFormControl = value;
		this.setInputValue(value.value);
		this.setCssClass();
	}
	@Output() resetValue: EventEmitter<any> = new EventEmitter<any>();

	private stateDiffer: any;
	private myFormControl: FormControl<any> = new FormControl('');
	private htmlElement: HTMLInputElement | HTMLButtonElement | undefined;
	private validationSubscription: SubscriptionLike;

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

		if (this.htmlElement && this.htmlElement.tagName.toUpperCase() === 'NGB-TIMEPICKER') {
			this.validationService.triggerValidation();
		}
	}

	@HostListener('change') change() {
		this.setModelValue();
		this.validationService.triggerValidation();
	}

	constructor(private elementRef: ElementRef, private differs: KeyValueDiffers, private validationService: ValidationService) {
		this.stateDiffer = differs.find([]).create();
		this.validationSubscription = this.validationService.validationTriggered.subscribe(() => {
			this.setCssClass();
		});
	}

	ngAfterViewInit(): void {
		this.htmlElement =
			this.elementRef.nativeElement.tagName === 'INPUT'
				? this.elementRef.nativeElement
				: this.elementRef.nativeElement.querySelector('.frm-control') ?? this.elementRef.nativeElement;

		this.htmlElement?.setAttribute('autocomplete', 'off');
		this.setCssClass();
	}

	ngOnDestroy(): void {
		this.validationSubscription.unsubscribe();
	}

	ngDoCheck(): void {
		const changes = this.stateDiffer.diff(this.myFormControl);
		if (changes) {
			changes.forEachChangedItem((elt: any) => {
				if (elt.key === 'submitAttempted') {
					if (!elt.currentValue) this.setInputValue(this.myFormControl.initialValue);
					this.setCssClass();
				}
			});
		}
	}

	private setInputValue(value: any) {
		if (this.htmlElement && this.htmlElement.attributes.getNamedItem('ngbdatepicker') === null) {
			this.htmlElement.value = value;
			this.resetValue.emit(value);
		}
	}

	private setModelValue() {
		if (!this.htmlElement) {
			return;
		}

		if (this.htmlElement.attributes.getNamedItem('ngbdatepicker') !== null) {
			this.setDateValue();
			return;
		}

		if (this.htmlElement.tagName.toUpperCase() === 'NGB-TIMEPICKER') {
			this.setTimeValue();
			return;
		}

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

	private setDateValue() {
		const stringValue = this.htmlElement?.value || '';

		const momentDate = moment(stringValue, 'YYYY-MM-DD', true);
		if (!momentDate.isValid()) return;

		this.myFormControl.value = { day: momentDate.date(), month: momentDate.month() + 1, year: momentDate.year() };
	}

	private setTimeValue() {
		if (!this.htmlElement) {
			return;
		}

		const hourInput: HTMLInputElement | null = this.htmlElement.querySelector('.ngb-tp-hour input[type="text"]');
		const minuteInput: HTMLInputElement | null = this.htmlElement.querySelector('.ngb-tp-minute input[type="text"]');
		const secondInput: HTMLInputElement | null = this.htmlElement.querySelector('.ngb-tp-second input[type="text"]');

		if (hourInput === document.activeElement) return;
		if (minuteInput === document.activeElement) return;
		if (secondInput === document.activeElement) return;

		const hourValue = hourInput ? parseInt(hourInput.value || '-1', 10) : this.myFormControl.value.hour;
		const minuteValue = minuteInput ? parseInt(minuteInput.value || '-1', 10) : this.myFormControl.value.minute;
		const secondValue = secondInput ? parseInt(secondInput.value || '-1', 10) : this.myFormControl.value.second;

		if (hourValue < 0 || hourValue > 23) return;
		if (minuteValue < 0 || minuteValue > 59) return;
		if (secondValue < 0 || secondValue > 59) return;

		this.myFormControl.value = { hour: hourValue, minute: minuteValue, second: secondValue };
	}

	private setCssClass() {
		const classes = ['frm-control', this.myFormControl.validationClass];

		if (this.htmlElement !== undefined && !!this.htmlElement?.classList) {
			if (this.htmlElement.classList.contains('dropdown-toggle')) classes.push('dropdown-toggle');
			this.htmlElement.className = classes.filter(c => !!c).join(' ');
		}
	}
}
