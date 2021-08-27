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

        // data$.subscribe((data: PageProductData) => {
        //     this.layout = data.layout;
        //     this.sidebarPosition = data.sidebarPosition;
        //     this.product = data.product;
        //     this.featuredAttributes = this.product.attributes.filter(x => x.featured);
        //
        //     this.spec = this.product.type.attributeGroups.map(group => ({
        //         ...group,
        //         attributes: group.attributes.map(attribute => (
        //             this.product.attributes.find(x => x.slug === attribute) || null
        //         )).filter((x): x is ProductAttribute => x !== null),
        //     })).filter(x => x.attributes.length > 0);
        // });

        // todo: add breadcrumb in refresh
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

        // data$.pipe(
        //     map((data: PageProductData) => data.product),
        //     switchMap(product => {
        //         if (!product) {
        //             return of([]);
        //         }
        //
        //         return this.shop.getRelatedProducts(product._id, 8);
        //     }),
        //     takeUntil(this.destroy$),
        // ).subscribe(x => this.relatedProducts = x);

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
                this.router.navigateByUrl(this.url.allProducts()).then();
            } else {
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
            // todo: check error
        })
    }


    /**
     * Scroll: to tabs
     */
    public scrollToTabs(): void {
        this.tabsElement.scrollIntoView({ behavior: 'smooth' });
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


    public ngOnDestroy() {
        this.subs.unsubscribe();
    }
}
