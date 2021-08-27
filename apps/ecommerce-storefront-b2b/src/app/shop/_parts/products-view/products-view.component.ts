import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { merge, Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { NaoSettingsInterface } from "@naologic/nao-interfaces";
import { AppService } from "../../../app.service";
import { ShopService } from '../../shop.service';
import { ShopSidebarService } from '../../shop-sidebar.service';
import { PageShopGridLayout, PageShopLayout } from '../../page-shop/page-shop.component';

export interface LayoutButton {
    layout: PageShopLayout;
    icon: string;
}

@Component({
    selector: 'app-products-view',
    templateUrl: './products-view.component.html',
    styleUrls: ['./products-view.component.scss'],
})
export class ProductsViewComponent implements OnInit, OnDestroy {
    @Input() public layout: PageShopLayout = 'grid';
    @Input() public gridLayout: PageShopGridLayout = 'grid-4-sidebar';
    @Input() public offCanvasSidebar: 'always' | 'mobile' = 'mobile';

    private destroy$: Subject<void> = new Subject<void>();

    /**
     * Change: the view of the products from grid to table
     */
    public layoutButtons: LayoutButton[] = [
        { layout: 'grid', icon: 'layout-grid-16' },
        { layout: 'grid-with-features', icon: 'layout-grid-with-details-16' },
        { layout: 'list', icon: 'layout-list-16' },
        { layout: 'table', icon: 'layout-table-16' },
    ];
    public appSettings: NaoSettingsInterface.Settings;
    public isEmptyList$!: Observable<boolean>;
    public currentFiltersCount$!: Observable<number>;
    public hasActiveFilters$!: Observable<boolean>;
    public pageControl!: FormControl;
    public limitControl!: FormControl;
    public sortControl!: FormControl;

    constructor(
        public sidebar: ShopSidebarService,
        public page: ShopService,
        private appService: AppService,
    ) { }

    public ngOnInit(): void {
        // -->Set: app settings
        this.appSettings = this.appService.settings.getValue();

        // -->Init: filter controls
        this.pageControl = new FormControl(this.page.defaultOptions.page);
        this.limitControl = new FormControl(this.page.defaultOptions.limit);
        this.sortControl = new FormControl(this.page.defaultOptions.sort);

        // -->Filter: for page, limit and sort
        merge(
            this.pageControl.valueChanges.pipe(map(v => ['page', v])),
            this.limitControl.valueChanges.pipe(map(v => ['limit', parseFloat(v)])),
            this.sortControl.valueChanges.pipe(map(v => ['sort', v])),
        ).pipe(
            takeUntil(this.destroy$),
        ).subscribe(([option, value]) => {
            this.page.setOptionValue(option, value);
        });

        // -->Update: page, limit and sort controls on page list changes
        this.page.list$.pipe(
            takeUntil(this.destroy$),
        ).subscribe(({ page, limit, sort }) => {
            this.pageControl.setValue(page, { emitEvent: false });
            this.limitControl.setValue(limit, { emitEvent: false });
            this.sortControl.setValue(sort, { emitEvent: false });
        });

        this.isEmptyList$ = this.page.list$.pipe(map(x => x.total === 0));
        this.currentFiltersCount$ = this.page.currentFilters$.pipe(map(x => x.length));
        this.hasActiveFilters$ = this.page.activeFilters$.pipe(map(x => x.length > 0));
    }

    /**
     * Set: layout
     */
    public setLayout(value: PageShopLayout): void {
        this.layout = value;
    }

    /**
     * Track: product by _id
     */
    public trackByProductId(index: number, product: {_id?: string | number}): string | number {
        return product._id;
    }

    /**
     * Track: entity by id
     */
    public trackById(index: number, entity: { id: string | number }): string | number {
        return entity.id;
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
