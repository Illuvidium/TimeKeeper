import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SettingKey, Tag } from '../../../../shared/entities';
import { DropdownItem } from '../../shared/components/dropdown/dropdown.component';
import { TagService } from '../../shared/services/tag.service';
import { DatabaseService } from '../../shared/services/database/database.service';

@Component({
	selector: 'app-tags',
	templateUrl: './tags.component.html',
	styleUrls: ['./tags.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagsComponent implements OnInit {
	tags: Tag[] = [];

	protected showInactiveTags = false;
	protected editTags: number[] = [];
	protected hideTags: number[] = [];
	protected sortOrder: SortOrder = SortOrder.AZ;

	get sortOrderOptions(): DropdownItem[] {
		return Object.keys(SortOrder).map(key => new DropdownItem(key, SortOrder[key as keyof typeof SortOrder]));
	}

	get visibleTags() {
		return this.tags.filter(t => t.active || this.showInactiveTags);
	}

	constructor(private databaseService: DatabaseService, private tagService: TagService, private cdr: ChangeDetectorRef) {}

	async ngOnInit(): Promise<void> {
		this.tags = await this.tagService.getAllTags();
		this.showInactiveTags = (await this.databaseService.getSetting(SettingKey.Tags_ShowInactive)) ?? false;
		this.sortOrder = (await this.databaseService.getSetting(SettingKey.Tags_SortOrder)) ?? SortOrder.AZ;
		this.sortTags();
		this.cdr.detectChanges();
	}

	addTag(tag: Tag) {
		this.tags.push(tag);
		this.sortTags();
	}

	updateTag(tag: Tag) {
		const currentTag = this.tags.find(t => t.id === tag.id);
		if (currentTag) {
			currentTag.name = tag.name;
			currentTag.colour = tag.colour;
		}
		this.editTags = this.editTags.filter(t => t !== tag.id);
	}

	toggleEdit(tag: Tag) {
		if (this.editTags.includes(tag.id)) {
			this.editTags = this.editTags.filter(t => t !== tag.id);
		} else {
			this.editTags.push(tag.id);
		}
	}

	async toggleShowInactiveTags() {
		this.showInactiveTags = !this.showInactiveTags;
		await this.databaseService.updateSetting(SettingKey.Tags_ShowInactive, this.showInactiveTags);
	}

	async toggleStatus(tag: Tag) {
		if (this.showInactiveTags) {
			await this.doToggleStatus(tag);
			return;
		}

		setTimeout(() => {
			this.hideTags.push(tag.id);
			this.cdr.detectChanges();

			setTimeout(() => {
				this.hideTags = this.hideTags.filter(t => t !== tag.id);
				void this.doToggleStatus(tag);
				this.cdr.detectChanges();
			}, 200);
		}, 250);
	}

	async sortOrderChanged(sortOrder: SortOrder) {
		this.sortOrder = sortOrder;
		this.sortTags();
		await this.databaseService.updateSetting(SettingKey.Tags_SortOrder, sortOrder);
	}

	private sortTags() {
		switch (SortOrder[this.sortOrder as keyof typeof SortOrder]) {
			case SortOrder.AZ:
				this.tags = this.tags.orderBy(t => t.name);
				break;
			case SortOrder.Colour:
				this.tags = this.tags.orderBy(t => t.colour);
				break;
			case SortOrder.OldNew:
				this.tags = this.tags.orderBy(t => t.id);
				break;
			case SortOrder.NewOld:
				this.tags = this.tags.orderBy(t => t.id, false);
				break;
			case SortOrder.MostUsed:
				this.tags = this.tags.orderBy(t => t.activeLinks ?? 0, false);
		}
	}

	private async doToggleStatus(tag: Tag) {
		tag.active = !tag.active;
		tag = await this.tagService.updateTag(tag);
	}
}

enum SortOrder {
	AZ = 'A 🠆 Z',
	Colour = 'Colour',
	OldNew = 'Old 🠆 new',
	NewOld = 'New 🠆 old',
	MostUsed = 'Most used',
}
