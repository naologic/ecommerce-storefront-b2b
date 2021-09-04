import { Component, ElementRef, Inject, Input, NgZone, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { fromOutsideClick } from '../../../shared/functions/rxjs/from-outside-click';
import { DepartmentsLink } from '../../../interfaces/departments-link';
import { Router } from "@angular/router";

@Component({
    selector: 'app-departments',
    templateUrl: './departments.component.html',
    styleUrls: ['./departments.component.scss'],
})
export class DepartmentsComponent implements OnInit, OnDestroy {
    @Input() public items: DepartmentsLink[] = [];
    @Input() public label: string = '';

    private destroy$: Subject<void> = new Subject<void>();

    public isOpen = false;
    public currentItem: DepartmentsLink|null = null;

    constructor(
        @Inject(PLATFORM_ID) private platformId: any,
        private elementRef: ElementRef<HTMLElement>,
        private zone: NgZone,
        private router: Router
    ) { }

    public ngOnInit(): void {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }

        // -->Track: clicks in order to toggle the departments section
        this.zone.runOutsideAngular(() => {
            fromOutsideClick(this.elementRef.nativeElement).pipe(
                filter(() => this.isOpen),
                takeUntil(this.destroy$),
            ).subscribe(() => {
                this.zone.run(() => this.isOpen = false);
            });
        });
    }

    /**
     * Toggle: departments section
     */
    public onClick() {
        this.isOpen = !this.isOpen;
    }

    /**
     * Set: current item
     */
    public onMouseenter(item: DepartmentsLink) {
        this.currentItem = item;
    }

    /**
     * Clears: current item
     */
    public onMouseleave(): void {
        this.currentItem = null;
    }

    /**
     * Close: departments section
     */
    public onItemClick(): void {
        this.isOpen = false;
        this.currentItem = null;
    }

    /**
     * Redirect: and add reset filter state
     */
    public navigateAndResetFilters(url: string): void {
        if (!url) {
            return;
        }
        // -->Redirect: to the selected category
        this.router.navigateByUrl(url, { state: { resetFilters: true } }).then();
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
