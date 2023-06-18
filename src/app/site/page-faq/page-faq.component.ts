import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from "rxjs";
import { UrlService } from '../../services/url.service';
import { AppService } from "../../app.service";
import {appInfo$} from "../../../app.static";

@Component({
  selector: 'app-page-faq',
  templateUrl: './page-faq.component.html',
  styleUrls: ['./page-faq.component.scss'],
})
export class PageFaqComponent implements OnInit, OnDestroy {
  private subs = new Subscription();

  public faq = [];
  public supportEmailAddress: string;
  public supportPhoneNumber: string;

  constructor(
    public url: UrlService,
    public appService: AppService,
  ) { }

  public ngOnInit(): void {
    // -->Subscribe: to appInfo changes
    this.subs.add(
      appInfo$.subscribe(value => {
        // -->Set: faq items
        this.faq = value?.shopInfo?.support?.data?.faqItems || [];
        this.supportEmailAddress = value?.shopInfo?.storefrontSettings?.data?.supportEmail || '';
      })
    );
  }

  public ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
