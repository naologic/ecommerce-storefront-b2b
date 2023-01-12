import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Product } from '../../interfaces/product';
import { AppService } from "../../app.service";
import { UrlService } from "../../services/url.service";
import { ProductsCarouselData } from '../home.interface';
import {appInfo$} from "../../../app.static";

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
    private subs = new Subscription();
    public generalSettings;

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
            appInfo$.subscribe((value) => {
                // -->Set: Primary featured product
                this.primaryFeaturedProduct = value?.shopInfo?.featuredItems?.primaryFeaturedProduct || {};
                // -->Set: featured products
                this.featuredProducts.products = value?.shopInfo?.featuredItems?.featuredProducts || [];
                // -->Set: generalSettings info
                this.generalSettings = value?.shopInfo?.general;
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



    public ngOnDestroy(): void {
        this.subs.unsubscribe();
    }
}
