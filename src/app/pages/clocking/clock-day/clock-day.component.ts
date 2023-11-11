import { Component, Input } from '@angular/core';
import { ClockTimeDateGroup } from '../../../shared/classes/clock-time-date-group';
import { Tag, Task } from '../../../../../shared/entities';

@Component({
    selector: 'app-clock-day',
    templateUrl: './clock-day.component.html',
    styleUrls: ['./clock-day.component.scss'],
})
export class ClockDayComponent {
    @Input() clockTimeDateGroup: ClockTimeDateGroup | undefined;
    @Input() tags: Tag[] = [];
    @Input() tasks: Task[] = [];
}
