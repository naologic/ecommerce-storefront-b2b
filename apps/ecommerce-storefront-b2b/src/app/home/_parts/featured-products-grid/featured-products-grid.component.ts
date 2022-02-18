import { SimpleChanges } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '../../../interfaces/product';
import { QuickviewService } from '../../../services/quickview.service';
import { UrlService } from '../../../services/url.service';

@Component({
    selector: 'app-featured-products-grid',
    templateUrl: './featured-products-grid.component.html',
    styleUrls: ['./featured-products-grid.component.scss'],
})
export class FeaturedProductsGridComponent {

    @Input() product!: Product | any;

    /**
     * List of products
     */
    @Input() public products: Product[] = [];
    /**
     * Block title
     */
    @Input() public blockTitle: string = '';
    /**
     * Loading
     */
    @Input() public loading = false;
    // @Input() @HostBinding('attr.data-layout') layout: BlockProductsCarouselLayout = 'grid-4';

    // get productCardLayout(): ProductCardLayout {
    //     return productCardLayoutMap[this.layout];
    // }
    //
    // get productCardExclude(): ProductCardElement[] {
    //     return productCardExcludeMap[this.productCardLayout];
    // }
    public showingQuickview = false;

    constructor(public url: UrlService,      
         private router: Router,
         private quickViewService: QuickviewService,
         private cd: ChangeDetectorRef,

         ) { }

    public redirectToAllProducts(): void {
        // -->Redirect: to shop
        this.router.navigateByUrl(this.url.allProducts(), { state: { resetFilters: true } }).then();
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

    public showQuickView(product: Product): void {
        
        // -->Check: if quickview is being shown already
        if (this.showingQuickview) {
            return;
        }

        // -->Start: loading
        this.showingQuickview = true;
        // -->Show: product quickview
        this.quickViewService.show(product).subscribe({
            complete: () => {

                // -->Done: loading
                this.showingQuickview = false;
                // -->Mark: as changed
                this.cd.markForCheck();
            },
        });
    }

}
