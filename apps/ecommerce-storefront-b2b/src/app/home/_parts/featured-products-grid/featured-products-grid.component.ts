import { Component, Input } from '@angular/core';
import { Product } from '../../../interfaces/product';

@Component({
    selector: 'app-featured-products-grid',
    templateUrl: './featured-products-grid.component.html',
    styleUrls: ['./featured-products-grid.component.scss'],
})
export class FeaturedProductsGridComponent {
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

    constructor() { }
}
