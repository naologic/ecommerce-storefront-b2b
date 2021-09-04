import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subject, Subscription } from 'rxjs';
import { finalize, map, switchMap } from 'rxjs/operators';
import { NaoSettingsInterface } from "@naologic/nao-interfaces";
import { UrlService } from '../../services/url.service';
import { CartService } from '../../services/cart.service';
import { LanguageService } from '../../shared/language/services/language.service';
import { AppService } from "../../app.service";
import { ECommerceService } from "../../e-commerce.service";
import { NaoUserAccessService } from "../../../../../../libs/nao-user-access/src";
import { Product, ProductAttribute, ProductAttributeGroup } from '../../interfaces/product';
import { BreadcrumbItem } from '../_parts/breadcrumb/breadcrumb.component';
import { JsonLdService } from "../../shared/seo-helper/json-ld.service";

export type PageProductLayout = 'sidebar' | 'full';

export type PageProductSidebarPosition = 'start' | 'end';

export interface PageProductData {
    layout: PageProductLayout;
    sidebarPosition: PageProductSidebarPosition;
    product: Product;
}

@Component({
    selector: 'app-page-product',
    templateUrl: './page-product.component.html',
    styleUrls: ['./page-product.component.scss'],
})
export class PageProductComponent implements OnInit, OnDestroy {
    private destroy$: Subject<void> = new Subject<void>();
    private subs = new Subscription();

    @ViewChild('tabs', { read: ElementRef }) private tabsElementRef!: ElementRef;

    // -->Based on this index we show specifications and price
    public variantIndex = 0;
    public appSettings: NaoSettingsInterface.Settings;
    public breadcrumb$!: Observable<BreadcrumbItem[]>;
    public product!: Product;
    public featuredAttributes: ProductAttribute[] = [];
    public spec: ProductAttributeGroup[] = [];
    public form!: FormGroup;
    public addToCartInProgress = false;
    public isLoggedIn = false;
    public docId;

    private get tabsElement(): HTMLElement {
        return this.tabsElementRef.nativeElement;
    }

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private translate: TranslateService,
        private language: LanguageService,
        private cart: CartService,
        public url: UrlService,
        private readonly jsonLdService: JsonLdService,
        private appService: AppService,
        private eCommerceService: ECommerceService,
        private naoUsersService: NaoUserAccessService,
        private toastr: ToastrService
    ) { }


    public ngOnInit(): void {
        // -->Set: app settings
        this.appSettings = this.appService.settings.getValue();

        const data$ = this.route.data as Observable<PageProductData>;
        const product$ = data$.pipe(map((data: PageProductData) => data.product));
        // -->Check: if the user is logged in
        this.isLoggedIn = this.naoUsersService.isLoggedIn();

        this.breadcrumb$ = this.language.current$.pipe(
            switchMap(() => product$.pipe(
                map(product => {
                    // const categoryPath = product.categories ? getCategoryPath(product.categories[0]) : [];

                    return [
                        { label: this.translate.instant('LINK_HOME'), url: '/' },
                        { label: this.translate.instant('LINK_SHOP'), url: this.url.shop() },
                        // ...categoryPath.map(x => ({ label: x.name, url: this.url.category(x) })),
                        // { label: product.name, url: '/' },
                    ];
                }),
            )),
        );


        this.route.params.subscribe(params => {
            // -->Set: docId
            this.docId = params.productId;
            // -->Refresh
            this.refresh()
            }
        );

        this.form = this.fb.group({
            options: [{}],
            quantity: [1, [Validators.required]],
        });
    }


    /**
     * Refresh: product specifications
     */
    public refresh(): void {
        if (!this.docId) {
            // -->Redirect
            this.router.navigateByUrl(this.url.allProducts()).then();
            return
        }
        // -->Execute:
        this.eCommerceService.productsGet(this.docId).subscribe(res =>{
            // -->Set: data
            this.product = res?.data[0] || null;
            // -->Check: product
            if (!this.product || !this.product.data) {
                // -->Redirect
                this.router.navigateByUrl('/404').then();
            } else {
                // -->Set: meta
                this.setMeta();

                // -->Refresh: specifications
                this.refreshSpecifications();

                // -->Subscribe: to options change and change the variant id
                this.subs.add(
                    this.form.get('options').valueChanges.subscribe(value => {
                        // -->Match: search for variant index
                        const index = this.product.data.variants.findIndex(v => v.id === value?.variantId);
                        // -->Set: variant index
                        if (index > -1) {
                            this.variantIndex = index;
                        }
                        // -->Refresh: specifications
                        this.refreshSpecifications();
                    })
                )
            }

        }, err => {
            // -->Show: toaster
            this.toastr.error(this.translate.instant('ERROR_API_REQUEST'));
        })
    }


    /**
     * Set meta tags and description
     */
    public setMeta(): void {
        if (!this.product || !this.product.data) {
            return;
        }

        // -->Set: metas
        this.appService.setMetas({
            title: `${this.product.data?.name} - ${this.product.data.shortDescription}`,
            description: this.product.data?.description || this.product.data?.name,
            twitterDescription: this.product.data?.description || this.product.data?.name,
            ogDescription: this.product.data?.description || this.product.data?.name,
            shareImg: this.product.data?.images[0]
        });

        // -->Set: raw json+ld data
        this.jsonLdService.setRawData(
            {
                '@context': 'http://schema.org',
                '@type': 'WebApplication',
                operatingSystem: 'All',
                applicationCategory: 'https://schema.org/BusinessApplication',
                name: this.product.data?.name,
                offers: {
                    '@type': 'Offer',
                    price: 0,
                    priceCurrency: 'USD'
                },
                aggregateRating: {
                    '@type': 'AggregateRating',
                    ratingValue: '4.7',
                    reviewCount: '19'
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
        if (this.form.get('quantity')!.invalid) {
            this.toastr.error(this.translate.instant('ERROR_ADD_TO_CART_QUANTITY'));
            return;
        }
        // -->Check: options
        if (this.form.get('options')!.invalid) {
            this.toastr.error(this.translate.instant('ERROR_ADD_TO_CART_OPTIONS'));
            return;
        }

        const variant = this.product.data.variants[this.variantIndex];
        // -->Check: variant
        if (!variant) {
            this.toastr.error(this.translate.instant('ERROR_ADD_TO_CART_VARIANT'));
            return;
        }

        // -->Start: loading
        this.addToCartInProgress = true;

        // -->Add: variant to the cart
        this.cart.add(this.product, variant, this.form.get('quantity')!.value).pipe(
            finalize(() => {
                // -->Done: loading
                this.addToCartInProgress = false;
            })
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
                    name: this.translate.instant('VARIANT_SPECIFICATION_HEIGHT'),
                    value: `${variant.height} ${variant.dimensionUOM}`
                })
            }
            // -->Check: width
            if (variant.width) {
                dimensionAttributes.push({
                    name: this.translate.instant('VARIANT_SPECIFICATION_WIDTH'),
                    value: `${variant.width} ${variant.dimensionUOM}`
                })
            }
            // -->Check: depth
            if (variant.depth) {
                dimensionAttributes.push({
                    name: this.translate.instant('VARIANT_SPECIFICATION_DEPTH'),
                    value: `${variant.depth} ${variant.dimensionUOM}`
                })
            }
            // -->Check: weight
            if (variant.weight) {
                dimensionAttributes.push({
                    name: this.translate.instant('VARIANT_SPECIFICATION_WEIGHT'),
                    value: `${variant.weight} ${variant.weightUOM}`
                })
            }
            // -->Check: volume
            if (variant.volume) {
                dimensionAttributes.push({
                    name: this.translate.instant('VARIANT_SPECIFICATION_VOLUME'),
                    value: `${variant.volume} ${variant.volumeUOM}`
                })
            }

            //SPECIFICATION_DIMENSIONS
            // -->Set: weight spec
            this.spec = [
                {
                    name: this.translate.instant('VARIANT_SPECIFICATION_VOLUME'),
                    slug: "dimensions",
                    attributes: dimensionAttributes
                }
            ]
        }
    }

    /**
     * Scroll: to tabs
     */
    public scrollToTabs(): void {
        this.tabsElement.scrollIntoView({ behavior: 'smooth' });
    }


    public ngOnDestroy() {
        this.subs.unsubscribe();
    }
}
