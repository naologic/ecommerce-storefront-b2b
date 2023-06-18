import { Component, Inject, OnDestroy, PLATFORM_ID } from "@angular/core";
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Subscription } from "rxjs";
import { fromMatchMedia } from '../../../shared/functions/rxjs/from-match-media';
import { Filter } from "../../../interfaces/filter";
import { map } from "rxjs/operators";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { serializeFilterValue } from "../filters/filter.utils.static";
import { ShopProductService } from "../../shop-product.service";


@Component({
    selector: 'app-shop-sidebar',
    templateUrl: './shop-sidebar.component.html',
    styleUrls: ['./shop-sidebar.component.scss'],
})
export class ShopSidebarComponent implements OnDestroy {
    private subs = new Subscription();
    public isOpen = false;
    public filters: Filter[] = [];
    public form!: FormGroup;


    constructor(
        @Inject(PLATFORM_ID) private platformId: any,
        @Inject(DOCUMENT) private document: Document,
        private fb: FormBuilder,
        public shopProductService: ShopProductService,
    ) {
        // -->Set: filters:
        this.setFilters();

        // -->When you are on small devices, it should be close by default
        if (isPlatformBrowser(this.platformId)) {
            // -->Track: max-width changes
            this.subs.add(
                fromMatchMedia('(max-width: 991px)').subscribe(media => {
                    if (this.isOpen && !media.matches) {
                        this.close();
                    }
                })
            );
        }
    }


    /**
     * Set: filters
     */
    public setFilters(): void {
        // -->Subscribe: to page list changes
        this.subs.add(
            this.shopProductService.list$.pipe(map(x => x.filters)).subscribe(filters => {
                // -->Init: fields
                const fields: { [filterSlug: string]: FormControl } = {};
                // -->Set: filters
                this.filters = filters;

                // -->Map: filters
                filters.map((filter) => {
                    // -->Set: Form control
                    fields[filter.slug] = this.fb.control(filter.value);

                    // -->Subscribe: to value changes and set filter
                    fields[filter.slug].valueChanges.subscribe((value) => {
                        // -->Set: filter value
                        this.shopProductService.setFilterValue(filter.slug, serializeFilterValue(filter.type, value));
                    });
                })

                // -->Set: form group
                this.form = this.fb.group(fields);
            })
        );
    }

    /**
     * Open: sidebar
     */
    public open(): void {
        if (isPlatformBrowser(this.platformId)) {
            // -->Set: state
            this.isOpen = true;
            // -->Get: body width
            const bodyWidth = this.document.body.offsetWidth;

            // -->Adjust: document styles to make space for the sidebar
            this.document.body.style.overflow = 'hidden';
            this.document.body.style.paddingRight = (this.document.body.offsetWidth - bodyWidth) + 'px';
        }
    }

    /**
     * Close: sidebar
     */
    public close(): void {
        if (isPlatformBrowser(this.platformId)) {
            // -->Set: state
            this.isOpen = false;
            // -->Reset: document styles
            this.document.body.style.overflow = '';
            this.document.body.style.paddingRight = '';
        }
    }

    /**
     * Track: filter by slug
     */
    public trackBySlug(index: number, filter: Filter): string {
        return filter.slug;
    }


    /**
     * Destroy
     */
    public ngOnDestroy(): void {
        this.subs.unsubscribe();
    }
}
