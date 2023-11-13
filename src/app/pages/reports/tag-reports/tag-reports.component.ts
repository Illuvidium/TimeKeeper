import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { TagReport } from '../../../shared/classes/reports';
import { DropdownItem } from '../../../shared/components/dropdown/dropdown.component';
import { DatabaseService } from '../../../shared/services/database/database.service';
import { SettingKey } from '../../../../../shared/entities';

@Component({
	selector: 'app-tag-reports',
	templateUrl: './tag-reports.component.html',
	styleUrl: './tag-reports.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagReportsComponent implements OnInit {
	@Input() totalMs = 0;
	@Input() set reports(value: TagReport[]) {
		this.tagReports = value;
		this.sortReports();
	}

	protected tagReports: TagReport[] = [];
	protected sortOrder: string = 'TimeSpent';

	get sortOrderOptions(): DropdownItem[] {
		return Object.keys(SortOrder).map(key => new DropdownItem(key, SortOrder[key as keyof typeof SortOrder]));
	}

	constructor(private databaseService: DatabaseService, private cdr: ChangeDetectorRef) {}

	async ngOnInit(): Promise<void> {
		this.sortOrder = (await this.databaseService.getSetting(SettingKey.ReportTags_SortOrder)) ?? 'TimeSpent';
		this.sortReports();
		this.cdr.detectChanges();
	}

	async sortOrderChanged(sortOrder: SortOrder) {
		this.sortOrder = sortOrder;
		this.sortReports();
		await this.databaseService.updateSetting(SettingKey.ReportTags_SortOrder, sortOrder);
	}

	private sortReports() {
		switch (SortOrder[this.sortOrder as keyof typeof SortOrder]) {
			case SortOrder.AZ:
				this.tagReports = this.tagReports.orderBy(t => t.tag.name);
				break;
			case SortOrder.Colour:
				this.tagReports = this.tagReports.orderBy(t => t.tag.colour);
				break;
			case SortOrder.OldNew:
				this.tagReports = this.tagReports.orderBy(t => t.tag.id);
				break;
			case SortOrder.NewOld:
				this.tagReports = this.tagReports.orderBy(t => t.tag.id, false);
				break;
			case SortOrder.TimeSpent:
				this.tagReports = this.tagReports.orderBy(t => t.totalMilliseconds, false);
				break;
		}
	}
}

enum SortOrder {
	AZ = 'A 🠆 Z',
	Colour = 'Colour',
	OldNew = 'Old 🠆 new',
	NewOld = 'New 🠆 old',
	TimeSpent = 'Time spent',
}
