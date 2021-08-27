import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    OnDestroy,
    ViewChild,
    AfterViewInit,
    NgZone,
} from '@angular/core';
import { Event, NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

function isNavigationStart(event: Event): boolean {
    return event instanceof NavigationStart;
}

function isNavigationEnd(event: Event): boolean {
    return event instanceof NavigationEnd || event instanceof NavigationError || event instanceof NavigationCancel;
}

@Component({
    selector: 'app-loading-bar',
    templateUrl: './loading-bar.component.html',
    styleUrls: ['./loading-bar.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingBarComponent implements OnDestroy, AfterViewInit {
    private destroy$: Subject<void> = new Subject();

    @ViewChild('bar') bar!: ElementRef;

    public get element(): HTMLElement {
        return this.bar.nativeElement;
    }

    constructor(
        private router: Router,
        private zone: NgZone,
    ) { }

    public ngAfterViewInit(): void {
        let timer: ReturnType<typeof setTimeout>;

        // -->Show: loading bar based on router events
        this.zone.runOutsideAngular(() => {
            this.router.events.pipe(
                takeUntil(this.destroy$),
            ).subscribe(event => {
                if (isNavigationStart(event)) {
                    clearTimeout(timer);
                    timer = setTimeout(() => {
                        // -->Remove: loading classes
                        this.element.classList.remove(
                            'loading-bar--start',
                            'loading-bar--complete',
                            'loading-bar--reset',
                        );
                        // -->Force: reflow
                        this.element.getBoundingClientRect();

                        // -->Start: loading
                        this.element.classList.add('loading-bar--start');
                    }, 50);
                }

                if (isNavigationEnd(event)) {
                    clearTimeout(timer);
                    // -->Remove: loading-bar--start class if present
                    if (this.element.classList.contains('loading-bar--start')) {
                        this.element.classList.remove('loading-bar--start');

                        // -->Done: loading
                        this.element.classList.add('loading-bar--complete');
                    }
                }
            });
        });
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
