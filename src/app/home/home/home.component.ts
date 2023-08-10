import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { UrlService } from "../../services/url.service";
import { appInfo$ } from "../../../app.static";
import { nameToSlug } from "../../shared/functions/utils";


interface PageInfo {
  hero: {
    title?: string;
    description?: string;
    imageUrl?: string;
  },
  featuredCategories: {
    routerLink?: string;
    name?: string;
    description?: string;
  }[]
  mostSearchProducts: {
    name: string;
    routerLink: string;
  }[]
  keyAdvantages: {
    show: boolean
    title?: string;
    description?: string;
    items: any[];
  },
  productHits: {
    products: any[];
  },
  seasonalProducts: {
    products: any[];
  },
  bestSellingCategories: {
    categories: {
      name: string;
      itemsNo: number;
      imageUrl: string;
      routerLink: string;
    }[]
  },
  callToAction: {
    show: boolean,
    title: string,
    description: string,
    items: {
      title: string
      description: string
      icon: string
      button: string
    }[]
  },
  categoryExplainers: {
    show: boolean,
    categories: {
      name: string;
      description: string;
      buttonCopy: string;
      imageUrl: string;
      routerLink: string;
    }[]
  },
  partnerLogos: any[]
}


@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit, OnDestroy {
  /**
   * Home info
   */
  public pageInfo: PageInfo = {
    hero: {
      title: "",
      description: "",
      imageUrl: "",
    },
    featuredCategories: [],
    mostSearchProducts: [],
    keyAdvantages: {
      show: false,
      items: [],
    },
    productHits: {
      products: [],
    },
    seasonalProducts: {
      products: [],
    },
    bestSellingCategories: {
      categories: [],
    },
    categoryExplainers: {
      show: false,
      categories: [],
    },
    partnerLogos: [],
    callToAction: {
      show: false,
      title: '',
      description: '',
      items: []
    },
  };
  /**
   * Subs
   */
  private subs = new Subscription();


  constructor(
    public url: UrlService,
  ) {
  }

  public ngOnInit(): void {
    // -->Subscribe: to appInfo changes
    this.subs.add(
      appInfo$.subscribe((value) => {
        // -->Get: all categories
        const allCategories = value?.categories || [];
        // -->Get: featured items
        const featuredItems = value?.shopInfo?.featuredItems;
        /**
         * Set: hero section
         */
        this.pageInfo.hero = {
          title: featuredItems?.data?.heroTitle || "",
          description: featuredItems?.data?.heroDescription || "",
          imageUrl: featuredItems?.data?.heroImageUrl || "assets/images/image-not-available.png",
        };

        /**
         * Set: featured categories
         */
        this.pageInfo.featuredCategories = [];
        (featuredItems?.data?.primaryFeaturedCategories || []).map(item => {
          // -->Find: category
          const category = allCategories.find(f => f.docId === item.categoryId);
          if (category?.data?.name && category?.docId) {
            this.pageInfo.featuredCategories.push({
              name: category?.data?.name,
              description: category?.data?.description,
              routerLink: this.createCategoryLink(category?.data?.name, category?.docId),
            });
          }
        });

        /**
         * Set: product hits
         */
        this.pageInfo.productHits = {
          products: Array.isArray(featuredItems?.data?.productHits) ? featuredItems?.data?.productHits : [],
        };
        /**
         * Set: seasonal products
         */
        this.pageInfo.seasonalProducts = {
          products: Array.isArray(featuredItems?.data?.seasonalProducts) ? featuredItems?.data?.seasonalProducts : [],
        };
        /**
         * Set: most popular products
         */
        this.pageInfo.mostSearchProducts = [];
        if (Array.isArray(featuredItems?.data?.mostPopularProducts)) {
          featuredItems?.data?.mostPopularProducts.map(product => {
            if (product?.data?.name) {
              this.pageInfo.mostSearchProducts.push({
                name: product?.data?.name,
                routerLink: this.url.product(product),
              });
            }
          });
        }


        // -->Get: company information data
        const companyInformationData = value?.shopInfo?.companyInformation?.data;

        /**
         * Set: key advantages
         */
        this.pageInfo.keyAdvantages = {
          show: companyInformationData?.showKeyAdvantages || false,
          title: companyInformationData?.keyAdvantagesTitle || "",
          description: companyInformationData?.keyAdvantagesDescription || "",
          items: Array.isArray(companyInformationData?.keyAdvantages) ? companyInformationData?.keyAdvantages : [],
        };

        /**
         * Set: call to action
         */
        this.pageInfo.callToAction = {
          show: companyInformationData?.showCallToAction || false,
          title: companyInformationData?.callToActionTitle || "",
          description: companyInformationData?.callToActionDescription || "",
          items: Array.isArray(companyInformationData?.callToActionOptions) ? companyInformationData?.callToActionOptions : [],
        }

        /**
         * Set: category explainers
         */
        this.pageInfo.categoryExplainers = {
          show: featuredItems.data.showCategoryExplainers || false,
          categories: []
        };
        (featuredItems?.data?.categoryExplainers || []).map(item => {
          // -->Find: category
          const category = allCategories.find(f => f.docId === item.categoryId);
          if (category?.data?.name && category?.docId) {
            this.pageInfo.categoryExplainers.categories.push({
              name: category?.data?.name,
              description: category?.data?.description,
              buttonCopy: item.buttonCopy || 'Learn more',
              imageUrl: category?.data?.imageUrl || 'assets/images/category-placeholder.png',
              routerLink: this.createCategoryLink(category?.data?.name, category?.docId),
            });
          }
        });


        /**
         * Set: best selling categories
         */
        this.pageInfo.bestSellingCategories.categories = [];
        (featuredItems?.data?.bestSellingCategories || []).map(item => {
          // -->Find: category
          const category = allCategories.find(f => f.docId === item.docId);
          if (category?.data?.name && category?.docId) {
            this.pageInfo.bestSellingCategories.categories.push({
              name: category?.data?.name,
              itemsNo: item.totalProducts || 0,
              imageUrl: category?.data?.imageUrl || 'assets/images/category-placeholder.png',
              routerLink: this.createCategoryLink(category?.data?.name, category?.docId),
            });
          }
        });

        /**
         * Set: partner logos
         */
        this.pageInfo.partnerLogos = Array.isArray(value?.shopInfo?.storefrontDisplay?.data?.partnerLogos) ? value?.shopInfo?.storefrontDisplay?.data?.partnerLogos : [];

      }),
    );
  }


  /**
   * Create: link for a category
   */
  private createCategoryLink(name: string, docId: string): string {
    return `/shop/category/${nameToSlug(name)}/${docId}/products`;
  }


  public ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
