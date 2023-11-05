import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
} from '@angular/core';
import {
    FormGroup,
    FormControl,
    RequiredValidator,
} from '../../../shared/classes/forms';
import { Tag } from '../../../../../shared/entities';
import { DatabaseService } from '../../../shared/services/database/database.service';

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
        Text: new FormControl('', [new RequiredValidator()]),
        Colour: new FormControl(1, [new RequiredValidator()]),
    });

    constructor(
        private databaseService: DatabaseService,
        private cdr: ChangeDetectorRef
    ) {}

    async ngOnInit(): Promise<void> {
        if (this.id === 0) return;

        this.tag = await this.databaseService.getTag(this.id);
        this.tagForm = new FormGroup({
            Text: new FormControl(this.tag?.name, [new RequiredValidator()]),
            Colour: new FormControl(this.tag?.colour, [
                new RequiredValidator(),
            ]),
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
            name: this.tagForm.controls.Text.value,
            colour: this.tagForm.controls.Colour.value,
            active: true,
        };

        this.tagSaved.emit(await this.databaseService.addTag(tag));
        setTimeout(() => {
            this.tagForm.reset();
            this.cdr.detectChanges();
        }, 0);
    }

    async updateTag() {
        if (this.tag === undefined) return;

        this.tag.name = this.tagForm.controls.Text.value;
        this.tag.colour = this.tagForm.controls.Colour.value;

        this.tagSaved.emit(await this.databaseService.updateTag(this.tag));
        setTimeout(() => {
            this.tagForm.reset();
            this.cdr.detectChanges();
        }, 0);
    }
}
