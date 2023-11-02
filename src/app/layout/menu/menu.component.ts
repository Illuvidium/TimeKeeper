import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
} from '@angular/core';
import { Router, ActivatedRoute, Event, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { SubscriptionLike } from 'rxjs';

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuComponent implements OnInit, OnDestroy {
    private routeChanged: SubscriptionLike | undefined;
    protected activeRoute: string | undefined = undefined;

    protected menuItems: MenuItem[] = [
        new MenuItem('fa-solid fa-clock', 'Clocking', '/clocking'),
        new MenuItem('fa-solid fa-clipboard-list', 'Tasks', '/tasks'),
        new MenuItem('fa-solid fa-tag', 'Tags', '/tags'),
        new MenuItem('fa-solid fa-chart-line', 'Reports', '/reports', true),
    ];

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private cdr: ChangeDetectorRef
    ) {}

    ngOnDestroy(): void {
        this.routeChanged?.unsubscribe();
    }

    ngOnInit(): void {
        this.routeChanged = this.router.events
            .pipe(filter((event: Event) => event instanceof NavigationEnd))
            .subscribe((event: Event) => {
                if (event instanceof NavigationEnd) {
                    this.activeRoute = event.urlAfterRedirects;
                    this.cdr.detectChanges();
                }
            });
    }

    async navigateTo(menuItem: MenuItem): Promise<void> {
        await this.router.navigate([menuItem.url]);
    }
}

class MenuItem {
    icon: string;
    text: string;
    url: string;
    isLast: boolean;

    constructor(icon: string, text: string, url: string, isLast = false) {
        this.icon = icon;
        this.text = text;
        this.url = url;
        this.isLast = isLast;
    }
}
