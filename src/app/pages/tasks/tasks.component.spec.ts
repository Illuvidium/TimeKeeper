import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TasksComponent } from './tasks.component';
import { TranslateModule } from '@ngx-translate/core';

import { RouterTestingModule } from '@angular/router/testing';

describe('DetailComponent', () => {
    let component: TasksComponent;
    let fixture: ComponentFixture<TasksComponent>;

    beforeEach(waitForAsync(() => {
        void TestBed.configureTestingModule({
            declarations: [TasksComponent],
            imports: [TranslateModule.forRoot(), RouterTestingModule],
        }).compileComponents();

        fixture = TestBed.createComponent(TasksComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should render title in a h1 tag', waitForAsync(() => {
        const compiled = fixture.debugElement.nativeElement;
        expect(compiled.querySelector('h1').textContent).toContain(
            'PAGES.DETAIL.TITLE'
        );
    }));
});
