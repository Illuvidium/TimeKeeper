export class FormGroup {
    controls: any = {};
    submitAttempted = false;

    get valid(): boolean {
        const controls = this.getControls();
        return controls.every((c) => c.valid);
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
            .map(([key, value]) =>
                (value as FormControl).errorMessages.map((msg) =>
                    msg.replace('[NAME]', key)
                )
            )
            .reduce((a, b) => [...a, ...b]);
    }

    private getControls(): FormControl[] {
        return Object.entries(this.controls as object)
            .filter(([, value]) => value instanceof FormControl)
            .map(([, value]) => value as FormControl);
    }
}

export class FormControl {
    initialValue: any;
    value: any;
    validators: FormControlValidator[] = [];
    submitAttempted = false;

    get validationClass(): string {
        if (!this.submitAttempted) {
            return '';
        }

        return this.valid ? 'is-valid' : 'is-invalid';
    }

    get valid(): boolean {
        return this.validators.every((v: FormControlValidator) =>
            v.validate(this)
        );
    }

    get errorMessages(): string[] {
        return this.validators
            .filter((v: FormControlValidator) => !v.validate(this))
            .map((v: FormControlValidator) => v.validationMessage);
    }

    constructor(value: any, validators: FormControlValidator[] = []) {
        this.initialValue = Array.isArray(value)
            ? [...value]
            : typeof value === 'object'
            ? Object.assign({}, value)
            : value;
        this.value = value;
        this.validators = validators;
    }

    reset() {
        this.value = Array.isArray(this.initialValue)
            ? [...this.initialValue]
            : typeof this.initialValue === 'object'
            ? Object.assign({}, this.initialValue)
            : this.initialValue;
        this.submitAttempted = false;
    }
}

export class FormControlValidator {
    validate: (formControl: FormControl) => boolean;
    validationMessage: string;
    constructor(
        validate: (formControl: FormControl) => boolean,
        errorMessage = ''
    ) {
        this.validate = validate;
        this.validationMessage = errorMessage || '[NAME] is invalid';
    }
}

export class RequiredValidator implements FormControlValidator {
    validate: (formControl: FormControl) => boolean = (
        formControl: FormControl
    ) => !!formControl.value;
    validationMessage = '[NAME] is required';
}
