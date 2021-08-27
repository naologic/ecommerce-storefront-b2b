import { Component, Inject, Input, OnDestroy, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { fromMatchMedia } from '../../../shared/functions/rxjs/from-match-media';
import { ShopSidebarService } from '../../shop-sidebar.service';

@Component({
    selector: 'app-shop-sidebar',
    templateUrl: './shop-sidebar.component.html',
    styleUrls: ['./shop-sidebar.component.scss'],
})
export class ShopSidebarComponent implements OnDestroy {
    @Input() public offcanvas: 'always' | 'mobile' = 'always';

    private destroy$: Subject<void> = new Subject<void>();

    // public latestProducts$: Observable<Product[]> = of([]);

    constructor(
        // private shop: ShopApi,
        public sidebar: ShopSidebarService,
        @Inject(PLATFORM_ID) private platformId: any,
        @Inject(DOCUMENT) private document: Document
    ) {
        // -->Toggle: sidebar according to isOpen value
        this.sidebar.isOpen$
            .pipe(takeUntil(this.destroy$))
            .subscribe((isOpen) => {
                if (isOpen) {
                    this.open();
                } else {
                    this.close();
                }
            });

        if (isPlatformBrowser(this.platformId)) {
            // -->Track: max-width changes
            fromMatchMedia('(max-width: 991px)').pipe(takeUntil(this.destroy$)).subscribe(media => {
                if (this.offcanvas === 'mobile' && this.sidebar.isOpen && !media.matches) {
                    this.sidebar.close();
                }
            });
        }
    }

    // public ngOnInit(): void {
    //     this.latestProducts$ = this.shop.getLatestProducts(5);
    // }

    /**
     * Open: sidebar
     */
    private open(): void {
        if (isPlatformBrowser(this.platformId)) {
            const bodyWidth = this.document.body.offsetWidth;

            // -->Adjust: document styles to make space for the sidebar
            this.document.body.style.overflow = 'hidden';
            this.document.body.style.paddingRight = (this.document.body.offsetWidth - bodyWidth) + 'px';
        }
    }

    /**
     * Close: sidebar
     */
    private close(): void {
        if (isPlatformBrowser(this.platformId)) {
            // -->Reset: document styles
            this.document.body.style.overflow = '';
            this.document.body.style.paddingRight = '';
        }
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
