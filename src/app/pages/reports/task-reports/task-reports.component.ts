import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { TaskReport } from '../../../shared/classes/reports';
import { DropdownItem } from '../../../shared/components/dropdown/dropdown.component';
import { DatabaseService } from '../../../shared/services/database/database.service';
import { SettingKey } from '../../../../../shared/entities';

@Component({
	selector: 'app-task-reports',
	templateUrl: './task-reports.component.html',
	styleUrl: './task-reports.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskReportsComponent implements OnInit {
	@Input() totalMs = 0;
	@Input() set reports(value: TaskReport[]) {
		this.taskReports = value;
		this.sortReports();
	}

	protected taskReports: TaskReport[] = [];
	protected sortOrder: string = 'TimeSpent';

	get sortOrderOptions(): DropdownItem[] {
		return Object.keys(SortOrder).map(key => new DropdownItem(key, SortOrder[key as keyof typeof SortOrder]));
	}

	constructor(private databaseService: DatabaseService, private cdr: ChangeDetectorRef) {}

	async ngOnInit(): Promise<void> {
		this.sortOrder = (await this.databaseService.getSetting(SettingKey.ReportTasks_SortOrder)) ?? 'TimeSpent';
		this.sortReports();
		this.cdr.detectChanges();
	}

	async sortOrderChanged(sortOrder: SortOrder) {
		this.sortOrder = sortOrder;
		this.sortReports();
		await this.databaseService.updateSetting(SettingKey.ReportTasks_SortOrder, sortOrder);
	}

	private sortReports() {
		switch (SortOrder[this.sortOrder as keyof typeof SortOrder]) {
			case SortOrder.AZ:
				this.taskReports = this.taskReports.orderBy(t => t.task.name);
				break;
			case SortOrder.Tags:
				this.taskReports = this.taskReports.orderBy(t =>
					t.tags
						.filter(tag => t.task.tags.includes(tag.id))
						.map(tag => tag.name)
						.join(',')
				);
				break;
			case SortOrder.OldNew:
				this.taskReports = this.taskReports.orderBy(t => t.task.id);
				break;
			case SortOrder.NewOld:
				this.taskReports = this.taskReports.orderBy(t => t.task.id, false);
				break;
			case SortOrder.TimeSpent:
				this.taskReports = this.taskReports.orderBy(t => t.totalMilliseconds, false);
				break;
		}
	}
}

enum SortOrder {
	AZ = 'A 🠆 Z',
	Tags = 'Tags',
	OldNew = 'Old 🠆 new',
	NewOld = 'New 🠆 old',
	TimeSpent = 'Time spent',
}
