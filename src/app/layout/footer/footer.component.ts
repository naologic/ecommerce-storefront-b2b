import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from "rxjs";
import { AppService } from "../../app.service";
import {appInfo$} from "../../../app.static";

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
          supportPhoneNumber: value?.shopInfo?.storefrontSettings?.data?.phoneNumber || '',
          supportEmailAddress: value?.shopInfo?.storefrontSettings?.data?.supportEmail || '',
          location: value?.shopInfo?.storefrontSettings?.data?.location || '',
          workingHours: value?.shopInfo?.storefrontSettings?.data?.workingHours || '',
        }
      })
    )
  }

  public ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
