import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnInit,
} from '@angular/core';
import { DropdownItem } from '../../shared/components/dropdown/dropdown.component';
import { DatabaseService } from '../../shared/services/database/database.service';
import { SettingKey, Tag, Task } from '../../../../shared/entities';
import { TagService } from '../../shared/services/tag.service';

@Component({
    selector: 'app-tasks',
    templateUrl: './tasks.component.html',
    styleUrls: ['./tasks.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TasksComponent implements OnInit {
    tasks: Task[] = [];
    tags: Tag[] = [];

    protected sortOrder: SortOrder = SortOrder.AZ;
    protected showInactiveTasks = false;
    protected editTasks: number[] = [];
    protected hideTasks: number[] = [];

    get sortOrderOptions(): DropdownItem[] {
        return Object.keys(SortOrder).map(
            (key) =>
                new DropdownItem(key, SortOrder[key as keyof typeof SortOrder])
        );
    }

    get visibleTasks() {
        return this.tasks.filter((t) => t.active || this.showInactiveTasks);
    }

    constructor(
        private databaseService: DatabaseService,
        private tagService: TagService,
        private cdr: ChangeDetectorRef
    ) {}

    async ngOnInit(): Promise<void> {
        this.tasks = await this.databaseService.getTasksByFilter(() => true);
        this.tags = await this.tagService.getAllTags();

        this.showInactiveTasks =
            (await this.databaseService.getSetting(
                SettingKey.Tasks_ShowInvactive
            )) ?? false;
        this.sortOrder =
            (await this.databaseService.getSetting(
                SettingKey.Tasks_SortOrder
            )) ?? SortOrder.AZ;

        this.sortTasks();
        this.cdr.detectChanges();
    }

    addTask(task: Task) {
        this.tasks.push(task);
        this.sortTasks();
    }

    updateTask(task: Task) {
        const currentTag = this.tasks.find((t) => t.id === task.id);
        if (currentTag) {
            currentTag.name = task.name;
            currentTag.tags = task.tags;
        }
        this.editTasks = this.editTasks.filter((t) => t !== task.id);
        this.sortTasks();
    }

    toggleEdit(task: Task) {
        if (this.editTasks.includes(task.id)) {
            this.editTasks = this.editTasks.filter((t) => t !== task.id);
        } else {
            this.editTasks.push(task.id);
        }
    }

    getTagsForTask(task: Task) {
        return this.tags
            .filter((t) => task.tags.includes(t.id))
            .orderBy((t) => t.name);
    }

    async toggleShowInactiveTasks() {
        this.showInactiveTasks = !this.showInactiveTasks;
        await this.databaseService.updateSetting(
            SettingKey.Tasks_ShowInvactive,
            this.showInactiveTasks
        );
    }

    async toggleStatus(task: Task) {
        if (this.showInactiveTasks) {
            await this.doToggleStatus(task);
            return;
        }

        setTimeout(() => {
            this.hideTasks.push(task.id);
            this.cdr.detectChanges();

            setTimeout(() => {
                this.hideTasks = this.hideTasks.filter((t) => t !== task.id);
                void this.doToggleStatus(task);
                this.cdr.detectChanges();
            }, 200);
        }, 250);
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
                this.tasks = this.tasks.orderBy((t) =>
                    this.tags
                        .filter((tag) => t.tags.includes(tag.id))
                        .map((tag) => tag.name)
                        .join(',')
                );
                break;
            case SortOrder.OldNew:
                this.tasks = this.tasks.orderBy((t) => t.id);
                break;
            case SortOrder.NewOld:
                this.tasks = this.tasks.orderBy((t) => t.id, false);
                break;
        }
    }

    private async doToggleStatus(task: Task) {
        task.active = !task.active;
        task = await this.databaseService.updateTask(task);
    }
}

enum SortOrder {
    AZ = 'A -> Z',
    ZA = 'Z -> A',
    Tags = 'Tags',
    OldNew = 'Old -> new',
    NewOld = 'New -> old',
}
