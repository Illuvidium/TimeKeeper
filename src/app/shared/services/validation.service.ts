import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class ValidationService {
	private validationTriggeredSource: Subject<void> = new Subject();
	validationTriggered: Observable<void> = this.validationTriggeredSource.asObservable();

	constructor() {}

	triggerValidation(): void {
		this.validationTriggeredSource.next();
	}
}
