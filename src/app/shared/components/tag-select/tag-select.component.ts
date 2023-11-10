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
import { TagService } from '../../services/tag.service';

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
        private tagService: TagService,
        private cdr: ChangeDetectorRef
    ) {}

    async ngOnInit(): Promise<void> {
        this.tags = await this.tagService.getActiveTags();

        const remainingIds = this.selectedIDs.filter(
            (id) => !this.tags.some((t) => t.id === id)
        );

        if (remainingIds.length > 0) {
            this.tags = this.tags.concat(
                await this.tagService.getTagByIds(remainingIds)
            );
        }

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
