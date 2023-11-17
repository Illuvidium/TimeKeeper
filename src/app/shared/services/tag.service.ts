import { Injectable } from '@angular/core';
import { Tag } from '../../../../shared/entities';
import { Subject, Observable } from 'rxjs';
import { DatabaseService } from './database/database.service';

@Injectable({
	providedIn: 'root',
})
export class TagService {
	private tagSavedSource: Subject<TagEvent> = new Subject();
	tagSaved: Observable<TagEvent> = this.tagSavedSource.asObservable();

	constructor(private databaseService: DatabaseService) {}

	async addTag(tag: Tag): Promise<Tag> {
		tag = await this.databaseService.addTag(tag);
		this.tagSavedSource.next(new TagEvent(tag, TagEventType.Added));
		return tag;
	}

	async updateTag(tag: Tag): Promise<Tag> {
		tag = await this.databaseService.updateTag(tag);
		this.tagSavedSource.next(new TagEvent(tag, TagEventType.Updated));
		return tag;
	}

	async getAllTags(): Promise<Tag[]> {
		return await this.databaseService.getAllTags();
	}

	async getActiveTags(): Promise<Tag[]> {
		return await this.databaseService.getActiveTags();
	}

	async getTagById(id: number): Promise<Tag | undefined> {
		return await this.databaseService.getTag(id);
	}

	async getTagByIds(ids: number[]): Promise<Tag[]> {
		return await this.databaseService.getTagsByIds(ids);
	}
}

export class TagEvent {
	tag: Tag;
	type: TagEventType;

	constructor(tag: Tag, type: TagEventType) {
		this.tag = tag;
		this.type = type;
	}
}

export enum TagEventType {
	Added,
	Updated,
}
