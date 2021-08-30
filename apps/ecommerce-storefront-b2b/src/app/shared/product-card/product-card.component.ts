import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component, HostBinding,
    Input, OnChanges,
    OnDestroy,
    OnInit, SimpleChanges
} from "@angular/core";
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NaoSettingsInterface } from "@naologic/nao-interfaces";
import { CurrencyService } from '../currency/services/currency.service';
import { UrlService } from '../../services/url.service';
import { QuickviewService } from '../../services/quickview.service';
import { AppService } from "../../app.service";
import { Product, ProductAttribute } from '../../interfaces/product';
import { NaoUserAccessService } from '@naologic/nao-user-access';

export type ProductCardElement = 'actions' | 'status-badge' | 'meta' | 'features' | 'buttons' | 'list-buttons';

export type ProductCardLayout = 'grid' | 'list' | 'table' | 'horizontal';

@Component({
    selector: 'app-product-card',
    templateUrl: './product-card.component.html',
    styleUrls: ['./product-card.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCardComponent implements OnChanges, OnInit, OnDestroy {
    // TODO: update Product interface to include minPrice and maxPrice
    // @Input() public product!: Product | any;
    // @Input() public layout?: ProductCardLayout;
    // @Input() public exclude: ProductCardElement[] = [];

    @Input() product!: Product | any;

    @Input() layout?: ProductCardLayout;

    @Input() exclude: ProductCardElement[] = [];

    @HostBinding('class.product-card') classProductCard = true;

    @HostBinding('class.product-card--layout--grid') get classProductCardLayoutGrid(): boolean {
        return this.layout === 'grid';
    }

    @HostBinding('class.product-card--layout--list') get classProductCardLayoutList(): boolean {
        return this.layout === 'list';
    }

    @HostBinding('class.product-card--layout--table') get classProductCardLayoutTable(): boolean {
        return this.layout === 'table';
    }

    @HostBinding('class.product-card--layout--horizontal') get classProductCardLayoutHorizontal(): boolean {
        return this.layout === 'horizontal';
    }

    private destroy$: Subject<void> = new Subject();

    public appSettings: NaoSettingsInterface.Settings;
    public showingQuickview = false;
    public featuredAttributes: ProductAttribute[] = [];
    public isLoggedIn = false;

    constructor(
        private cd: ChangeDetectorRef,
        private quickViewService: QuickviewService,
        public currency: CurrencyService,
        public url: UrlService,
        private appService: AppService,
        private naoUsersService: NaoUserAccessService,
    ) { }


    public ngOnInit(): void {
        // -->Set: app settings
        this.appSettings = this.appService.settings.getValue();

        // -->Check: if the user is logged in
        this.isLoggedIn = this.naoUsersService.isLoggedIn();

        // -->Subscribe: to currency changes
        this.currency.changes$.pipe(takeUntil(this.destroy$)).subscribe(() => {
            // -->Mark: as changed
            this.cd.markForCheck();
        });
    }


    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.product) {
            // this.featuredAttributes = this.product.attributes.filter(x => x.featured);

            // -->Calculate: min and max price for this product
            const minPrice = this.product?.data?.variants?.reduce((min, variant) => (variant.price < min ? variant.price : min), this.product.data.variants[0].price)
            const maxPrice = this.product?.data?.variants?.reduce((max, variant) => (variant.price > max ? variant.price : max), this.product.data.variants[0].price)
            // -->Set: min and max price
            this.product.minPrice = minPrice;
            this.product.maxPrice = maxPrice;
        }
    }


    /**
     * Show: product quickview
     */
    public showQuickView(): void {
        // -->Check: if quickview is being shown already
        if (this.showingQuickview) {
            return;
        }

        // -->Start: loading
        this.showingQuickview = true;
        // -->Show: product quickview
        this.quickViewService.show(this.product).subscribe({
            complete: () => {
                // -->Done: loading
                this.showingQuickview = false;
                // -->Mark: as changed
                this.cd.markForCheck();
            },
        });
    }


    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
