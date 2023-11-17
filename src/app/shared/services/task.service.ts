import { Injectable } from '@angular/core';
import { Task } from '../../../../shared/entities';
import { Subject, Observable } from 'rxjs';
import { DatabaseService } from './database/database.service';

@Injectable({
	providedIn: 'root',
})
export class TaskService {
	private taskSavedSource: Subject<TaskEvent> = new Subject();
	taskSaved: Observable<TaskEvent> = this.taskSavedSource.asObservable();

	constructor(private databaseService: DatabaseService) {}

	async addTask(task: Task): Promise<Task> {
		task = await this.databaseService.addTask(task);
		this.taskSavedSource.next(new TaskEvent(task, TaskEventType.Added));
		return task;
	}

	async updateTask(task: Task): Promise<Task> {
		task = await this.databaseService.updateTask(task);
		this.taskSavedSource.next(new TaskEvent(task, TaskEventType.Updated));
		return task;
	}

	async getAllTasks(): Promise<Task[]> {
		return await this.databaseService.getAllTasks();
	}

	async getActiveTasks(): Promise<Task[]> {
		return await this.databaseService.getActiveTasks();
	}

	async getTaskById(id: number): Promise<Task | undefined> {
		return await this.databaseService.getTask(id);
	}

	async getTaskByIds(ids: number[]): Promise<Task[]> {
		return await this.databaseService.getTasksByIds(ids);
	}
}

export class TaskEvent {
	task: Task;
	type: TaskEventType;

	constructor(task: Task, type: TaskEventType) {
		this.task = task;
		this.type = type;
	}
}

export enum TaskEventType {
	Added,
	Updated,
}
