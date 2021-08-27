import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { ProductsList } from '../interfaces/list';
import { Product } from '../interfaces/product';
import { GetProductsListOptions } from '../interfaces/shop';
import { ActiveFilter, Filter } from '../interfaces/filter';
import { filterHandlers } from './_parts/filters/filter-handlers';
import { FilterHandler } from './_parts/filters/filter.handler';

@Injectable()
export class ShopService {
    private listSubject$: ReplaySubject<ProductsList> = new ReplaySubject<ProductsList>(1);
    private listState!: ProductsList;
    private removedFiltersState: ActiveFilter[] = [];
    private optionsState: GetProductsListOptions = {};
    /**
     * All active filters.
     */
    private activeFiltersSubject$: BehaviorSubject<ActiveFilter[]> = new BehaviorSubject<ActiveFilter[]>([]);
    /**
     * Active filters except removed ones.
     */
    private currentFiltersSubject$: BehaviorSubject<ActiveFilter[]> = new BehaviorSubject<ActiveFilter[]>([]);

    public isLoading = false;
    public readonly optionsChange$: EventEmitter<GetProductsListOptions> = new EventEmitter<GetProductsListOptions>();
    public readonly activeFilters$: Observable<ActiveFilter[]> = this.activeFiltersSubject$.asObservable();
    public readonly currentFilters$: Observable<ActiveFilter[]> = this.currentFiltersSubject$.asObservable();
    public readonly list$: Observable<ProductsList> = this.listSubject$.asObservable();
    public readonly defaultOptions: Required<GetProductsListOptions> = {
        page: 1,
        limit: 16,
        sort: 'name_asc',
        filters: {},
        searchTerm: null
    };

    // getters for list
    public get items(): Product[] { return this.listState?.items; }
    public get page(): number { return this.listState?.page; }
    public get limit(): number { return this.listState?.limit; }
    public get sort(): string { return this.listState?.sort; }
    public get total(): number { return this.listState?.total; }
    public get pages(): number { return this.listState?.pages; }
    public get from(): number { return this.listState?.from; }
    public get to(): number { return this.listState?.to; }
    public get filters(): Filter[] { return this.listState?.filters; }

    public get options(): GetProductsListOptions {
        return this.optionsState;
    }

    public get activeFilters(): ActiveFilter[] {
        return this.activeFiltersSubject$.value;
    }

    constructor(
    ) {
        // // -->Init: options
        // this.setOptions(this.defaultOptions);
    }

    /**
     * Update: list state, filters and options
     */
    public setList(list: ProductsList): void {
        // -->Update: list state
        this.listState = list;
        // -->Emit: updated list
        this.listSubject$.next(this.listState);

        // -->Build: filters with handles
        const filtersWithHandlers = this.listState.filters
            .map(filter => ({ filter, handler: filterHandlers.find(x => x.type === filter.type) }))
            .filter((x): x is {filter: Filter; handler: FilterHandler} => !!x.handler);

        // -->Get: active filters
        const activeFilters = filtersWithHandlers.reduce<ActiveFilter[]>((acc, { filter, handler }) => {
            return [...acc, ...handler.activeFilters(filter)];
        }, []);

        // -->Clear: removed filter state and notify active filter updates
        this.removedFiltersState = [];
        this.activeFiltersSubject$.next(activeFilters);
        this.currentFiltersSubject$.next(activeFilters);

        const filters: GetProductsListOptions['filters'] = {};

        // -->Update: filters values
        filtersWithHandlers.forEach(({ filter, handler }) => {
            const value = handler.serialize(filter.value);

            if (value !== null) {
                filters[filter.slug] = value;
            }
        });

        // -->Set: options state
        this.optionsState = {
            ...this.optionsState,
            page: list.page,
            limit: list.limit,
            sort: list.sort,
            filters
        };
    }

    /**
     * Set: search term to options
     */
    public setSearchTerm(searchTerm: string): void {
        this.setOptions({
            ...this.optionsState,
            page: 1,
            searchTerm
        });
    }

    /**
     * Set: option value
     */
    public setOptionValue(optionSlug: string, optionValue: any): void {
        this.setOptions({
            ...this.optionsState,
            page: 1,
            [optionSlug]: optionValue,
        });
    }

    /**
     * Set: option filter value
     */
    public setFilterValue(filterSlug: string, filterValue: string | null): void {
        this.setOptions({
            ...this.optionsState,
            page: 1,
            filters: {
                ...this.options.filters,
                [filterSlug]: filterValue || '',
            },
        });
    }

    /**
     * Reset: filter
     */
    public resetFilter(activeFilter: ActiveFilter): void {
        // -->Get: filter handler from type
        const handler = filterHandlers.find(x => x.type === activeFilter.type);

        // -->Check: handler
        if (!handler) {
            return;
        }

        // -->Remove: active filter
        const removedFilters = [...this.removedFiltersState, activeFilter];
        // -->Get: all removed filters with the same slug
        const all = removedFilters.filter(x => x.original.slug === activeFilter.original.slug);

        // -->Reset: values and remove filters
        this.setFilterValue(activeFilter.original.slug, handler.getResetValue(all));
        this.setRemovedFilters(removedFilters);
    }

    /**
     * Reset: all option filters
     */
    public resetAllFilters(): void {
        this.setOptions({
            ...this.optionsState,
            page: 1,
            filters: {},
        });

        // -->Remove: filter and notify updates on current filter
        this.setRemovedFilters(this.activeFilters);
    }

    /**
     * Set: options and emit updates
     */
    private setOptions(options: GetProductsListOptions): void {
        this.optionsState = options;
        this.optionsChange$.emit(options);
    }

    /**
     * Remove: filter and notify updates on current filter
     */
    private setRemovedFilters(removedFilters: ActiveFilter[]): void {
        this.removedFiltersState = removedFilters;
        this.currentFiltersSubject$.next(this.activeFilters.filter(x => removedFilters.indexOf(x) === -1));
    }
}
