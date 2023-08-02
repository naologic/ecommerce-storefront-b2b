import { Component, ElementRef, Inject, Input, NgZone, OnDestroy, OnInit, PLATFORM_ID } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import { Subject } from "rxjs";
import { filter, takeUntil } from "rxjs/operators";
import { fromOutsideClick } from "../../../shared/functions/rxjs/from-outside-click";
import { DepartmentsLink } from "../../../interfaces/departments-link";
import { Router } from "@angular/router";

@Component({
  selector: "app-header-menu-individual-category",
  templateUrl: "./header-menu-individual-category.component.html",
  styleUrls: ["./header-menu-individual-category.component.scss"]
})
export class HeaderMenuIndividualCategoryComponent implements OnInit, OnDestroy {
  /**
   * Current Item
   */
  @Input() public item?: DepartmentsLink;
  /**
   * Is Open
   */
  public isOpen = false;
  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private elementRef: ElementRef<HTMLElement>,
    private zone: NgZone,
    private router: Router
  ) {
  }

  public ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    // -->Track: clicks in order to toggle the departments section
    this.zone.runOutsideAngular(() => {
      fromOutsideClick(this.elementRef.nativeElement).pipe(
        filter(() => this.isOpen),
        takeUntil(this.destroy$)
      ).subscribe(() => {
        this.zone.run(() => this.isOpen = false);
      });
    });
  }

  /**
   * Toggle: departments section
   */
  public onClick() {
    this.isOpen = !this.isOpen;
  }


  /**
   * Close: departments section
   */
  public onItemClick(): void {
    this.isOpen = false;
  }

  /**
   * Redirect: and add reset filter state
   */
  public navigateAndResetFilters(url: string): void {
    if (!url) {
      return;
    }
    // -->Redirect: to the selected category
    this.router.navigateByUrl(url, { state: { resetFilters: true } }).then();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
