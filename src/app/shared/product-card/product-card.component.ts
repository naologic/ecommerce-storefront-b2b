import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostBinding,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges
} from "@angular/core";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { NaoSettingsInterface } from "../../nao-interfaces";
import { CurrencyService } from "../currency/services/currency.service";
import { UrlService } from "../../services/url.service";
import { QuickviewService } from "../../services/quickview.service";
import { AppService } from "../../app.service";
import { Product, ProductAttribute } from "../../interfaces/product";
import { NaoUserAccessService } from "../../nao-user-access";

export type ProductCardElement = "actions" | "status-badge" | "meta" | "features" | "buttons" | "list-buttons";

export type ProductCardLayout = "grid" | "list" | "table" | "horizontal";

@Component({
  selector: "app-product-card",
  templateUrl: "./product-card.component.html",
  styleUrls: ["./product-card.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductCardComponent implements OnChanges, OnInit, OnDestroy {
  /**
   * Product
   */
  @Input() public product!: Product | any;
  /**
   * Layout type - used for setting the right class
   */
  @Input() public layout?: ProductCardLayout;
  /**
   * Exclude: sections from view
   */
  @Input() public exclude: ProductCardElement[] = [];
  /**
   * By default you have the product card class
   */
  @HostBinding("class.product-card") classProductCard = true;

  /**
   * todo
   */
  @HostBinding("class.product-card--layout--grid") get classProductCardLayoutGrid(): boolean {
    return this.layout === "grid";
  }
  /**
   * todo
   */
  @HostBinding("class.product-card--layout--list") get classProductCardLayoutList(): boolean {
    return this.layout === "list";
  }
  /**
   * todo
   */
  @HostBinding("class.product-card--layout--table") get classProductCardLayoutTable(): boolean {
    return this.layout === "table";
  }
  /**
   * todo
   */
  @HostBinding("class.product-card--layout--horizontal") get classProductCardLayoutHorizontal(): boolean {
    return this.layout === "horizontal";
  }
  /**
   * App settings for showing/hiding buttons and sections
   */
  public appSettings: NaoSettingsInterface.Settings;
  /**
   * Show: quick view button
   */
  public showingQuickView = false;
  /**
   * @WIP
   */
  public featuredAttributes: ProductAttribute[] = [];
  /**
   * Flag: to show if we are logged in
   */
  public isLoggedIn = false;

  private destroy$: Subject<void> = new Subject();

  constructor(
    private cd: ChangeDetectorRef,
    private quickViewService: QuickviewService,
    public currency: CurrencyService,
    public url: UrlService,
    private appService: AppService,
    private naoUsersService: NaoUserAccessService
  ) {
  }


  public ngOnInit(): void {
    // -->Set: app settings
    this.appSettings = this.appService.settings.getValue();
    // -->Check: if the user is logged in
    this.isLoggedIn = this.naoUsersService.isLoggedIn();
    // -->Subscribe: to currency changes
    this.currency.changes$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      // -->Mark: as changed
      this.cd.markForCheck();
    });
  }


  public ngOnChanges(changes: SimpleChanges): void {
    if (changes["product"] && changes["product"].currentValue) {

      this.product = changes["product"].currentValue;
      // this.featuredAttributes = this.product.attributes.filter(x => x.featured);

      // -->Calculate: min and max price for this product
      const minPrice = this.product?.data?.variants?.reduce((min, variant) => (variant.price < min ? variant.price : min), this.product.data.variants[0].price);
      const maxPrice = this.product?.data?.variants?.reduce((max, variant) => (variant.price > max ? variant.price : max), this.product.data.variants[0].price);
      // -->Set: min and max price
      this.product.minPrice = minPrice;
      this.product.maxPrice = maxPrice;
    }
  }


  /**
   * Show: product quick-view
   */
  public showQuickView(): void {
    // -->Check: if quick-view is being shown already
    if (this.showingQuickView) {
      return;
    }

    // -->Start: loading
    this.showingQuickView = true;
    // -->Show: product quick-view
    this.quickViewService.show(this.product).subscribe({
      complete: () => {
        // -->Done: loading
        this.showingQuickView = false;
        // -->Mark: as changed
        this.cd.markForCheck();
      }
    });
  }


  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
