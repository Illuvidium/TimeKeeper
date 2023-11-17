import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, RequiredValidator } from '../../../shared/classes/forms';
import { Tag } from '../../../../../shared/entities';
import { TagService } from '../../../shared/services/tag.service';

@Component({
	selector: 'app-edit-tag',
	templateUrl: './edit-tag.component.html',
	styleUrls: ['./edit-tag.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditTagComponent implements OnInit {
	@Input() id = 0;
	@Output() tagSaved: EventEmitter<Tag> = new EventEmitter<Tag>();

	protected tag: Tag | undefined = undefined;

	protected tagForm = new FormGroup({
		text: new FormControl('', 'Text', [new RequiredValidator()]),
		colour: new FormControl(1, 'Colour', [new RequiredValidator()]),
	});

	constructor(private tagService: TagService, private cdr: ChangeDetectorRef) {}

	async ngOnInit(): Promise<void> {
		if (this.id === 0) return;

		this.tag = await this.tagService.getTagById(this.id);
		this.tagForm = new FormGroup({
			text: new FormControl(this.tag?.name, 'Text', [new RequiredValidator()]),
			colour: new FormControl(this.tag?.colour, 'Colour', [new RequiredValidator()]),
		});

		this.cdr.detectChanges();
	}

	async saveTag() {
		this.tagForm.registerSubmitAttempt();
		if (!this.tagForm.valid) return;

		this.id === 0 ? await this.addTag() : await this.updateTag();
	}

	async addTag() {
		const tag: Tag = {
			id: 0,
			name: this.tagForm.controls.text.value,
			colour: this.tagForm.controls.colour.value,
			active: true,
		};

		this.tagSaved.emit(await this.tagService.addTag(tag));
		setTimeout(() => {
			this.tagForm.reset();
			this.cdr.detectChanges();
		}, 0);
	}

	async updateTag() {
		if (this.tag === undefined) return;

		this.tag.name = this.tagForm.controls.text.value;
		this.tag.colour = this.tagForm.controls.colour.value;

		this.tagSaved.emit(await this.tagService.updateTag(this.tag));
		setTimeout(() => {
			this.tagForm.reset();
			this.cdr.detectChanges();
		}, 0);
	}
}
