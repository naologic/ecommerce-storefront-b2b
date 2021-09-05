import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription, combineLatest } from "rxjs";
import { debounceTime, take, distinctUntilChanged } from "rxjs/operators";
import { UrlService } from '../../services/url.service';
import { ECommerceService } from '../../e-commerce.service';
import { AppService } from '../../app.service';
import { buildCategoriesFilter, buildManufacturerFilter, buildPriceFilter, deserializeFilterValue } from "../_parts/filters/filter.utils.static";
import { BreadcrumbItem } from '../_parts/breadcrumb/breadcrumb.component';
import { getBreadcrumbs } from '../../shared/functions/utils';
import { NaoSettingsInterface } from "../../../../../../libs/nao-interfaces/src";
import { FormControl, FormGroup } from "@angular/forms";
import { ShopProductService } from "../shop-product.service";
import { NaoUserAccessService } from "../../../../../../libs/nao-user-access/src";
import { ActiveFilter, LayoutButton, PageShopLayout } from "../../interfaces/list";



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
    public activeFilters: ActiveFilter[] = [];
    public viewLayoutButtons: LayoutButton[] = [
        { layout: 'grid', icon: 'layout-grid-16' },
        { layout: 'grid-with-features', icon: 'layout-grid-with-details-16' },
        { layout: 'list', icon: 'layout-list-16' },
        { layout: 'table', icon: 'layout-table-16' },
    ];
    public viewLayout: PageShopLayout = 'grid';
    public data = {
        items: [],
        filters: [],
        page: 1,
        from: 1,
        limit: 16,
        sort: `name_asc`,
        to: 1,
        total: 0,
        pages: 0
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
        private naoUsersService: NaoUserAccessService,
        private translate: TranslateService,
        private eCommerceService: ECommerceService,
        private appService: AppService,
        private toastr: ToastrService
    ) { }


    public ngOnInit(): void {
        // -->If: the page has a categoryId, check that this is valid
        if (this.route.snapshot.params.categoryId && !this.appService.checkCategoryId(this.route.snapshot.params.categoryId)) {
            this.router.navigateByUrl('/404').then();
            return;
        }
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
            this.shopService.activeFilters.subscribe(value => {
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
                    this.shopService.resetAllFilters();
                }
            })
        );


        // -->Subscribe: to params and query params
        this.subs.add(combineLatest([this.route.params, this.route.queryParams])
            .subscribe(() => {
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
        // -->Check: if there is a price already set, you are logged in and that you have a price filter
        if (this.appSettings.showPriceFilter && this.naoUsersService.isLoggedIn$.getValue() && options.filters.price?.split('-')?.length) {
            // -->Split: string to get min and max price
            [minPrice, maxPrice] = options.filters.price?.split('-').map(p => +p);
            // -->Set: only if both of them are numbers
            if (!isNaN(minPrice) && !isNaN(maxPrice)) {
                query.minPrice = minPrice;
                query.maxPrice = maxPrice;
            }
        }


        // -->Execute
        this.refreshSubs = this.eCommerceService.productsFilter(query).subscribe((res) => {
            // -->Check: res
            if (res && res.ok && res.data) {
                // -->Init: filters
                const filters = [];

                // -->Push: category filters
                filters.push(buildCategoriesFilter(this.appService.appInfo?.getValue()?.categories?.items || [], categoryId));

                // -->Check: if we show the price filter
                if (this.appSettings.showPriceFilter && this.naoUsersService.isLoggedIn$.getValue()) {
                    const filterPrice = buildPriceFilter(res.data?.filterInfo?.min, res.data?.filterInfo?.max, minPrice, maxPrice);
                    // --->Push: price filter
                    filters.push(filterPrice);
                }

                // -->Push: manufacturers filter
                filters.push(buildManufacturerFilter(res.data?.filterInfo?.vendors || [], selectedManufacturerIds));

                // -->Compute: total pages and current page based on response data count and page size
                const pages = Math.ceil(res.data?.count / query.pageSize);
                const page = options.page > pages ? 1 : options.page;

                // -->Update: breadcrumbs
                this.updateBreadcrumbs(categoryId);

                // -->Set: data
                this.data = {
                    items: res.data.items || [],
                    filters: filters,
                    page: page,
                    limit: query.pageSize,
                    sort: options.sort || this.shopService.defaultOptions.sort,
                    total: res.data?.count || 0,
                    pages: pages,
                    from: (page - 1) * query.pageSize + 1 <= res.data?.count ? (page - 1) * query.pageSize + 1 : 0,
                    to: (page * query.pageSize) < res.data?.count ? (page * query.pageSize) : res.data?.count,
                }
                // -->Done: loading
                this.status = 'done';
                // -->Set: List and calculate pages and everything
                this.shopService.setList(this.data);

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
     */
    public initFilters(): void {
        // -->Init: filters
        const filters = [];
        // -->Push: category filters
        filters.push(buildCategoriesFilter(this.appService.appInfo?.getValue()?.categories?.items || [], null));
        // -->Check: if we show price filter
        if (this.appSettings.showPriceFilter && this.naoUsersService.isLoggedIn$.getValue()) {
            const filterPrice = buildPriceFilter(0, 0, 0, 0, false);
            // --->Push: price filter
            filters.push(filterPrice);
        }
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

        // -->Check: filters
        if (options.hasOwnProperty('filters') && this.shopService.filters) {
            this.shopService.filters.map(filter => {
                params[`filter_${filter.slug}`] = deserializeFilterValue(filter.type, this.shopService.options.filters[filter.slug]);
            })
        }

        return params;
    }


    /**
     * Set: page options from query params
     */
    private setPageOptions(): void {
        // -->Update page options from query params
        this.route.queryParams.pipe(take(1)).subscribe((params) => {
            // --Check: param
            if (!params) {
                return;
            }

            // -->Check: page
            if (params.hasOwnProperty('page') && params['page']) {
                // -->Validate: value
                const value = this.shopService.validateFilterParams('page', +params['page'])
                // -->Set
                this.shopService.options.page = value;
                // -->Patch: form control
                this.filterFormGroup.get('page').setValue(value);
                this.filterFormGroup.get('page').updateValueAndValidity();
            }

            // -->Check: limit
            if (params.hasOwnProperty('limit') && params['limit']) {
                // -->Validate: value
                const value = this.shopService.validateFilterParams('limit', +params['limit'])
                // -->Set:
                this.shopService.options.limit = value;
                // -->Patch: form control
                this.filterFormGroup.get('limit').setValue(value);
                this.filterFormGroup.get('limit').updateValueAndValidity();
            }

            // -->Check: sort
            if (params.hasOwnProperty('sort') && params['sort']) {
                // -->Validate: value
                const value = this.shopService.validateFilterParams('sort', params['sort']);
                // -->Set:
                this.shopService.options.sort = value;
                // -->Patch: form control
                this.filterFormGroup.get('sort').setValue(value);
                this.filterFormGroup.get('sort').updateValueAndValidity();
            }

            // -->Check: searchTerm
            if (params.hasOwnProperty('searchTerm') &&  params['searchTerm']) {
                this.shopService.options.searchTerm = params['searchTerm'] || null;
            }

            if (!this.shopService.options.filters) {
                this.shopService.options.filters = {};
            }

            // -->Check: price filter
            if (params.hasOwnProperty('filter_price') && params['filter_price']) {
                if (this.shopService.validateFilterParams('price', params['filter_price'])) {
                    this.shopService.options.filters['price'] = params['filter_price'];
                }
            }

            // -->Check: manufacturer filter
            if (params.hasOwnProperty('filter_manufacturer') && params['filter_manufacturer']) {
                if (this.shopService.validateFilterParams('manufacturer', params['filter_manufacturer'])) {
                    this.shopService.options.filters['manufacturer'] = params['filter_manufacturer'];
                }
            }


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
     * Track: entity by slug
     */
    public trackBySlug(index: number, entity: { slug?: string }): string | number {
        return entity?.slug;
    }


    public ngOnDestroy(): void {
        if (this.refreshSubs) {
            this.refreshSubs.unsubscribe()
        }
        this.subs.unsubscribe();
    }
}
