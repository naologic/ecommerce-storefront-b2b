import { Component, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription, combineLatest } from "rxjs";
import { debounceTime, takeUntil, take, distinctUntilChanged } from "rxjs/operators";
import { UrlService } from '../../services/url.service';
import { LanguageService } from '../../shared/language/services/language.service';
import { ECommerceService } from '../../e-commerce.service';
import { AppService } from '../../app.service';
import { buildCategoriesFilter, buildManufacturerFilter, buildPriceFilter, deserializeFilterValue } from "../_parts/filters/filter.utils.static";
import { BreadcrumbItem } from '../_parts/breadcrumb/breadcrumb.component';
import { getBreadcrumbs } from '../../shared/functions/utils';
import { NaoSettingsInterface } from "../../../../../../libs/nao-interfaces/src";
import { FormControl, FormGroup } from "@angular/forms";
import { ShopProductService } from "../shop-product.service";


export type PageShopLayout =
    'grid' |
    'grid-with-features' |
    'list' |
    'table';

export interface LayoutButton {
    layout: PageShopLayout;
    icon: string;
}





@Component({
    selector: 'app-page-shop-list',
    templateUrl: './page-shop-list.component.html',
    styleUrls: ['./page-shop-list.component.scss'],
})
export class PageShopListComponent implements OnInit, OnDestroy {
    private refreshSubs: Subscription;
    private subs = new Subscription();
    public status: 'loading' | 'done' = 'done';
    public appSettings: NaoSettingsInterface.Settings = null;
    public pageTitle$!: string;
    public breadcrumbs: BreadcrumbItem[];
    public activeFilters = [];

    /**
     * Change: the view of the products from grid to table
     */
    public viewLayoutButtons: LayoutButton[] = [
        { layout: 'grid', icon: 'layout-grid-16' },
        { layout: 'grid-with-features', icon: 'layout-grid-with-details-16' },
        { layout: 'list', icon: 'layout-list-16' },
        { layout: 'table', icon: 'layout-table-16' },
    ];
    public viewLayout: PageShopLayout = 'grid';


    // @WIP
    // todo: check if data should stay here or in the service
    public data = {
        items: [],
        from: 1,
        to: 1,
        total: 0,
        pages: 0,
        currentFilters: []
    }



    // -->Filter: formGroup
    public filterFormGroup = new FormGroup({
        page: new FormControl(this.shopService.defaultOptions.page),
        limit: new FormControl(this.shopService.defaultOptions.limit),
        sort: new FormControl(this.shopService.defaultOptions.sort),
    });



    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private shopService: ShopProductService,
        private url: UrlService,
        private translate: TranslateService,
        private eCommerceService: ECommerceService,
        private appService: AppService,
        private toastr: ToastrService
    ) { }

    public ngOnInit(): void {
        // -->Set: app settings
        this.appSettings = this.appService.settings.getValue();
        // -->Set: title
        this.pageTitle$ = this.translate.instant('HEADER_SHOP');
        // -->Set: breadcrumb
        this.breadcrumbs = [
            {
                label: this.translate.instant('LINK_HOME'),
                url: this.url.home(),
            },
            {
                label: this.translate.instant('LINK_SHOP'),
                url: this.url.shop(),
                state: { resetFilters: true }
            },
        ];

        // -->Init: formGroup
        this.filterFormGroup = new FormGroup({
            page: new FormControl(this.shopService.defaultOptions.page),
            limit: new FormControl(this.shopService.defaultOptions.limit),
            sort: new FormControl(this.shopService.defaultOptions.sort),
        });

        // -->Init: filters - we need this so we can keep the pasted link with query params
        this.initFilters();

        // -->Set: page options from query params on landing
        this.setPageOptions();

        // -->Subscribe: to active filters changing
        this.subs.add(
            this.shopService.activeFilters2.subscribe(value => {
                // -->Set: active filters
                this.activeFilters = Array.isArray(value) ? value : [];
            })
        );


        // -->Subscribe: to option changes
        this.subs.add(
            this.shopService.optionsChange$.pipe(debounceTime(100)).subscribe((value) => {
                // -->Update: URL
                this.updateUrl();
            })
        )

        // -->Subscribe: to params change and reset filters based on state flag
        this.subs.add(
            this.route.params.subscribe(v => {
                if (history?.state?.resetFilters) {
                    console.warn("SA RESTEAZA FILTERELEEEEEEEEEEEEEEEEEEEE")
                    this.shopService.resetAllFilters();
                }
            })
        );


        // -->Subscribe: to params and query params
        this.subs.add(combineLatest([this.route.params, this.route.queryParams])
            .subscribe(() => {
                console.error("PARAMS HAS CHANGED >>>> TRIGGERING REFRESH")
                this.refresh();
            })
        );

        // -->Subscribe: to pagination change
        this.filterFormGroup.valueChanges.pipe(distinctUntilChanged(), debounceTime(100)).subscribe(value => {
            this.shopService.updatePagination(value);
        })
    }


    /**
     * Refresh: products
     */
    public refresh(): void {
        if (this.refreshSubs) {
            this.refreshSubs.unsubscribe();
            this.refreshSubs = null;
        }
        // -->Start: loading
        this.status = 'loading';

        // -->Get: category id
        const categoryId: number = this.route.snapshot.params.categoryId ? +this.route.snapshot.params.categoryId : undefined;

        // -->Create: filters options
        const options = {
            ...this.shopService.options,
            filters: {
                ...this.shopService.options.filters,
                category: categoryId,
            },
        } as any;

        // -->Get: Selected manufacturers
        const selectedManufacturerIds = options.filters.manufacturer?.split(',')?.filter((f) => f) || [];
        // -->Create: query
        const query = {
            searchTerm: options.searchTerm,
            categoryId: options.filters.category,
            manufacturerIds: selectedManufacturerIds,
            sortBy: 'name',
            sortOrder: options.sort === 'name_asc' ? 1 : -1, // 1 = asc/ -1 = desc
            pageSize: options.limit || this.shopService.defaultOptions.limit,
            pageNo: options.page || this.shopService.defaultOptions.page,
            calculateFilters: true
        } as any;

        // -->Get: min and max price range
        let minPrice, maxPrice;
        // -->Check: if there is a price already set, if not wait for the response
        // todo: testy with show price too
        // if (this.appSettings.showPriceFilter && this.page.options.customPrice && options.filters.price?.split('-')?.length) {
        //     // -->Split: string to get min and max price
        //     [minPrice, maxPrice] = options.filters.price?.split('-').map(p => +p);
        //     // -->Set: only if both of them are numbers
        //     if (!isNaN(minPrice) && !isNaN(maxPrice)) {
        //         query.minPrice = minPrice;
        //         query.maxPrice = maxPrice;
        //     }
        // }


        // -->Execute
        this.refreshSubs = this.eCommerceService.productsFilter(query).subscribe((res) => {
            // -->Check: res
            if (res && res.ok && res.data) {


                // -->Init: filters
                const filters = [];
                // -->Push: category filters
                filters.push(buildCategoriesFilter(this.appService.appInfo?.getValue()?.categories?.items || [], categoryId));
                // -->Check: if we show price filter
                // todo: test with price too
                // if (this.appSettings.showPriceFilter) {
                //     const filterPrice = buildPriceFilter(res.data?.filterInfo?.min, res.data?.filterInfo?.max, minPrice, maxPrice, !this.page.options.customPrice);
                //     // --->Push: price filter
                //     console.log("filter price >>>", filterPrice)
                //     filters.push(filterPrice);
                // }
                // -->Push: manufacturers filter
                filters.push(buildManufacturerFilter(res.data?.filterInfo?.vendors || [], selectedManufacturerIds));

                // -->Compute: total pages and current page based on response data count and page size
                const pages = Math.ceil(res.data?.count / query.pageSize);
                const page = options.page > pages ? 1 : options.page;

                // -->Update: breadcrumbs
                this.updateBreadcrumbs(categoryId);

                // -->Set: List and calculate pages and everything

                // -->Set: data
                // todo: merge this
                this.data = {
                    items: res.data.items || [],
                    // filters: filters,
                    // page: page,
                    // limit: query.pageSize,
                    // sort: options.sort || this.page.defaultOptions.sort,
                    total: res.data?.count || 0,
                    pages: pages,
                    from: (page - 1) * query.pageSize + 1 <= res.data?.count ? (page - 1) * query.pageSize + 1 : 0,
                    to: (page * query.pageSize) < res.data?.count ? (page * query.pageSize) : res.data?.count,
                    currentFilters: []
                }

                // @DEPRECTEAD
                const list = {
                    items: res.data.items || [],
                    filters: filters,
                    page: page,
                    limit: query.pageSize,
                    sort: options.sort || this.shopService.defaultOptions.sort,
                    total: res.data?.count || 0,
                    pages: pages,
                    from: (page - 1) * query.pageSize + 1 <= res.data?.count ? (page - 1) * query.pageSize + 1 : 0,
                    to: (page * query.pageSize) < res.data?.count ? (page * query.pageSize) : res.data?.count,
                };


                // -->Done: loading
                this.status = 'done';
                // -->Set: data
                this.shopService.setList(list);

            } else {
                // -->Done: loading
                this.status = 'done';
                // -->Show: errors
                this.toastr.error(this.translate.instant('ERROR_API_REQUEST'));
            }
        }, err => {
            // -->Done: loading
            this.status = 'done';
            // -->Show: errors
            this.toastr.error(this.translate.instant('ERROR_API_REQUEST'));
        });
    }


    /**
     * Init: filters:
     *  @WIP: check if it's needed or we can do something else
     *  todo: check if maybe we can merge the filters from refresh with this one
     */
    public initFilters(): void {
        // -->Init: filters
        const filters = [];
        // -->Push: category filters
        filters.push(buildCategoriesFilter(this.appService.appInfo?.getValue()?.categories?.items || [], null));
        // -->Check: if we show price filter
        // todo: do the price filter
        // if (this.appSettings.showPriceFilter) {
        //     const filterPrice = buildPriceFilter(0, 0, 0, 0, false);
        //     // --->Push: price filter
        //     filters.push(filterPrice);
        // }
        // -->Push: manufacturers filter
        filters.push(buildManufacturerFilter([], []));

        // -->Set: filters
        this.shopService.filters = filters;
    }

    /**
     * Update: breadcrumbs and ttile
     */
    public updateBreadcrumbs(categoryId: number): void {
        // -->Get: breadcrumbs
        const breadcrumbs = getBreadcrumbs(this.appService.appInfo?.getValue()?.categories?.items, categoryId);
        // -->Update: breadcrumbs
        this.breadcrumbs = [
            {
                label: this.translate.instant('LINK_HOME'),
                url: this.url.home()
            },
            {
                label: this.translate.instant('LINK_SHOP'),
                url: this.url.shop(),
                state: { resetFilters: true }
            },
            ...breadcrumbs.map((x) => ({
                label: x.name,
                url: this.url.category(x),
                state: { resetFilters: true }
            })),
        ];

        if (breadcrumbs.length) {
            this.pageTitle$ = breadcrumbs[breadcrumbs.length - 1].name;
        } else {
            // -->Set: title
            this.pageTitle$ = this.translate.instant('HEADER_SHOP');
        }
    }

    /**
     * Update: url
     */
    private updateUrl(): void {
        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: this.getQueryParams()
        }).then();
    }

    /**
     * Get: query params from page options
     */
    private getQueryParams(): Params {
        const params: Params = {};
        const options = this.shopService.options;

        // -->Check: page
        if (options.hasOwnProperty('page') && options.page) {
            params.page = options.page ? options.page : this.shopService.defaultOptions.page;
            // -->Set: value form control
            this.filterFormGroup.get('page').setValue(+params['page'], { onlySelf: true, emitEvent: false });
            this.filterFormGroup.get('page').updateValueAndValidity({ onlySelf: true, emitEvent: false });
        }
        // -->Check: limit
        if (options.hasOwnProperty('limit') && options.limit) {
            params.limit = options.limit ? options.limit : this.shopService.defaultOptions.limit;
            // -->Set: value form control
            this.filterFormGroup.get('limit').setValue(+params['limit'], { onlySelf: true, emitEvent: false });
            this.filterFormGroup.get('limit').updateValueAndValidity({ onlySelf: true, emitEvent: false });
        }
        // -->Check: sort
        if (options.hasOwnProperty('sort') && options.sort) {
            params.sort = options.sort ? options.sort : this.shopService.defaultOptions.sort;
            // -->Set: value form control
            this.filterFormGroup.get('sort').setValue(params['sort'], { onlySelf: true, emitEvent: false });
            this.filterFormGroup.get('sort').updateValueAndValidity({ onlySelf: true, emitEvent: false });
        }
        // -->Check: searchTerm
        if (options.hasOwnProperty('searchTerm') && options.searchTerm) {
            if (options.searchTerm) {
                params.searchTerm = options.searchTerm;
            }
        }

        console.error("PLM")
        console.log("sa vedem ce filters sunt >>>", this.shopService.filters)

        // -->Check: filters
        if (options.hasOwnProperty('filters') && this.shopService.filters) {
            this.shopService.filters.map(filter => {
                // todo: maybe check that this is a default value?????
                // if (filter.slug !== 'price') {
                    params[`filter_${filter.slug}`] = deserializeFilterValue(filter.type, this.shopService.options.filters[filter.slug]);
                // }

            })
        }

        console.log("params >>>>", params)

        return params;
    }


    /**
     * Set: page options from query params
     */
    private setPageOptions(): void {
        // -->Update page options from query params
        this.route.queryParams.pipe(take(1)).subscribe((param) => {
            // --Check: param
            if (!param) {
                return;
            }

            // -->Check: page
            if (param.hasOwnProperty('page') && param['page']) {
                this.shopService.options.page = param['page'];
                // -->Patch: form control
                this.filterFormGroup.get('page').setValue(+param['page']);
                this.filterFormGroup.get('page').updateValueAndValidity();
            }

            // -->Check: limit
            if (param.hasOwnProperty('limit') && param['limit']) {
                this.shopService.options.limit = param['limit'];
                // -->Patch: form control
                this.filterFormGroup.get('limit').setValue(+param['limit']);
                this.filterFormGroup.get('limit').updateValueAndValidity();
            }

            // -->Check: sort
            if (param.hasOwnProperty('sort') && param['sort']) {
                this.shopService.options.sort = param['sort'];
                // -->Patch: form control
                this.filterFormGroup.get('sort').setValue(param['sort']);
                this.filterFormGroup.get('sort').updateValueAndValidity();
            }

            // -->Check: searchTerm
            if (param.hasOwnProperty('searchTerm') &&  param['searchTerm']) {
                this.shopService.options.searchTerm = param['searchTerm'];
            }

            if (!this.shopService.options.filters) {
                this.shopService.options.filters = {};
            }

            // -->Check: price filter
            if (this.shopService.options.customPrice && param.hasOwnProperty('filter_price') && param['filter_price']) {
                this.shopService.options.filters['price'] = param['filter_price'];
            }

            // -->Check: manufacturer filter
            if (param.hasOwnProperty('filter_manufacturer') && param['filter_manufacturer']) {
                this.shopService.options.filters['manufacturer'] = param['filter_manufacturer'];
            }

            console.log("setPageOptions before updateUrl >>>>", this.shopService.options);

            // -->Update: URL
            this.updateUrl();
        });
    }



    /**
     * Set: products layout
     */
    public setProductsLayout(value: PageShopLayout): void {
        this.viewLayout = value;
    }

    /**
     * Reset: filter
     */
    public resetFilter(filter: any): void {
        this.shopService.resetFilter(filter);
    }

    /**
     * Reset All filters
     */
    public resetAllFilters(): void {
        this.shopService.resetAllFilters();
    }


    /**
     * Track: product id
     */
    public trackByProductId(index: number, product: {_id?: string}): string {
        return product._id;
    }

    /**
     * Track: entity by id
     */
    public trackById(index: number, entity: { id?: string | number }): string | number {
        return entity?.id;
    }


    public ngOnDestroy(): void {
        if (this.refreshSubs) {
            this.refreshSubs.unsubscribe()
        }
        this.subs.unsubscribe();
    }
}
