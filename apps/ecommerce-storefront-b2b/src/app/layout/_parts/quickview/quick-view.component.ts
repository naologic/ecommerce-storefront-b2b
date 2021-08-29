import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Subject, Subscription, timer } from 'rxjs';
import { filter, finalize, switchMap, takeUntil } from 'rxjs/operators';
import { NaoSettingsInterface } from "@naologic/nao-interfaces";
import { NaoUserAccessService } from "@naologic/nao-user-access";
import { QuickviewService } from '../../../services/quickview.service';
import { UrlService } from '../../../services/url.service';
import { CartService } from '../../../services/cart.service';
import { AppService } from "../../../app.service";
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Product } from '../../../interfaces/product';

@Component({
    selector: 'app-quickview',
    templateUrl: './quick-view.component.html',
    styleUrls: ['./quick-view.component.scss'],
})
export class QuickViewComponent implements OnDestroy, AfterViewInit, OnInit {
    private destroy$: Subject<void> = new Subject();
    private subs = new Subscription();

    public appSettings: NaoSettingsInterface.Settings;
    public showGallery = false;
    public product: Product | null = null;
    public form!: FormGroup;
    public addToCartInProgress = false;
    public variantIndex = 0;
    public isLoggedIn = false;

    @ViewChild('modal') modal!: ModalDirective;

    constructor(
        private fb: FormBuilder,
        private quickview: QuickviewService,
        private translate: TranslateService,
        private cart: CartService,
        private router: Router,
        public url: UrlService,
        private appService: AppService,
        private naoUsersService: NaoUserAccessService,
    ) {
    }

    public ngOnInit(): void {
        // -->Set: app settings
        this.appSettings = this.appService.settings.getValue();
        // -->Subscribe: to user LoggedIn state changes
        this.naoUsersService.isLoggedIn$.subscribe((value) => {
            this.isLoggedIn = value;
        });

    }

    public ngAfterViewInit(): void {
        this.quickview.show$.pipe(
            switchMap(product => {
                // -->Show: modal
                this.modal.show();
                // -->Set: product
                this.product = product;

                this.form = this.fb.group({
                    options: [{}],
                    quantity: [1, [Validators.required]],
                });

                // -->Subscribe: to options change and change the variant id
                this.subs.add(
                    this.form.get('options').valueChanges.subscribe(value => {
                        // -->Match: search for variant index
                        const index = this.product.data.variants.findIndex(v => v.id === value?.variantId);
                        // -->Set: variant index
                        if (index > -1) {
                            this.variantIndex = index;
                        }
                    })
                )

                // -->Wait: for content to be rendered (150 = BACKDROP_TRANSITION_DURATION)
                return timer(150);
            }),
            takeUntil(this.destroy$),
        ).subscribe(() => {
            // -->Show: gallery after content is rendered
            this.showGallery = this.product !== null;
        });

        // -->Hide: modal when navigating away
        this.router.events.pipe(
            // -->Emit: on NavigationStart router event
            filter(event => event instanceof NavigationStart),
            takeUntil(this.destroy$),
        ).subscribe(() => {
            // -->Check: if modal is shown
            if (this.modal && this.modal.isShown) {
                // -->Hide: modal
                this.modal.hide();
            }
        });

        // -->Clean: up after modal closes
        this.modal.onHidden.pipe(takeUntil(this.destroy$)).subscribe(() => {
            // -->Reset: product
            this.product = null;
            // -->Hide: product gallery
            this.showGallery = false;
        });
    }

    /**
     * Add: product variant to cart
     */
    public addToCart(): void {
        // -->Check: product and add to cart action state
        if (!this.product || this.addToCartInProgress) {
            return;
        }

        // -->Set: product
        const product = this.product;

        // -->Check: product quantity
        if (this.form.get('quantity')!.invalid) {
            alert(this.translate.instant('ERROR_ADD_TO_CART_QUANTITY'));
            return;
        }
        // -->Check: product options
        if (this.form.get('options')!.invalid) {
            alert(this.translate.instant('ERROR_ADD_TO_CART_OPTIONS'));
            return;
        }

        // -->Get: product variant
        const variant = this.product?.data?.variants[this.variantIndex];
        // -->Check: variant
        if (!variant) {
            return;
        }

        // -->Start: loading
        this.addToCartInProgress = true;

        // -->Add: variant to cart
        this.cart.add(product, variant, this.form.get('quantity')!.value).pipe(
            finalize(() => {
                // -->Done: loading
                this.addToCartInProgress = false
            }),
        ).subscribe();
    }

    public ngOnDestroy(): void {
        this.subs.unsubscribe();
        this.destroy$.next();
        this.destroy$.complete();
    }
}
