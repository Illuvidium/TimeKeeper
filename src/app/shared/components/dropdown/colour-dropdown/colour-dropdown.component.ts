import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
} from '@angular/core';
import { Colour } from '../../../../../../shared/entities';
import { DatabaseService } from '../../../services/database/database.service';
import { DropdownItem } from '../dropdown.component';

@Component({
    selector: 'app-colour-dropdown',
    templateUrl: './colour-dropdown.component.html',
    styleUrls: ['./colour-dropdown.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColourDropdownComponent implements OnInit {
    @Input() set value(value: number) {
        this.selectedValue = value;
    }

    @Output() valueChange: EventEmitter<number> = new EventEmitter<number>();

    protected colours: Colour[] = [];
    protected items: DropdownItem[] = [];
    protected selectedValue = 1;

    constructor(
        private databaseService: DatabaseService,
        private cdr: ChangeDetectorRef
    ) {}

    async ngOnInit(): Promise<void> {
        this.colours = await this.databaseService.getColoursByFilter();
        this.items = this.colours.map((colour) => ({
            value: colour.id,
            text: colour.name,
            foreground: colour.foreground,
            background: colour.background,
            tags: [],
        }));

        this.cdr.detectChanges();
    }

    select(value: number) {
        this.value = value;
        this.valueChange.emit(value);
    }
}
