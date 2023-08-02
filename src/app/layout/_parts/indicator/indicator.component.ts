import { Component, ElementRef, Inject, Input, NgZone, OnDestroy, OnInit, PLATFORM_ID } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { isPlatformBrowser } from "@angular/common";
import { filter, takeUntil } from "rxjs/operators";
import { Subject, Subscription } from "rxjs";
import { fromOutsideClick } from "../../../shared/functions/rxjs/from-outside-click";
import { MyListsService } from "../../../services/my-lists.service";
import { CartService } from "../../../services/cart.service";
import { NaoUserAccessService } from "../../../nao-user-access";


@Component({
  selector: "app-indicator",
  templateUrl: "./indicator.component.html",
  styleUrls: ["./indicator.component.scss"],
  exportAs: "indicator"
})
export class IndicatorComponent implements OnInit, OnDestroy {
  /**
   * Type:
   */
  @Input() public type: "my-list" | "account" | "cart" = "my-list";
  /**
   * User data
   */
  public userData = null;
  /**
   * Open: content
   */
  public classIndicatorOpen: boolean = false;
  /**
   * Subscribers
   */
  private destroy$: Subject<void> = new Subject<void>();
  private subs = new Subscription();

  constructor(
    @Inject(PLATFORM_ID) private readonly platformId: any,
    private readonly zone: NgZone,
    private readonly elementRef: ElementRef<HTMLElement>,
    public readonly myLists: MyListsService,
    public readonly cart: CartService,
    private readonly naoUsersService: NaoUserAccessService
  ) {
  }

  public ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    // -->Subscribe: to user data
    this.subs.add(
      this.naoUsersService.userData.subscribe((userData) => {
        // -->Set: user data
        this.userData = userData;
      })
    )

    // -->Track: clicks in order to toggle the indicators section
    this.zone.runOutsideAngular(() => {
      fromOutsideClick(this.elementRef.nativeElement).pipe(
        filter(() => this.classIndicatorOpen),
        takeUntil(this.destroy$)
      ).subscribe(() => {
        this.zone.run(() => this.classIndicatorOpen = false);
      });
    });
  }


  /**
   * Toggle: indicators section
   */
  public onClick(event: MouseEvent): void {
    if (!event.cancelable) {
      return;
    }

    // -->Prevent: default action
    event.preventDefault();
    // -->Add: or remove indicator--open class
    this.classIndicatorOpen = !this.classIndicatorOpen;
  }

  /**
   * Close: indicators section
   */
  public close(): void {
    this.classIndicatorOpen = false;
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.subs.unsubscribe();
  }
}
