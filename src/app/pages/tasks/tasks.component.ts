import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
    selector: 'app-tasks',
    templateUrl: './tasks.component.html',
    styleUrls: ['./tasks.component.scss'],
})
export class TasksComponent implements OnInit, OnDestroy {
    constructor() {}

    ngOnInit(): void {
        console.log('TasksComponent INIT');
    }

    ngOnDestroy(): void {
        console.log('The component is being destroyed');
    }
}
