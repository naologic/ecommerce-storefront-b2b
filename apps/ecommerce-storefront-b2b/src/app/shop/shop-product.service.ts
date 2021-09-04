import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { ProductsList } from '../interfaces/list';
import { GetProductsListOptions } from '../interfaces/shop';
import { serializeFilterValue } from "./_parts/filters/filter.utils.static";
import { AppService } from "../app.service";


export interface ActiveFilter2 {
    slug: string;
    type: string;
    value: string;
}

@Injectable()
export class ShopProductService {
    // todo: check this

    private listSubject$: ReplaySubject<ProductsList> = new ReplaySubject<ProductsList>(1);

    // todo: check this
    public listState!: ProductsList;
    // todo: check this

    private optionsState: GetProductsListOptions = {};

    public activeFilters2: BehaviorSubject<ActiveFilter2[]> = new BehaviorSubject<ActiveFilter2[]>([]);

    // todo: check this
    public readonly optionsChange$: EventEmitter<GetProductsListOptions> = new EventEmitter<GetProductsListOptions>();
    public readonly list$: Observable<ProductsList> = this.listSubject$.asObservable();
    public readonly defaultOptions: Required<GetProductsListOptions> = {
        page: 1,
        limit: 16,
        sort: 'name_asc',
        filters: {},
        searchTerm: null,
        customPrice: false,
    };
    /**
     * Params options: for validation
     */
    public readonly paramsOptions = {
        limits: [8, 16, 24, 32],
        sorts: ['name_asc', 'name_desc']
    }
    public filters = [];

    // todo: check this
    public get options(): GetProductsListOptions {
        return this.optionsState;
    }

    constructor(private appService: AppService) {
        // todo: check this
        // -->Init: options
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

        // todo: set filters:
        this.filters = list.filters;


        console.log("this.listState.filters >>>", this.listState.filters)
        // -->Init:
        const activeFilters: ActiveFilter2[] = [];
        const filters: GetProductsListOptions['filters'] = {};

        // -->Iterate: over filters
        this.listState.filters.map(filter => {
            const value = serializeFilterValue(filter.type, filter.value as any);

            if (value) {
                filters[filter.slug] = value;
                activeFilters.push({slug:filter.slug, value, type: filter.type})
            }
        })

        // -->Check: search term
        if (this.optionsState.searchTerm) {
            activeFilters.push({slug: 'searchTerm', value: this.optionsState.searchTerm, type: 'searchTerm'});
        }

        // -->Push: active filters
        this.activeFilters2.next(activeFilters);

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
     * Set: pagination
     */
    public updatePagination(options: {page: number, limit: number, sort: string}): void {
        this.setOptions({
            ...this.optionsState,
            page: this.optionsState.page !== options.page ? options.page : 1,
            limit: +options.limit,
            sort: options.sort
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
        // console.log("this.opstions setFilter >>>", this.optionsState)
    }

    /**
     * Reset: filter
     * // todo: add typecast
     */
    public resetFilter(activeFilter: any): void {
        if (!activeFilter) {
            return;
        }

        if (activeFilter.type === 'searchTerm') {
            this.setSearchTerm(null);

        } else if (activeFilter.slug === 'price') {
            // todo: set the default price range!!!!

        } else if (activeFilter.slug === 'manufacturer') {
            this.setFilterValue(activeFilter.slug, null);
        }
        // // -->Get: filter handler from type
        // const handler = filterHandlers.find(x => x.type === activeFilter.type);
        //
        // // -->Check: handler
        // if (!handler) {
        //     return;
        // }
        //
        // // -->Remove: active filter
        // const removedFilters = [...this.removedFiltersState, activeFilter];
        // // -->Get: all removed filters with the same slug
        // const all = removedFilters.filter(x => x.original.slug === activeFilter.original.slug);
        //
        // // -->Reset: values and remove filters
        // this.setFilterValue(activeFilter.original.slug, handler.getResetValue(all));
        // this.setRemovedFilters(removedFilters);
    }

    /**
     * Reset: all option filters
     */
    public resetAllFilters(): void {
        this.setOptions({
            ...this.defaultOptions
        });
    }

    /**
     * Set: options and emit updates
     */
    private setOptions(options: GetProductsListOptions): void {
        this.optionsState = options;
        this.optionsChange$.emit(options);
    }


    /**
     * Validate: filter params
     */
    public validateFilterParams(type: 'limit' | 'page' | 'sort' | 'manufacturer', value): any {
        switch (type) {
            case "limit":
                return this.paramsOptions.limits.includes(value) ? value : this.defaultOptions.limit;
            case "page":
                return !isNaN(value) && value > 0 ? value : this.defaultOptions.page;
            case "sort":
                return this.paramsOptions.sorts.includes(value) ? value : this.defaultOptions.sort;
            case "manufacturer":
                return this.appService.checkManufacturerId(value);
            default:
                return value;
        }
    }

}
