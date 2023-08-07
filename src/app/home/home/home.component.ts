import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { AppService } from "../../app.service";
import { UrlService } from "../../services/url.service";
import { appInfo$ } from "../../../app.static";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit, OnDestroy {
  private subs = new Subscription();
  public storefrontDisplay!: any;


  /**
   * Home info
   */
  public info = {
    hero: {
      title: 'Over 100k medical supplies instantly available',
      description: 'Your patients trust you to provide for them. You can trust us to provide the healthcare essentials you need.'
    },
    // todo: set css classes
    featuredCategories: [
      {
        routerLink: '/',
        cssClass: 'grid-element-1',
        title: 'Patient Care & Exam Room Supplies',
        description: 'Includes examination gloves, medical gowns, diagnostic tools, sterilization equipment, and other disposables needed in a clinical setting.'
      },
      {
        routerLink: '/',
        cssClass: 'grid-element-2 has-bg-gradient-4',
        title: 'Patient Care & Exam Room Supplies',
        description: 'Includes examination gloves, medical gowns, diagnostic tools, sterilization equipment, and other disposables needed in a clinical setting.'
      },
      {
        routerLink: '/',
        cssClass: 'grid-element-3',
        title: 'Patient Care & Exam Room Supplies',
        description: 'Includes examination gloves, medical gowns, diagnostic tools, sterilization equipment, and other disposables needed in a clinical setting.'
      },
      {
        routerLink: '/',
        cssClass: 'grid-element-4',
        title: 'Patient Care & Exam Room Supplies',
        description: 'Includes examination gloves, medical gowns, diagnostic tools, sterilization equipment, and other disposables needed in a clinical setting.'
      }
    ],
    // -->Most; searched products
    // todo
    mostSearchProducts: [
      { name: 'Syringes and needles', routerLink: '/' },
      { name: 'Syringes and needles', routerLink: '/' },
      { name: 'Syringes and needles', routerLink: '/' },
      { name: 'Syringes and needles', routerLink: '/' },
      { name: 'Syringes and needles', routerLink: '/' },
      { name: 'Syringes and needles', routerLink: '/' },
      { name: 'Syringes and needles', routerLink: '/' },
      { name: 'Syringes and needles', routerLink: '/' },
      { name: 'Syringes and needles', routerLink: '/' },
      { name: 'Syringes and needles', routerLink: '/' },
      { name: 'Syringes and needles', routerLink: '/' },
      { name: 'Syringes and needles', routerLink: '/' },
    ],
    // todo:
    kpiSection: {
      title: 'The Direct Med Advantage',
      subtitle: 'Learn why Direct Med Supplies is the only choice for your business'
    },
    featuredProducts: {
      products: []
    },
    seasonalProducts: {
      products: []
    },
    bestSellingCategories: {
      categories: [
        {
          name: 'Needles and syringes',
          itemsNo: 110,
          imageUrl: 'assets/images/icons/call.png',
          routerLink: '/'
        },
        {
          name: 'Needles and syringes',
          itemsNo: 110,
          imageUrl: 'assets/images/icons/call.png',
          routerLink: '/'
        },
        {
          name: 'Needles and syringes',
          itemsNo: 110,
          imageUrl: 'assets/images/icons/call.png',
          routerLink: '/'
        },
        {
          name: 'Needles and syringes',
          itemsNo: 110,
          imageUrl: 'assets/images/icons/call.png',
          routerLink: '/'
        },
        {
          name: 'Needles and syringes',
          itemsNo: 110,
          imageUrl: 'assets/images/icons/call.png',
          routerLink: '/'
        },
        {
          name: 'Needles and syringes',
          itemsNo: 110,
          imageUrl: 'assets/images/icons/call.png',
          routerLink: '/'
        },
        {
          name: 'Needles and syringes',
          itemsNo: 110,
          imageUrl: 'assets/images/icons/call.png',
          routerLink: '/'
        },
        {
          name: 'Needles and syringes',
          itemsNo: 110,
          imageUrl: 'assets/images/icons/call.png',
          routerLink: '/'
        },
        {
          name: 'Needles and syringes',
          itemsNo: 110,
          imageUrl: 'assets/images/icons/call.png',
          routerLink: '/'
        },
        {
          name: 'Needles and syringes',
          itemsNo: 110,
          imageUrl: 'assets/images/icons/call.png',
          routerLink: '/'
        }
      ]
    }
  }



  constructor(
    private appService: AppService,
    public url: UrlService,
  ) {
  }

  public ngOnInit(): void {
    // -->Subscribe: to appInfo changes
    this.subs.add(
      appInfo$.subscribe((value) => {
        // -->Set: featured products
        this.info.featuredProducts.products = Array.isArray(value?.shopInfo?.featuredItems?.featuredProducts) ? value.shopInfo.featuredItems.featuredProducts.filter(f => f) : [];
        this.info.seasonalProducts.products = Array.isArray(value?.shopInfo?.featuredItems?.featuredProducts) ? value.shopInfo.featuredItems.featuredProducts.filter(f => f) : [];
        // -->Set: StorefrontDisplay info
        this.storefrontDisplay = value?.shopInfo?.storefrontDisplay?.data;
      }),
    );
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
