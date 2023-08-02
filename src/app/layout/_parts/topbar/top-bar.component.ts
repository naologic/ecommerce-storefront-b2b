import { Component } from "@angular/core";

@Component({
  selector: "app-top-bar",
  templateUrl: "./top-bar.component.html",
  styleUrls: ["./top-bar.component.scss"]
})
export class TopBarComponent {
  /**
   * Information for top nav
   */
  public topNavBar: {
    show: boolean,
    text: string,
    colorClass: "is-primary" | "is-text-3" | "is-purple-300" | "is-primary-600"
  } = {
    show: true,
    text: "Special Summer Sale - 10% off all orders over $1000!",
    colorClass: "is-primary-600"
  };

  constructor() {
  }

  /**
   * Dismiss top bar
   */
  public dismissTopNavBar(): void {
    this.topNavBar.show = false;
  }

}
