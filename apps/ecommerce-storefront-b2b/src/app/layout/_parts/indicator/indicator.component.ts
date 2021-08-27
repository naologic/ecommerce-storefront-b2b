import {
    Component,
    ElementRef,
    Inject,
    Input, NgZone,
    OnChanges,
    OnDestroy,
    OnInit,
    PLATFORM_ID,
    SimpleChanges,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { fromOutsideClick } from '../../../shared/functions/rxjs/from-outside-click';

export type IndicatorTrigger = 'click' | 'hover';

@Component({
    selector: 'app-indicator',
    templateUrl: './indicator.component.html',
    styleUrls: ['./indicator.component.scss'],
    exportAs: 'indicator',
})
export class IndicatorComponent implements OnChanges, OnInit, OnDestroy {
    @Input() public link!: string;
    @Input() public icon!: string;
    @Input() public label: string = '';
    @Input() public value: string = '';
    @Input() public counter?: string|number;
    @Input() public trigger: IndicatorTrigger = 'hover';

    private destroy$: Subject<void> = new Subject<void>();

    public href: string = '';
    public classIndicatorOpen: boolean = false;

    constructor(
        @Inject(PLATFORM_ID) private platformId: any,
        private zone: NgZone,
        private router: Router,
        private route: ActivatedRoute,
        private elementRef: ElementRef<HTMLElement>,
    ) { }

    public ngOnInit(): void {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }

        // -->Track: clicks in order to toggle the indicators section
        this.zone.runOutsideAngular(() => {
            fromOutsideClick(this.elementRef.nativeElement).pipe(
                filter(() => this.classIndicatorOpen),
                takeUntil(this.destroy$),
            ).subscribe(() => {
                this.zone.run(() => this.classIndicatorOpen = false);
            });
        });
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if ('link' in changes) {
            this.href = this.router.createUrlTree([this.link], { relativeTo: this.route }).toString();
        }
    }

    /**
     * Toggle: indicators section
     */
    public onClick(event: MouseEvent): void {
        if (!event.cancelable) {
            return;
        }

        // -->Prevent: default action
        event.preventDefault();

        // -->Check: trigger type
        if (this.trigger !== 'click') {
            // -->Redirect
            this.router.navigate([this.link], { relativeTo: this.route });
        }

        // -->Add: or remove indicator--open class
        this.classIndicatorOpen = !this.classIndicatorOpen;
    }

    /**
     * Close: indicators section
     */
    public close(): void {
        this.classIndicatorOpen = false;
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
