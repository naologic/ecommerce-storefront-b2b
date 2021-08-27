import { Directive, ElementRef, Inject, NgZone, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { fromOutsideClick } from '../../shared/functions/rxjs/from-outside-click';

@Directive({
    selector: '[appDropdown]',
    exportAs: 'appDropdown',
})
export class DropdownDirective implements OnInit, OnDestroy {
    private destroy$: Subject<void> = new Subject<void>();

    public isOpen = false;

    constructor(
        @Inject(PLATFORM_ID) private platformId: any,
        private zone: NgZone,
        private elementRef: ElementRef<HTMLElement>,
    ) { }

    public ngOnInit(): void {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }

        // -->Track: clicks in order to toggle dropdowns
        this.zone.runOutsideAngular(() => {
            fromOutsideClick(this.elementRef.nativeElement).pipe(
                filter(() => this.isOpen),
                takeUntil(this.destroy$),
            ).subscribe(() => {
                this.zone.run(() => this.close());
            });
        });
    }

    /**
     * Open: dropdown
     */
    public open(): void {
        this.toggle(true);
    }

    /**
     * Close: dropdown
     */
    public close(): void {
        this.toggle(false);
    }

    /**
     * Toggle: dropdown
     */
    public toggle(forceValue: boolean|null = null): void {
        if (forceValue !== null) {
            this.isOpen = forceValue;
        } else {
            this.isOpen = !this.isOpen;
        }
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
