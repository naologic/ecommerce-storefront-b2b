import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  NgZone,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  ViewChild
} from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { BehaviorSubject, Observable, Subject, Subscription } from "rxjs";
import { filter, takeUntil } from "rxjs/operators";
import { fromOutsideClick } from "../../../shared/functions/rxjs/from-outside-click";
import { LayoutMobileMenuService } from "../../layout-mobile-menu.service";
import { CartService } from "../../../services/cart.service";
import { MyListsService } from "../../../services/my-lists.service";
import { NaoUserAccessService } from "../../../nao-user-access";
import { AppService } from "../../../app.service";
import { ShopProductService } from "../../../shop/shop-product.service";
import { appInfo$ } from "../../../../app.static";

@Component({
  selector: "app-mobile-header",
  templateUrl: "./mobile-header.component.html",
  styleUrls: ["./mobile-header.component.scss"]
})
export class MobileHeaderComponent implements OnInit, OnDestroy, AfterViewInit {
  private destroy$: Subject<void> = new Subject<void>();
  private subs = new Subscription();

  public companyLogo;
  public searchIsOpen = false;
  public searchPlaceholder$!: Observable<string>;
  public query$: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  public disableSearch$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  public isLoggedIn = false;

  @ViewChild("searchForm") searchForm!: ElementRef<HTMLElement>;
  @ViewChild("searchInput") searchInput!: ElementRef<HTMLElement>;
  @ViewChild("searchIndicator") searchIndicator!: ElementRef<HTMLElement>;

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private zone: NgZone,
    private translate: TranslateService,
    public menu: LayoutMobileMenuService,
    public cart: CartService,
    public myLists: MyListsService,
    private shopProductService: ShopProductService,
    private router: Router,
    private naoUsersService: NaoUserAccessService,
    public appService: AppService
  ) {
  }


  public ngOnInit(): void {
    this.searchPlaceholder$ = this.translate.stream("INPUT_SEARCH_PLACEHOLDER");

    // -->Subscribe: to user LoggedIn state changes
    this.subs.add(
      this.naoUsersService.isLoggedIn$.subscribe((value) => {
        this.isLoggedIn = value;
      })
    );

    // -->Subscribe: to searchTerm page option changes
    this.subs.add(
      this.shopProductService.optionsChange$.subscribe((value) => {
        // -->Check: searchTerm option
        if (value?.searchTerm) {
          this.query$.next(value.searchTerm);
          this.disableSearch$.next(true);
        } else {
          this.query$.next(null);
        }
      })
    );

    // -->Subscribe: to appInfo changes
    this.subs.add(
      appInfo$.subscribe(value => {
        // -->Set: companyLogo
        this.companyLogo = value?.shopInfo?.storefrontDisplay?.data?.companyLogo;
      })
    );
  }


  public ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    // -->Track: clicks in order to toggle the search section
    this.zone.runOutsideAngular(() => {
      fromOutsideClick([
        this.searchForm.nativeElement,
        this.searchIndicator.nativeElement
      ]).pipe(
        filter(() => this.searchIsOpen),
        takeUntil(this.destroy$)
      ).subscribe(() => {
        this.zone.run(() => this.closeSearch());
      });
    });
  }


  /**
   * Open: search section
   */
  public openSearch(): void {
    this.searchIsOpen = true;

    if (this.searchInput.nativeElement) {
      this.searchInput.nativeElement.focus();
    }
  }


  /**
   * Emit: search term updates
   */
  public onSearchKeyUp(searchInputValue: string): void {
    this.query$.next(searchInputValue);
    this.disableSearch$.next(searchInputValue === this.shopProductService.options.searchTerm);
  }


  /**
   * Search: term and redirect
   */
  public searchAndRedirect(): void {
    if (this.disableSearch$.getValue()) {
      return;
    }
    // -->Check: if the current route starts with shop
    if (!this.router.url?.startsWith("/shop/category")) {
      // -->Redirect: to shop
      this.router.navigateByUrl("/shop").then();
    }
    // -->Trigger: search
    this.shopProductService.setSearchTerm(this.query$.getValue());
    // -->Close: search
    this.closeSearch();
    // -->Disable: search until query changes
    this.disableSearch$.next(true);
  }


  /**
   * Close: search secton
   */
  public closeSearch(): void {
    this.searchIsOpen = false;
  }


  public ngOnDestroy(): void {
    this.subs.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
