import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { ActiveFilter, ProductsList } from "../interfaces/list";
import { GetProductsListOptions } from '../interfaces/shop';
import { serializeFilterValue } from "./_parts/filters/filter.utils.static";
import { AppService } from "../app.service";



@Injectable()
export class ShopProductService {
    private listSubject$: ReplaySubject<ProductsList> = new ReplaySubject<ProductsList>(1);
    public listState!: ProductsList;
    private optionsState: GetProductsListOptions = {};
    public activeFilters: BehaviorSubject<ActiveFilter[]> = new BehaviorSubject<ActiveFilter[]>([]);
    public filters = [];
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

    public get options(): GetProductsListOptions {
        return this.optionsState;
    }

    constructor(private appService: AppService) {}

    /**
     * Update: list state, filters and options
     */
    public setList(list: ProductsList): void {
        // -->Update: list state
        this.listState = list;
        // -->Emit: updated list
        this.listSubject$.next(this.listState);
        // -->Set: filters
        this.filters = list.filters;


        // -->Init:
        const activeFilters: ActiveFilter[] = [];
        const filters: GetProductsListOptions['filters'] = {};

        // -->Iterate: over filters
        this.listState.filters.map((filter: any) => {
            const value = serializeFilterValue(filter.type, filter.value as any);

            if (value) {
                if (filter.slug === 'price') {
                    // -->Check: and make sure the price is different from min/max
                    if (filter.value[0] !== filter.min || filter.value[1] !== filter.max) {
                        filters[filter.slug] = value;
                        activeFilters.push({slug:filter.slug, value, type: filter.type})
                    }
                } else {
                    filters[filter.slug] = value;
                    activeFilters.push({slug:filter.slug, value, type: filter.type})
                }

            }
        })

        // -->Check: search term
        if (this.optionsState.searchTerm) {
            activeFilters.push({slug: 'searchTerm', value: this.optionsState.searchTerm, type: 'searchTerm'});
        }

        // -->Push: active filters
        this.activeFilters.next(activeFilters);

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
    }

    /**
     * Reset: filter
     */
    public resetFilter(activeFilter: any): void {
        if (!activeFilter) {
            return;
        }
        // --Check: if its a search term or not
        if (activeFilter.type === 'searchTerm') {
            this.setSearchTerm(null);
        } else {
            this.setFilterValue(activeFilter.slug, null);
        }
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
    public validateFilterParams(type: "limit" | "page" | "sort" | "manufacturer" | "price", value): any {
        if (!value) {
            return ;
        }
        switch (type) {
            case "limit":
                return this.paramsOptions.limits.includes(value) ? value : this.defaultOptions.limit;
            case "page":
                return !isNaN(value) && value > 0 ? value : this.defaultOptions.page;
            case "sort":
                return this.paramsOptions.sorts.includes(value) ? value : this.defaultOptions.sort;
            case "manufacturer":
                return this.appService.checkManufacturerId(value);
            case "price":
                if (value.includes('-')) {
                    const [min, max] = value.split('-');
                    // -->Return
                    return !isNaN(+min) && !isNaN(+max) && min <= max;
                }
                return false;
            default:
                return value;
        }
    }

}
