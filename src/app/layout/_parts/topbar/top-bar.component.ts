import { Component } from "@angular/core";
import { appInfo$ } from "../../../../app.static";
import { Subscription } from "rxjs";
import { NaoUserAccessService } from "../../../nao-user-access";


@Component({
  selector: "app-top-bar",
  templateUrl: "./top-bar.component.html",
  styleUrls: ["./top-bar.component.scss"],
})
export class TopBarComponent {
  /**
   * Information for top nav
   */
  public topNavBar: {
    show: boolean,
    text: string,
    colorClass: "is-primary" | "is-text-3" | "is-purple-300" | "is-primary-600",
    bannerVisibilityType: "hidden" | "show" | "show-logged-only"
  } = {
    show: true,
    text: "",
    colorClass: "is-primary-600",
    bannerVisibilityType: "hidden",
  };
  /**
   * Is logged in
   */
  public isLoggedIn = false;
  /**
   * Subscription
   */
  private subs = new Subscription();

  constructor(private readonly naoUsersService: NaoUserAccessService) {
  }


  public ngOnInit(): void {
    // -->Subscribe: to appInfo changes
    this.subs.add(
      appInfo$.subscribe((value) => {
        if (value?.shopInfo?.navigationAndFooter?.data?.bannerVisibility) {
          // -->Set: visibility
          this.topNavBar.bannerVisibilityType = value.shopInfo.navigationAndFooter.data.bannerVisibility;
          // -->Set: text
          this.topNavBar.text = value.shopInfo.navigationAndFooter.data.bannerText;
          // -->Set: color based on switch
          switch (value.shopInfo.navigationAndFooter.data.bannerColor) {
            case 'text-3': {
              this.topNavBar.colorClass = 'is-text-3';
              break;
            }
            case 'purple-300': {
              this.topNavBar.colorClass = 'is-purple-300';
              break;
            }
            case 'primary-600': {
              this.topNavBar.colorClass = 'is-primary-600';
              break;
            }
            default: {
              this.topNavBar.colorClass = 'is-primary';
              break;
            }
          }
        }
      }),
    );
    // -->Subscribe: to any logged in changes
    this.subs.add(
      this.naoUsersService.isLoggedIn$.subscribe((isLoggedIn) => {
        this.isLoggedIn = isLoggedIn;
      }),
    );
  }


  /**
   * Dismiss top bar
   */
  public dismissTopNavBar(): void {
    this.topNavBar.show = false;
  }


  /**
   * Check: visibility based on banner visibility type
   */


  public ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

}
