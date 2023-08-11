import { Component, HostBinding, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { AppService } from "../../../app.service";
import { appInfo$, AppStatic$ } from "../../../../app.static";


@Component({
  selector: "app-socials",
  templateUrl: "./socials.component.html",
  styleUrls: ["./socials.component.scss"],
})
export class SocialsComponent implements OnInit, OnDestroy {
  @HostBinding('class.d-none') hideComponent = true;
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
  /**
   * Device DPI
   */
  private deviceDpi = 1;

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
        // -->Check: if we need to hide the component
        this.hideComponent = !(this.data.show && this.data.socialMedia.length);
      }),
    );

    this.subs.add(
      AppStatic$.windowDetails.subscribe(value => {
        this.deviceDpi = value?.devicePixelRatio || 1
      })
    )
  }


  /**
   * Get: image src using DPI
   */
  public getImageSrc(basePath: string): string {
    return this.deviceDpi > 1 ? `${basePath}@4x.png` : `${basePath}.png`;
  }

  public ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
