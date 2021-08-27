import {ChangeDetectorRef, Component, Input, OnDestroy, OnInit} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { ShopService } from '../../shop.service';
import { Filter } from '../../../interfaces/filter';
import { filterHandlers } from '../filters/filter-handlers';
import { FilterHandler } from '../filters/filter.handler';

@Component({
    selector: 'app-widget-filters',
    templateUrl: './widget-filters.component.html',
    styleUrls: ['./widget-filters.component.scss'],
})
export class WidgetFiltersComponent implements OnInit, OnDestroy {
    @Input() public offcanvasSidebar: 'always' | 'mobile' = 'always';

    private destroy$: Subject<void> = new Subject<void>();

    public filters: Filter[] = [];
    public form!: FormGroup;

    constructor(
        public page: ShopService,
        private fb: FormBuilder,
        private cd: ChangeDetectorRef,
    ) { }

    public ngOnInit(): void {
        // -->Subscribe: to page list changes
        this.page.list$.pipe(
            map(x => x.filters),
            takeUntil(this.destroy$),
        ).subscribe(filters => {
            // -->Set: filters
            this.filters = filters;

            // -->Get: filters with handlers
            const filtersWithHandlers = this.page.filters
                .map(filter => ({ filter, handler: filterHandlers.find(x => x.type === filter.type) }))
                .filter((x): x is {filter: Filter; handler: FilterHandler} => !!x.handler);

            // -->Init: fields
            const fields: {[filterSlug: string]: FormControl} = {};

            // -->Apply: filters
            filtersWithHandlers.forEach(({ filter, handler }) => {
                fields[filter.slug] = this.fb.control(filter.value);
                fields[filter.slug].valueChanges.subscribe(value => {
                    this.page.setFilterValue(filter.slug, handler.serialize(value));
                });
            });

            // -->Set: form group
            this.form = this.fb.group(fields);
            // -->Trigger: change detection
            this.cd.detectChanges();
        });
    }

    /**
     * Track: filter by slug
     */
    public trackBySlug(index: number, filter: Filter): string {
        return filter.slug;
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
