import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ClockTimeDateGroup } from '../clocking.component';
import { ClockTime } from '../../../../../shared/entities';

@Component({
    selector: 'app-clock-day',
    templateUrl: './clock-day.component.html',
    styleUrls: ['./clock-day.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClockDayComponent {
    @Input() clockTimeDateGroup: ClockTimeDateGroup | undefined;

    getTimeElapsed(clockTime: ClockTime): number {
        const finish = clockTime.finish
            ? new Date(clockTime.finish)
            : new Date();
        const start = new Date(clockTime.start);
        return finish.getTime() - start.getTime();
    }
}
