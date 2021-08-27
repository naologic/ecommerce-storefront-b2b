import {
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnChanges, OnDestroy, OnInit,
    Output,
    SimpleChanges, ViewChild,
} from '@angular/core';
import { OwlCarouselOConfig } from 'ngx-owl-carousel-o/lib/carousel/owl-carousel-o-config';
import { CarouselComponent } from 'ngx-owl-carousel-o';
import { Subject, timer } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { LanguageService } from '../../../shared/language/services/language.service';
import { Product } from '../../../interfaces/product';
import { ProductCardElement, ProductCardLayout } from '../../../shared/product-card/product-card.component';
import { SectionHeaderGroup, SectionHeaderLink } from '../section-header/section-header.component';

export type BlockProductsCarouselLayout = 'grid-4' | 'grid-4-sidebar' | 'grid-5' | 'grid-6' | 'horizontal' | 'horizontal-sidebar';

const carouselLayoutOptions = {
    'grid-4': {
        items: 4,
        responsive: {
            1110: { items: 4 },
            930: { items: 4, margin: 16 },
            690: { items: 3, margin: 16 },
            430: { items: 2, margin: 16 },
            0: { items: 1 },
        },
    },
    'grid-4-sidebar': {
        items: 4,
        responsive: {
            1040: { items: 4 },
            818: { items: 3 },
            638: { items: 3, margin: 16 },
            430: { items: 2, margin: 16 },
            0: { items: 1 },
        },
    },
    'grid-5': {
        items: 5,
        responsive: {
            1350: { items: 5 },
            1110: { items: 4 },
            930: { items: 4, margin: 16 },
            690: { items: 3, margin: 16 },
            430: { items: 2, margin: 16 },
            0: { items: 1 },
        },
    },
    'grid-6': {
        items: 6,
        margin: 16,
        responsive: {
            1350: { items: 6 },
            1110: { items: 5 },
            930: { items: 4, margin: 16 },
            690: { items: 3, margin: 16 },
            430: { items: 2, margin: 16 },
            0: { items: 1 },
        },
    },
    horizontal: {
        items: 4,
        responsive: {
            1350: { items: 4, margin: 14 },
            930: { items: 3, margin: 14 },
            690: { items: 2, margin: 14 },
            0: { items: 1, margin: 14 },
        },
    },
    'horizontal-sidebar': {
        items: 3,
        responsive: {
            1040: { items: 3, margin: 14 },
            638: { items: 2, margin: 14 },
            0: { items: 1, margin: 14 },
        },
    },
};

const productCardLayoutMap: {[K in BlockProductsCarouselLayout]: ProductCardLayout} = {
    'grid-4': 'grid',
    'grid-4-sidebar': 'grid',
    'grid-5': 'grid',
    'grid-6': 'grid',
    horizontal: 'horizontal',
    'horizontal-sidebar': 'horizontal',
};

const productCardExcludeMap: {[K in ProductCardLayout]: ProductCardElement[]} = {
    grid: ['features', 'list-buttons'],
    list: [],
    table: [],
    horizontal: ['actions', 'status-badge', 'features', 'buttons', 'meta'],
};

@Component({
    selector: 'app-block-products-carousel',
    templateUrl: './block-products-carousel.component.html',
    styleUrls: ['./block-products-carousel.component.scss'],
})
export class BlockProductsCarouselComponent implements OnChanges, OnInit, OnDestroy {
    @Input() public products: Product[] = [];
    @Input() public blockTitle: string = '';
    @Input() public layout: BlockProductsCarouselLayout = 'grid-4';
    @Input() public rows = 1;
    @Input() public groups: SectionHeaderGroup[] = [];
    @Input() public currentGroup?: SectionHeaderGroup
    @Input() public links: SectionHeaderLink[] = [];
    @Input() public loading = false;

    private destroy$: Subject<void> = new Subject<void>();

    public showCarousel = true;
    public carouselOptions!: Partial<OwlCarouselOConfig>;
    public columns: Product[][] = [];

    @ViewChild(CarouselComponent) public carousel!: CarouselComponent;

    @Output() public changeGroup: EventEmitter<SectionHeaderGroup> = new EventEmitter<SectionHeaderGroup>();

    public get productCardLayout(): ProductCardLayout {
        return productCardLayoutMap[this.layout];
    }

    public get productCardExclude(): ProductCardElement[] {
        return productCardExcludeMap[this.productCardLayout];
    }

    constructor(
        private language: LanguageService,
        private cd: ChangeDetectorRef,
    ) { }

    public ngOnInit(): void {
        // Since ngx-owl-carousel-o cannot re-initialize itself, we will do it manually when the direction changes.
        this.language.directionChange$.pipe(
            switchMap(() => timer(250)),
            takeUntil(this.destroy$),
        ).subscribe(() => {
            // -->Handle: direction changes
            this.handleDirChanges();
        });
    }

    public ngOnChanges(changes: SimpleChanges): void {
        const properties = Object.keys(changes);

        // -->Check: if products or rows changed
        if (properties.includes('products') || properties.includes('row')) {
            this.columns = [];

            // -->Check: products and rows
            if (this.products && this.rows > 0) {
                // -->Get: copy of products array
                const products = this.products.slice();

                // -->Build: carousel slides
                while (products.length > 0) {
                    this.columns.push(products.splice(0, this.rows));
                }
            }
        }

        // -->Handle: products changes
        if (changes.products) {
            // Well, this is just another hack to get owl-carousel-o to work as expected
            setTimeout(() => {
                this.handleDirChanges();
            }, 0);
        }

        // -->Handle: layout changes
        if (changes.layout) {
            this.initOptions();
        }
    }

    /**
     * Initialize: carousel options
     */
    private initOptions(): void {
        this.carouselOptions = Object.assign({
            dots: false,
            margin: 20,
            loop: true,
            rtl: this.language.isRTL(),
        }, carouselLayoutOptions[this.layout]);
    }

    /**
     * Handle: direction changes
     */
    private handleDirChanges(): void {
        // -->Init: options on direction change
        this.initOptions();

        // -->Hide: carousel temporarily
        this.showCarousel = false;
        // -->Detect: changes
        this.cd.detectChanges();
        // -->Show: carousel again
        this.showCarousel = true;
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
