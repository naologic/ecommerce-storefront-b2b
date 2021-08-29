import { Component, Inject, NgZone, OnDestroy, OnInit, PLATFORM_ID, Renderer2 } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { LanguageService } from './shared/language/services/language.service';
import { CartService } from './services/cart.service';
import { CompareService } from './services/compare.service';
import { MyListsService } from './services/my-lists.service';
import { AppService } from './app.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
    private destroy$: Subject<void> = new Subject<void>();

    public status : 'loading' | 'error' | 'done' = 'loading';

    constructor(
        @Inject(DOCUMENT) private document: Document,
        @Inject(PLATFORM_ID) private platformId: any,
        private renderer: Renderer2,
        private router: Router,
        private zone: NgZone,
        private language: LanguageService,
        private toastr: ToastrService,
        private cart: CartService,
        private compare: CompareService,
        private myLists: MyListsService,
        private translate: TranslateService,
        private appService: AppService
    ) {
        this.language.direction$.pipe(
            takeUntil(this.destroy$)
        ).subscribe(direction => {
            this.renderer.setAttribute(this.document.documentElement, 'dir', direction);
        });
    }

    public ngOnInit(): void {
        // -->Refresh: info
        this.appService.refreshInfo();

        if (isPlatformBrowser(this.platformId)) {

            this.zone.runOutsideAngular(() => {
                this.appService.appInfo.pipe(filter(info => info))
                    .subscribe((info) => {
                    // -->Done: loading
                    this.doneLoading();

                    // -->Set: status to done
                    this.status = 'done';
                }, (error) => {
                    // -->Done: loading
                    this.doneLoading();

                    // -->Set: status to error
                    this.status = 'error';
                });
            });
        }

        // -->Show: toaster when a variant is added to the cart
        this.cart.onAdding$.subscribe(variant => {
            this.toastr.success(
                this.translate.instant('TEXT_TOAST_PRODUCT_ADDED_TO_CART', { productName: variant?.variantName })
            );
        });

        // -->Show: toaster when a variant is added to compare
        this.compare.onAdding$.subscribe(variant => {
            this.toastr.success(
                this.translate.instant('TEXT_TOAST_PRODUCT_ADDED_TO_COMPARE', { productName: variant?.variantName })
            );
        });
        // -->Show: toaster if a variant was already added to compare
        this.compare.onAdded$.subscribe(variant => {
            this.toastr.info(
                this.translate.instant('TEXT_TOAST_PRODUCT_NOT_ADDED_TO_COMPARE', { productName: variant?.variantName })
            );
        });

        // -->Show: toaster when a variant is added to myLists
        this.myLists.onAdding$.subscribe(value => {
            this.toastr.success(
                this.translate.instant('TEXT_TOAST_PRODUCT_ADDED_TO_MY_LISTS', value)
            );
        });
        // -->Show: toaster if a variant was already added to myLists
        this.myLists.onAdded$.subscribe(value => {
            this.toastr.info(
                this.translate.instant('TEXT_TOAST_PRODUCT_ALREADY_EXISTS')
            );
        });
    }


    /**
     * Clean: up loading element
     */
    private doneLoading(): void {
        const preloaderElement = this.document.querySelector('.site-preloader');

        // -->Check: preloader
        if (!preloaderElement) {
            return;
        }

        // -->Listen: to transitionend event
        preloaderElement.addEventListener('transitionend', (event: Event) => {
            if (event instanceof TransitionEvent && event.propertyName === 'opacity') {
                // -->Remove: preloader element
                preloaderElement.remove();
                // -->Clear: preloader styles
                this.document.querySelector('.site-preloader-style')?.remove();
            }
        });
        preloaderElement.classList.add('site-preloader__fade');

        // Sometimes, due to unexpected behavior, the browser (in particular Safari) may not play the transition, which leads
        // to blocking interaction with page elements due to the fact that the preloader is not deleted.
        // The following block covers this case.
        if (getComputedStyle(preloaderElement).opacity === '0' && preloaderElement.parentNode) {
            preloaderElement.parentNode.removeChild(preloaderElement);
        }
    }


    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
