import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
} from '@angular/core';
import { Tag } from '../../../../../shared/entities';
import { DatabaseService } from '../../services/database/database.service';

@Component({
    selector: 'app-tag-select',
    templateUrl: './tag-select.component.html',
    styleUrls: ['./tag-select.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagSelectComponent implements OnInit {
    @Input() set selection(value: number[]) {
        this.selectedIDs = value || [];
    }
    @Output() selectionChange: EventEmitter<number[]> = new EventEmitter<
        number[]
    >();

    tags: Tag[] = [];
    selectedIDs: number[] = [];

    get availableTags(): Tag[] {
        return this.tags
            .filter((t) => !this.selectedIDs.includes(t.id))
            .orderBy((t) => t.name);
    }

    get selectedTags(): Tag[] {
        return this.tags
            .filter((t) => this.selectedIDs.includes(t.id))
            .orderBy((t) => t.name);
    }

    constructor(
        private databaseService: DatabaseService,
        private cdr: ChangeDetectorRef
    ) {}

    async ngOnInit(): Promise<void> {
        this.tags = await this.databaseService.getTagsByFilter(
            (t) => t.active || this.selectedIDs.includes(t.id)
        );
        this.cdr.detectChanges();
    }

    deselect(tag: Tag) {
        this.selectedIDs = this.selectedIDs.filter((id) => id !== tag.id);
        this.selectionChange.emit(this.selectedIDs);
    }

    select(tag: Tag) {
        this.selectedIDs.push(tag.id);
        this.selectionChange.emit(this.selectedIDs);
    }
}
