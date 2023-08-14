import { Component, HostListener, Inject, NgZone, OnDestroy, OnInit, PLATFORM_ID, Renderer2 } from "@angular/core";
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subject } from "rxjs";
import { filter, takeUntil } from 'rxjs/operators';
import { LanguageService } from './shared/language/services/language.service';
import { CartService } from './services/cart.service';
import { CompareService } from './services/compare.service';
import { MyListsService } from './services/my-lists.service';
import { AppService } from './app.service';
import { appInfo$, AppStatic$ } from "../app.static";
import { AppInterface } from "../app.interface";
import { debounce } from "lodash";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  /**
   * Status
   */
  public status : 'loading' | 'error' | 'done' | 'downForMaintenance' = 'loading';
  /**
   * Down for maintenance message
   */
  public downForMaintenanceMessage!: string;
  /**
   * List: with all apple devices
   */
  private appleDevicesArr = ['MacIntel', 'MacPPC', 'Mac68K', 'Macintosh', 'iPhone', 'iPod', 'iPad', 'iPhone Simulator', 'iPod Simulator', 'iPad Simulator', 'Pike v7.6 release 92', 'Pike v7.8 release 517'];
  /**
   * Debouncer for resizing
   */
  private debouncedOnResize = debounce(() => this.updateWindowDetails(), 50, {});

  @HostListener('window:resize', ['$event'])
  private onResize(): void {
    this.debouncedOnResize();
  }

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
    // -->Update: window details
    this.updateWindowDetails();
  }

  public ngOnInit(): void {
    // -->Refresh: info
    this.appService.refreshInfo();
    if (isPlatformBrowser(this.platformId)) {
      this.zone.runOutsideAngular(() => {
        appInfo$.pipe(filter<any>(info => info)).subscribe((info: AppInterface.AppInfo) => {
          // -->Done: loading
          this.doneLoading();
          /**
           * Check: if we need to show the page for Down For Maintenance
           */
          if (typeof info?.shopInfo?.storefrontSettings?.data?.online === "boolean" && !info?.shopInfo?.storefrontSettings?.data?.online) {
            // -->Set: Maintenance message
            this.downForMaintenanceMessage = info?.shopInfo?.storefrontSettings?.data?.downForMaintenanceMessage || '';
            // -->Set: status to down for Maintenance
            this.status = 'downForMaintenance';
          } else {
            // -->Set: status to done
            this.status = 'done';
          }
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
        this.translate.instant('TEXT_TOAST_PRODUCT_ADDED_TO_CART', { productName: variant?.optionName })
      );
    });

    // -->Show: toaster when a variant is added to compare
    this.compare.onAdding$.subscribe(variant => {
      this.toastr.success(
        this.translate.instant('TEXT_TOAST_PRODUCT_ADDED_TO_COMPARE', { productName: variant?.optionName })
      );
    });
    // -->Show: toaster if a variant was already added to compare
    this.compare.onAdded$.subscribe(variant => {
      this.toastr.info(
        this.translate.instant('TEXT_TOAST_PRODUCT_NOT_ADDED_TO_COMPARE', { productName: variant?.optionName })
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

    // -->Update: window details
    this.updateWindowDetails();
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


  /**
   * Update window details
   */
  public updateWindowDetails(): void {
    if (typeof window !== 'undefined') {
      // -->Set: window details
      const windowDetails = {
        innerScreen: { width: window?.innerWidth || 0, height: window?.innerHeight || 0 },
        screen: { width: window?.screen?.width || 0, height: window?.screen?.height || 0 },
        devicePixelRatio: window?.devicePixelRatio || 1,
        isApple: window?.navigator && window?.navigator?.platform && this.appleDevicesArr.includes(window?.navigator.platform) || false
      };
      // -->Update: window details
      AppStatic$.windowDetails.next(windowDetails);
    }
  }



  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
