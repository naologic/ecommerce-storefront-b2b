import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { AppService } from "../../../app.service";
import { appInfo$ } from "../../../../app.static";


@Component({
  selector: "app-socials",
  templateUrl: "./socials.component.html",
  styleUrls: ["./socials.component.scss"],
})
export class SocialsComponent implements OnInit, OnDestroy {
  /**
   * data
   */
  public data: {
    show: boolean,
    socialMedia: any[]
  } = {
    show: false,
    socialMedia: []
  };
  /**
   * Accepted social types
   */
  private acceptedSocialTypes = ['facebook', 'twitter', 'linkedin', 'tiktok', 'instagram', 'youtube'];
  /**
   * Subs
   */
  private subs = new Subscription();

  constructor(
    public appService: AppService,
  ) {
  }

  public ngOnInit(): void {
    // -->Subscribe: to appInfo changes
    this.subs.add(
      appInfo$.subscribe(value => {
        this.data.show = value?.shopInfo?.navigationAndFooter?.data?.displaySocialIcons || false;
        // -->Set: companyLogo
        this.data.socialMedia = (value?.shopInfo?.navigationAndFooter?.data?.socialMediaIcons || []).filter(f => this.acceptedSocialTypes.includes(f.socialMediaType));
      }),
    );
  }

  public ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
