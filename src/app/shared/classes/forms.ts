import { NgbDateStruct, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';

export class FormGroup {
	controls: any = {};
	submitAttempted = false;

	get valid(): boolean {
		const controls = this.getControls();
		return controls.every(c => c.valid);
	}

	constructor(components: any) {
		this.controls = components;
	}

	registerSubmitAttempt() {
		this.submitAttempted = true;
		const controls = this.getControls();
		for (const control of controls) control.submitAttempted = true;
	}

	reset() {
		const controls = this.getControls();
		for (const control of controls) control.reset();
		this.submitAttempted = false;

		for (const entry of Object.entries(this.controls as object)) {
			this.controls[entry[0]] = entry[1];
		}
	}

	get errorMessages(): string[] {
		return Object.entries(this.controls as object)
			.filter(([, value]) => value instanceof FormControl)
			.map(([, value]) => {
				const control = value as FormControl<any>;
				return control.errorMessages.map(msg => msg.replace('[NAME]', control.name));
			})
			.reduce((a, b) => [...a, ...b]);
	}

	private getControls(): FormControl<any>[] {
		return Object.entries(this.controls as object)
			.filter(([, value]) => value instanceof FormControl)
			.map(([, value]) => value as FormControl<any>);
	}
}

export class FormControl<T> {
	name = '';
	initialValue: T;
	value: T;
	validators: FormControlValidator[] = [];
	submitAttempted = false;

	get validationClass(): string {
		if (!this.submitAttempted) {
			return '';
		}

		return this.valid ? 'is-valid' : 'is-invalid';
	}

	get valid(): boolean {
		return this.validators.every((v: FormControlValidator) => v.validate(this));
	}

	get errorMessages(): string[] {
		return this.validators.filter((v: FormControlValidator) => !v.validate(this)).map((v: FormControlValidator) => v.validationMessage);
	}

	constructor(value: any, name: string = '', validators: FormControlValidator[] = []) {
		this.name = name;
		this.initialValue = Array.isArray(value) ? [...value] : typeof value === 'object' ? Object.assign({}, value) : value;
		this.value = value;
		this.validators = validators;
	}

	reset() {
		if (Array.isArray(this.initialValue)) {
			this.value = [...this.initialValue] as T;
			this.submitAttempted = false;
			return;
		}

		if (typeof this.initialValue === 'object') {
			this.value = Object.assign({}, this.initialValue);
			this.submitAttempted = false;
			return;
		}

		this.value = this.initialValue;
		this.submitAttempted = false;
	}
}

export class FormControlValidator {
	validate: (formControl: FormControl<any>) => boolean;
	validationMessage: string;
	constructor(validate: (formControl: FormControl<any>) => boolean, errorMessage = '') {
		this.validate = validate;
		this.validationMessage = errorMessage || '[NAME] is invalid';
	}
}

export class RequiredValidator implements FormControlValidator {
	validate: (formControl: FormControl<any>) => boolean = (formControl: FormControl<any>) => !!formControl.value;
	validationMessage = '[NAME] is required';
}

export class DateNonFutureValidator implements FormControlValidator {
	validate: (formControl: FormControl<NgbDateStruct>) => boolean = (formControl: FormControl<NgbDateStruct>) => {
		const dateModel: NgbDateStruct = formControl.value;
		const now = new Date();
		const date = new Date(dateModel.year, dateModel.month - 1, dateModel.day, now.getHours(), now.getMinutes(), now.getSeconds());
		return date <= now;
	};
	validationMessage = '[NAME] cannot be in the future';

	constructor() {}
}

export class TimeNonFutureValidator implements FormControlValidator {
	validate: (formControl: FormControl<NgbTimeStruct>) => boolean = (formControl: FormControl<NgbTimeStruct>) => {
		const dateModel: NgbDateStruct = this.formControlDate.value;
		const timeModel: NgbTimeStruct = formControl.value;
		const date = new Date(dateModel.year, dateModel.month - 1, dateModel.day, timeModel.hour, timeModel.minute, timeModel.second);
		return date <= new Date();
	};
	validationMessage = '[NAME] cannot be in the future';

	formControlDate: FormControl<NgbDateStruct>;

	constructor(formControlDate: FormControl<NgbDateStruct>) {
		this.formControlDate = formControlDate;
	}
}
