import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Product } from '../../interfaces/product';
import { AppService } from "../../app.service";
import { UrlService } from "../../services/url.service";
import { ProductsCarouselData } from '../home.interface';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
    private subs = new Subscription();

    public featuredProducts: ProductsCarouselData = {
        loading: false,
        products: []
    };
    public dataSub = new Subscription();
    public primaryFeaturedProduct: Product;

    constructor(
        private appService: AppService,
        public url: UrlService,
    ) { }

    public ngOnInit(): void {
        // -->Subscribe: to appInfo changes
        this.subs.add(
            this.appService.appInfo.subscribe(value => {
                // -->Set: Primary featured product
                this.primaryFeaturedProduct = value?.primaryFeaturedProduct || {};
                // -->Set: featured products
                this.featuredProducts.products = value?.featuredProducts || [];
            })
        )
    }

    // /**
    //  * Make: carousel data
    //  */
    // private makeCarouselData(groups: ProductsCarouselGroup[]): ProductsCarouselData {
    //     const subject = new BehaviorSubject<ProductsCarouselGroup>(groups[0]);
    //     const carouselData: ProductsCarouselData = {
    //         subject$: subject,
    //         products$: subject.pipe(
    //             filter(x => x !== null),
    //             tap(() => carouselData.loading = true),
    //             switchMap(group => group.products$),
    //             tap(() => carouselData.loading = false),
    //         ),
    //         loading: true,
    //         groups,
    //     };
    //
    //     return carouselData;
    // }

    // /**
    //  * Refresh: featured products
    //  * @WIP
    //  * TODO: get featured products and let user pick up to 10 featured products
    //  */
    // public refreshFeaturedProducts(): void{
    //     // // -->Prepare: query
    //     // const query = this.search.searchQuery$.getValue();
    //     // // -->Set: pagination options
    //     // query.options = {
    //     //     ...query.options,
    //     //     ...this.search.pageQuery$.getValue().options,
    //     //     sort: this.sort.sorts.getValue()
    //     // };
    //     // todo: add fetch
    //     const query = new QuickMongoQuery()
    //         .limit(10)
    //         .returnDataModel({ _id: 1, data: 1 })
    //         .done();
    //     // -->Start: loading
    //     this.featuredProducts.loading = true;
    //     this.ecommerceService.productsList(query).subscribe(res => {
    //         this.featuredProducts.products = res.data;
    //         this.featuredProducts.loading = false;
    //     }, err => err)
    // }

    public ngOnDestroy(): void {
        this.subs.unsubscribe();
    }
}
