import {
    Component,
    EventEmitter,
    Input,
    Output,
    ViewChild,
} from '@angular/core';
import {
    NgbDate,
    NgbCalendar,
    NgbDateParserFormatter,
    NgbInputDatepicker,
} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-date-range-picker',
    templateUrl: './date-range-picker.component.html',
    styleUrls: ['./date-range-picker.component.scss'],
})
export class DateRangePickerComponent {
    @ViewChild('datepicker') datepicker: NgbInputDatepicker | undefined;
    @Input() fromLabel = '';
    @Input() set from(value: Date) {
        const d = new Date(value);
        this.fromDate = new NgbDate(
            d.getFullYear(),
            d.getMonth() + 1,
            d.getDate()
        );
    }
    @Input() toLabel = '';
    @Input() set to(value: Date) {
        const d = new Date(value);
        this.toDate = new NgbDate(
            d.getFullYear(),
            d.getMonth() + 1,
            d.getDate()
        );
    }
    @Output() datesChanged: EventEmitter<DateRange> =
        new EventEmitter<DateRange>();

    hoveredDate: NgbDate | null = null;
    fromDate: NgbDate | null;
    toDate: NgbDate | null;

    constructor(
        private calendar: NgbCalendar,
        public formatter: NgbDateParserFormatter
    ) {
        this.fromDate = calendar.getToday();
        this.toDate = calendar.getNext(calendar.getToday(), 'd', 10);
    }

    onDateSelection(date: NgbDate) {
        if (!this.fromDate && !this.toDate) {
            this.fromDate = date;
        } else if (
            this.fromDate &&
            !this.toDate &&
            date &&
            date.after(this.fromDate)
        ) {
            this.toDate = date;
            this.datesChanged.emit(
                new DateRange(
                    new Date(
                        this.fromDate.year,
                        this.fromDate.month - 1,
                        this.fromDate.day
                    ),
                    new Date(
                        this.toDate.year,
                        this.toDate.month - 1,
                        this.toDate.day
                    )
                )
            );
            this.datepicker?.close();
        } else {
            this.toDate = null;
            this.fromDate = date;
        }
    }

    isHovered(date: NgbDate) {
        return (
            this.fromDate &&
            !this.toDate &&
            this.hoveredDate &&
            date.after(this.fromDate) &&
            date.before(this.hoveredDate)
        );
    }

    isInside(date: NgbDate) {
        return (
            this.toDate && date.after(this.fromDate) && date.before(this.toDate)
        );
    }

    isRange(date: NgbDate) {
        return (
            date.equals(this.fromDate) ||
            (this.toDate && date.equals(this.toDate)) ||
            this.isInside(date) ||
            this.isHovered(date)
        );
    }

    validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
        const parsed = this.formatter.parse(input);
        return parsed && this.calendar.isValid(NgbDate.from(parsed))
            ? NgbDate.from(parsed)
            : currentValue;
    }
}

export class DateRange {
    from: Date;
    to: Date;

    constructor(from: Date, to: Date) {
        this.from = from;
        this.to = to;
    }
}
