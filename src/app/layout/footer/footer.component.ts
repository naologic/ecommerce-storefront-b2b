import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from "rxjs";
import { AppService } from "../../app.service";
import { appInfo$ } from "../../../app.static";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit, OnDestroy {
  private subs = new Subscription();

  public infoSupport = null;


  constructor(public appService: AppService) { }

  public ngOnInit(): void {
    this.subs.add(
      appInfo$.subscribe(value => {
        // -->Set: info
        this.infoSupport = {
          supportPhoneNumber: value?.shopInfo?.companyInformation?.data?.phoneNumber || '',
          supportEmailAddress: value?.shopInfo?.companyInformation?.data?.supportEmail || '',
          location: value?.shopInfo?.companyInformation?.data?.location || '',
          workingHours: value?.shopInfo?.companyInformation?.data?.workingHours || '',
          contactUs: value?.shopInfo?.navigationAndFooter?.data?.footerContactUs || '',
          ourGuarantee: value?.shopInfo?.navigationAndFooter?.data?.footerOurGuarantee || '',
          ourGuaranteeTitle: value?.shopInfo?.navigationAndFooter?.data?.footerOurGuaranteeTitle || '',
        }
      })
    )
  }

  public ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
