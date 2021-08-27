import {
    AfterViewChecked,
    AfterViewInit,
    Component,
    ElementRef,
    Inject,
    Input,
    NgZone,
    OnChanges,
    OnDestroy,
    PLATFORM_ID,
    SimpleChanges,
    ViewChild,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { fromMatchMedia } from '../../../shared/functions/rxjs/from-match-media';
import { BreadcrumbItem } from '../breadcrumb/breadcrumb.component';

@Component({
    selector: 'app-block-header',
    templateUrl: './block-header.component.html',
    styleUrls: ['./block-header.component.scss'],
})
export class BlockHeaderComponent implements OnChanges, OnDestroy, AfterViewInit, AfterViewChecked {
    @Input() public pageTitle: string = '';
    @Input() public breadcrumb: BreadcrumbItem[] = [];
    @Input() public afterHeader = true;

    private destroy$: Subject<void> = new Subject<void>();
    private reCalcTitleWidth = false;

    @ViewChild('titleElement') private titleElementRef!: ElementRef;

    private get titleElement(): HTMLElement {
        return this.titleElementRef?.nativeElement;
    }

    private get element(): HTMLElement {
        return this.elementRef.nativeElement;
    }

    constructor(
        @Inject(PLATFORM_ID) private platformId: any,
        private zone: NgZone,
        private elementRef: ElementRef,
    ) { }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.pageTitle && !changes.pageTitle.isFirstChange()) {
            this.reCalcTitleWidth = true;
        }
    }

    public ngAfterViewInit(): void {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }

        // -->Recompute: title width if min-width changes
        this.zone.runOutsideAngular(() => {
            // -->Track: document min-width changes
            fromMatchMedia('(min-width: 1200px)', false).pipe(
                filter(x => x.matches),
                takeUntil(this.destroy$),
            ).subscribe(() => this.calcTitleWidth());
        });
    }

    public ngAfterViewChecked(): void {
        if (this.reCalcTitleWidth) {
            this.reCalcTitleWidth = false;
            this.calcTitleWidth();
        }
    }

    /**
     * Compute: title width
     */
    private calcTitleWidth(): void {
        // So that breadcrumbs correctly flow around the page title, we need to know its width.
        // This code simply conveys the width of the page title in CSS.

        // -->Check: element and titleElement
        if (!this.element || !this.titleElement) {
            return;
        }

        // -->Get: title element width
        const width = this.titleElement.getBoundingClientRect().width;
        // -->Set: width value to style property
        this.element.style.setProperty('--block-header-title-width', `${width}px`);
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
