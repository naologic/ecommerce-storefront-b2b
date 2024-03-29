import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { Subject, Subscription } from "rxjs";
import { finalize } from "rxjs/operators";
import { NaoSettingsInterface } from "../../nao-interfaces";
import { UrlService } from "../../services/url.service";
import { CartService } from "../../services/cart.service";
import { AppService } from "../../app.service";
import { ECommerceService } from "../../e-commerce.service";
import { NaoUserAccessService } from "../../nao-user-access";
import { Product } from "../../interfaces/product";
import { JsonLdService } from "../../shared/seo-helper/json-ld.service";
import { appInfo$ } from "../../../app.static";

export type PageProductLayout = "sidebar" | "full";

@Component({
  selector: "app-page-product",
  templateUrl: "./page-product.component.html",
  styleUrls: ["./page-product.component.scss"],
})
export class PageProductComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  private subs = new Subscription();
  private formSubs = new Subscription();
  // -->Based on this index we show specifications and price
  public variantIndex = 0;
  public appSettings: NaoSettingsInterface.Settings;
  public product!: Product;
  public spec: { name: string, value: any }[] = [];
  public form!: FormGroup;
  public addToCartInProgress = false;
  public isLoggedIn = false;
  public docId;

  /**
   * Key advantages
   */
  public keyAdvantages: {
    show: boolean
    title?: string;
    description?: string;
    items: any[];
  } = {
    show: false,
    items: []
  }


  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private translate: TranslateService,
    private cart: CartService,
    public url: UrlService,
    private readonly jsonLdService: JsonLdService,
    private appService: AppService,
    private eCommerceService: ECommerceService,
    private naoUsersService: NaoUserAccessService,
    private toastr: ToastrService,
  ) {
  }


  public ngOnInit(): void {
    // -->Set: app settings
    this.appSettings = this.appService.settings.getValue();
    // -->Check: if the user is logged in
    this.isLoggedIn = this.naoUsersService.isLoggedIn();
    // -->Subscribe: to route params change
    this.route.params.subscribe(params => {
        // -->Set: docId
        this.docId = params.productId;
        // -->Refresh
        this.refresh();
      },
    );

    this.form = this.fb.group({
      options: [{}],
      quantity: [1, [Validators.required]],
    });
    // -->Subscribe: to appInfo changes
    this.subs.add(
      appInfo$.subscribe((value) => {
        // -->Get: company information data
        const companyInformationData = value?.shopInfo?.companyInformation?.data;

        /**
         * Set: key advantages
         */
        this.keyAdvantages = {
          show: companyInformationData?.showKeyAdvantages || false,
          title: companyInformationData?.keyAdvantagesTitle || '',
          description: companyInformationData?.keyAdvantagesDescription || '',
          items: Array.isArray(companyInformationData?.keyAdvantages) ? companyInformationData?.keyAdvantages : []
        }
      }),
    );
  }


  /**
   * Refresh: product specifications
   */
  public refresh(): void {
    if (!this.docId) {
      // -->Redirect
      this.router.navigateByUrl(this.url.allProducts()).then();
      return;
    }
    this.formSubs.unsubscribe();
    this.formSubs = new Subscription()
    // -->Execute:
    this.eCommerceService.productsGet(this.docId).subscribe(res => {
      // -->Set: data
      this.product = res?.data[0] || null;
      // -->Check: product
      if (!this.product || !this.product.data) {
        // -->Redirect
        this.router.navigateByUrl("/404").then();
      } else {
        // -->Set: meta
        this.setMeta();

        // -->Refresh: specifications
        this.refreshSpecifications();

        // -->Subscribe: to options change and change the variant id
        this.formSubs.add(
          this.form.get("options").valueChanges.subscribe(value => {
            // -->Match: search for variant index
            const index = this.product.data.variants.findIndex(v => v.id === value?.variantId);
            // -->Set: variant index
            if (index > -1) {
              this.variantIndex = index;
            }
            // -->Refresh: specifications
            this.refreshSpecifications();
          }),
        );
      }

    }, err => {
      // -->Show: toaster
      this.toastr.error(this.translate.instant("ERROR_API_REQUEST"));
    });
  }


  /**
   * Set meta tags and description
   */
  public setMeta(): void {
    if (!this.product?.data || !this.product?.data?.name) {
      return;
    }

    // -->Set: metas
    this.appService.setMetas({
      title: this.product.data.shortDescription ? `${this.product.data?.name} - ${this.product.data.shortDescription}` : `${this.product.data?.name}`,
      description: this.product.data?.description || this.product.data?.name,
      twitterDescription: this.product.data?.description || this.product.data?.name,
      ogDescription: this.product.data?.description || this.product.data?.name,
      shareImg: (this.product.data?.images && this.product.data?.images[0].cdnLink) || "assets/images/image-not-available.png",
    });

    // -->Set: title
    this.appService.setTitle(this.product.data?.name);

    // -->Set: raw json+ld data
    this.jsonLdService.setRawData(
      {
        "@context": "http://schema.org",
        "@type": "WebApplication",
        operatingSystem: "All",
        applicationCategory: "https://schema.org/BusinessApplication",
        name: this.product.data?.name,
        offers: {
          "@type": "Offer",
          price: 0,
          priceCurrency: "USD",
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.7",
          reviewCount: "19",
        },
      },
    );
  }


  /**
   * Add: product variant to card
   */
  public addToCart(): void {
    if (this.addToCartInProgress) {
      return;
    }
    // -->Check: quantity
    if (this.form.get("quantity")!.invalid) {
      this.toastr.error(this.translate.instant("ERROR_ADD_TO_CART_QUANTITY"));
      return;
    }
    // -->Check: options
    if (this.form.get("options")!.invalid) {
      this.toastr.error(this.translate.instant("ERROR_ADD_TO_CART_OPTIONS"));
      return;
    }

    const variant = this.product.data.variants[this.variantIndex];
    // -->Check: variant
    if (!variant) {
      this.toastr.error(this.translate.instant("ERROR_ADD_TO_CART_VARIANT"));
      return;
    }

    // -->Start: loading
    this.addToCartInProgress = true;

    // -->Add: variant to the cart
    this.cart.add(this.product, variant, this.form.get("quantity")!.value).pipe(
      finalize(() => {
        // -->Done: loading
        this.addToCartInProgress = false;
      }),
    ).subscribe();
  }


  /**
   * Refresh: specifications based on new variant
   */
  private refreshSpecifications(): void {
    // -->Set: spec
    let variant = this.product?.data?.variants[this.variantIndex > -1 ? this.variantIndex : 0];
    if (variant) {
      const dimensionAttributes = [];

      // -->Check: height
      if (variant.height) {
        dimensionAttributes.push({
          name: this.translate.instant("VARIANT_SPECIFICATION_HEIGHT"),
          value: `${variant.height} ${variant.dimensionUOM}`,
        });
      }
      // -->Check: width
      if (variant.width) {
        dimensionAttributes.push({
          name: this.translate.instant("VARIANT_SPECIFICATION_WIDTH"),
          value: `${variant.width} ${variant.dimensionUOM}`,
        });
      }
      // -->Check: depth
      if (variant.depth) {
        dimensionAttributes.push({
          name: this.translate.instant("VARIANT_SPECIFICATION_DEPTH"),
          value: `${variant.depth} ${variant.dimensionUOM}`,
        });
      }
      // -->Check: weight
      if (variant.weight) {
        dimensionAttributes.push({
          name: this.translate.instant("VARIANT_SPECIFICATION_WEIGHT"),
          value: `${variant.weight} ${variant.weightUOM}`,
        });
      }
      // -->Check: volume
      if (variant.volume) {
        dimensionAttributes.push({
          name: this.translate.instant("VARIANT_SPECIFICATION_VOLUME"),
          value: `${variant.volume} ${variant.volumeUOM}`,
        });
      }
      // -->Set: weight spec
      this.spec = dimensionAttributes;
    }
  }


  public ngOnDestroy() {
    this.subs.unsubscribe();
    this.formSubs.unsubscribe();
  }
}
