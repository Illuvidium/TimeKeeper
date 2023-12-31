import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { Colour } from '../../../../../shared/entities';
import { DatabaseService } from '../../services/database/database.service';

@Component({
	selector: 'app-tag',
	templateUrl: './tag.component.html',
	styleUrls: ['./tag.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagComponent {
	@Input() set colour(value: number | string) {
		this.loadColour(value)
			.then(() => null)
			.catch(() => null);
	}

	@Input() text = '';
	@Input() small = false;
	@Input() deletable = false;

	protected selectedColour: Colour | undefined;

	constructor(private databaseService: DatabaseService, private cdr: ChangeDetectorRef) {}

	async loadColour(value: number | string) {
		this.selectedColour =
			typeof value === 'number' ? await this.databaseService.getColourById(value) : await this.databaseService.getColourByName(value);

		this.cdr.detectChanges();
	}
}
