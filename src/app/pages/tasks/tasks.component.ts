import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
} from '@angular/core';
import { DropdownItem } from '../../shared/components/dropdown/dropdown.component';
import { DatabaseService } from '../../shared/services/database/database.service';
import { SettingKey, Task } from '../../shared/interfaces/entities';

@Component({
    selector: 'app-tasks',
    templateUrl: './tasks.component.html',
    styleUrls: ['./tasks.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TasksComponent implements OnInit, OnDestroy {
    tasks: Task[] = [];

    protected sortOrder: SortOrder = SortOrder.AZ;
    protected showInactiveTasks = false;

    get sortOrderOptions(): DropdownItem[] {
        return Object.keys(SortOrder).map(
            (key) =>
                new DropdownItem(key, SortOrder[key as keyof typeof SortOrder])
        );
    }

    constructor(
        private databaseService: DatabaseService,
        private cdr: ChangeDetectorRef
    ) {}

    async ngOnInit(): Promise<void> {
        this.tasks = await this.databaseService.getTasksByFilter(() => true);
        this.showInactiveTasks =
            (await this.databaseService.getSetting(
                SettingKey.Tags_ShowInvactive
            )) ?? false;
        this.sortOrder =
            (await this.databaseService.getSetting(
                SettingKey.Tags_SortOrder
            )) ?? SortOrder.AZ;
        this.sortTasks();
        this.cdr.detectChanges();
    }

    ngOnDestroy(): void {
        console.log('The component is being destroyed');
    }

    async toggleShowInactiveTasks() {
        this.showInactiveTasks = !this.showInactiveTasks;
        await this.databaseService.updateSetting(
            SettingKey.Tasks_ShowInvactive,
            this.showInactiveTasks
        );
    }

    async sortOrderChanged(sortOrder: SortOrder) {
        this.sortOrder = sortOrder;
        this.sortTasks();
        await this.databaseService.updateSetting(
            SettingKey.Tasks_SortOrder,
            sortOrder
        );
    }

    private sortTasks() {
        switch (SortOrder[this.sortOrder as keyof typeof SortOrder]) {
            case SortOrder.AZ:
                this.tasks = this.tasks.orderBy((t) => t.name);
                break;
            case SortOrder.ZA:
                this.tasks = this.tasks.orderBy((t) => t.name, false);
                break;
            case SortOrder.Tags:
                this.tasks = this.tasks.orderBy((t) => t.tags.join(','));
                break;
            case SortOrder.OldNew:
                this.tasks = this.tasks.orderBy((t) => t.id);
                break;
            case SortOrder.NewOld:
                this.tasks = this.tasks.orderBy((t) => t.id, false);
                break;
        }
    }
}

enum SortOrder {
    AZ = 'A -> Z',
    ZA = 'Z -> A',
    Tags = 'Tags',
    OldNew = 'Old -> new',
    NewOld = 'New -> old',
}
