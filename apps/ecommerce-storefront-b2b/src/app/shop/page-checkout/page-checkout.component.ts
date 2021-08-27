import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DOCUMENT } from "@angular/common";
import { TranslateService } from '@ngx-translate/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from "ngx-toastr";
import { merge, Subject, Subscription } from 'rxjs';
import {debounceTime, distinctUntilChanged, filter, takeUntil} from 'rxjs/operators';
import { NaoUserAccessService, NaoUsersInterface } from "@naologic/nao-user-access";
import { CartService } from '../../services/cart.service';
import { UrlService } from '../../services/url.service';
import { AppService } from "../../app.service";
import { ECommerceService } from "../../e-commerce.service";
import { TermsModalComponent } from '../_parts/terms-modal/terms-modal.component';

export type paymentMethods = 'cheque' | 'card' | 'wire' | 'online-bank-payment';

@Component({
    selector: 'app-page-checkout',
    templateUrl: './page-checkout.component.html',
    styleUrls: ['./page-checkout.component.scss'],
})
export class PageCheckoutComponent implements OnInit, OnDestroy {
    private destroy$: Subject<void> = new Subject<void>();
    private subs = new Subscription();
    private checkOrderSubs = new Subscription();

    public formGroup: FormGroup;
    public checkoutInProgress = false;
    public addresses: NaoUsersInterface.Address[] = [];
    public shippingMethods: any[] = []
    public successOrder = false;
    public checkOrderProgress = false;
    public allowedPaymentMethodsForRedirect: paymentMethods[] = ['card', 'online-bank-payment'];
    public payments = [];
    public summary = {
        count: 0,
        shipping: 0,
        taxes: 0,
        total: 0
    }

    constructor(
        private modalService: BsModalService,
        private router: Router,
        private translate: TranslateService,
        public url: UrlService,
        public eCommerceService: ECommerceService,
        public cart: CartService,
        public appService: AppService,
        private naoUsersService: NaoUserAccessService,
        private toastr: ToastrService,
        @Inject(DOCUMENT) private document: Document
    ) {
        // -->Init: formGroup
        this.formGroup = new FormGroup({
            billingAddressId: new FormControl(null, {validators: [Validators.required]}),
            shippingAddressId: new FormControl(null, {validators: [Validators.required]}),
            shippingMethod: new FormControl(null, {validators: [Validators.required]}),
            paymentMethod: new FormControl(null),
            customerPurchaseOrder: new FormControl(null),
            agree: new FormControl(false, {validators: [Validators.requiredTrue]}),
        });
    }

    public ngOnInit(): void {
        this.successOrder = false;
        // -->Get: linked doc
        const linkedDoc = this.naoUsersService.linkedDoc.getValue();
        // -->Set: allowed payment methods
        const allowedPaymentMethods = Array.isArray(linkedDoc?.data?.allowedPaymentMethods) ? linkedDoc?.data?.allowedPaymentMethods : [];
        // -->Set: addresses
        this.addresses = linkedDoc?.data?.addresses || [];
        // -->Set: info
        const appInfo = this.appService.appInfo.getValue();
        // -->Set: shipping methods
        this.shippingMethods = appInfo?.shippingMethods || [];

        // -->Set: billingAddressId default
        this.formGroup.get('billingAddressId').patchValue(this.addresses.length ? this.addresses[0].id: null);
        // -->Set: billingAddressId default
        this.formGroup.get('shippingAddressId').patchValue(this.addresses.length ? this.addresses[0].id: null);
        // -->Set: shippingMethod default
        this.formGroup.get('shippingMethod').patchValue(this.shippingMethods.length ? this.shippingMethods[0].id: null);

        // -->Check: payment methods
        if (allowedPaymentMethods.length) {
            // -->Set: a default payment method
            this.formGroup.get('paymentMethod').setValue(allowedPaymentMethods[0]);
            // -->Set: payments
            allowedPaymentMethods.forEach(method => {
                switch (method as paymentMethods) {
                    case 'cheque':
                        this.payments.push(
                            {
                                name: 'cheque',
                                label: 'TEXT_PAYMENT_CHECK_LABEL',
                                description: 'TEXT_PAYMENT_CHECK_DESCRIPTION',
                            }
                        );
                        break;
                    case 'card':
                        this.payments.push(
                            {
                                name: 'card',
                                label: 'TEXT_PAYMENT_CARD_LABEL',
                                description: 'TEXT_PAYMENT_CARD_DESCRIPTION',
                            }
                        );
                        break;
                    case 'online-bank-payment':
                        this.payments.push(
                            {
                                name: 'online-bank-payment',
                                label: 'TEXT_PAYMENT_BANK_LABEL',
                                description: 'TEXT_PAYMENT_BANK_DESCRIPTION',
                            }
                        );
                        break;
                    case 'wire':
                        this.payments.push(
                            {
                                name: 'wire',
                                label: 'TEXT_PAYMENT_WIRE_LABEL',
                                description: 'TEXT_PAYMENT_WIRE_DESCRIPTION',
                            }
                        );
                        break;
                }
               })
        }

        // -->Check: order
        this.checkOrder()
        // -->Subscribe: to formGroup changes and check order again
        this.subs.add(
            merge(
                this.formGroup.get('billingAddressId').valueChanges,
                this.formGroup.get('shippingAddressId').valueChanges,
                this.formGroup.get('shippingMethod').valueChanges
            ).pipe(
                debounceTime(100),
                distinctUntilChanged())
                .subscribe(() => {
                this.checkOrder();
            })
        )
        // -->Check: if cart is empty and redirect
        this.cart.quantity$.pipe(
            filter(x => x === 0 && this.successOrder === false),
            takeUntil(this.destroy$),
        ).subscribe(() => this.router.navigateByUrl('/shop/cart').then());

    }

    /**
     * Check: order and set taxes
     */
    public checkOrder(): void {
        if (this.checkOrderSubs) {
            this.checkOrderSubs.unsubscribe();
        }
        // -->Start: progress
        this.checkOrderProgress = true;
        // -->Get: order
        const order = this.formGroup.value;
        // -->Set: orderLines
        const orderLines = this.cart.items.map(item => {
            return {
                productId: item.product._id,
                variantId: item.variant.id,
                quantity: item.quantity
            }
        });
        // -->Set: data
        const data$ = { ...order, orderLines }
        // -->Start: verify the order
        this.checkOrderSubs = this.eCommerceService.verifyCheckout(data$).subscribe(
            (data) => {
                // -->Enable
                if (data && data.ok) {
                    // -->Set: summary
                    this.summary = data.data?.summary
                } else {
                    // -->Show: toaster
                    this.toastr.error(this.translate.instant('ERROR_API_REQUEST'));
                }
                // -->Start: progress
                this.checkOrderProgress = false;
            }, (err) => {
                // -->Show: toaster
                this.toastr.error(this.translate.instant('ERROR_API_REQUEST'));
                // -->Start: progress
                this.checkOrderProgress = false;
            });
    }

    /**
     * Open: modal with terms
     */
    public showTerms(event: MouseEvent): void {
        event.preventDefault();

        this.modalService.show(TermsModalComponent, { class: 'modal-lg' });
    }

    /**
     * Create: order
     */
    public createOrder(): void {
        if (!this.checkData()) {
            return;
        }

        this.checkout();
    }

    /**
     * Checkout
     */
    private checkout(): void {
        // -->Start: progress
        this.checkoutInProgress = true;
        // -->Get: payment method
        const paymentMethod: paymentMethods = this.formGroup.get('paymentMethod').value;
        // -->Get: order
        const order = this.formGroup.value;

        // -->Set: orderLines
        const orderLines = this.cart.items.map(item => {
            return {
                productId: item.product._id,
                variantId: item.variant.id,
                quantity: item.quantity
            }
        });

        // -->Set: data
        const data$ = { ...order, orderLines }
        // -->Complete: checkout order
        this.eCommerceService.completeCheckout(data$).toPromise()
            .then((res) => {
                if (res && res.ok && res.data?.invoiceId) {
                    setTimeout(() => {
                        // -->Check: if the payment method needs redirect
                        if (this.allowedPaymentMethodsForRedirect.includes(paymentMethod)) {
                            // -->Redirect: to the invoice link with target blank
                            this.document.location.href = res.data.invoiceLink
                        }
                    }, 1500);
                    // -->Show: success order
                    this.successOrder = true;
                    // -->Clear: cart
                    this.cart.clearCart();
                    // -->Done: progress
                    this.checkoutInProgress = false;

                } else {
                    // -->Show: toaster
                    this.toastr.error(this.translate.instant('ERROR_API_REQUEST'));
                    // -->Done: progress
                    this.checkoutInProgress = false;
                }
            })
            .catch((err) => {
                // -->Show: toaster
                this.toastr.error(this.translate.instant('ERROR_API_REQUEST'));
                // -->Done: progress
                this.checkoutInProgress = false;
            });
    }

    /**
     * Mark: all controls as touched
     */
    private markAllAsTouched(): void {
        this.formGroup.markAllAsTouched();
    }

    /**
     * Check: data
     */
    private checkData(): boolean {
        this.markAllAsTouched();

        if (this.formGroup.invalid) {
            alert(this.translate.instant('ERROR_CHECKOUT'));
        }

        return this.formGroup.valid;
    }


    public ngOnDestroy(): void {
        this.subs.unsubscribe();
        this.destroy$.next();
        this.destroy$.complete();
    }
}
