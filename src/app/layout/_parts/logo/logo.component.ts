import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { AppService } from "../../../app.service";
import {appInfo$} from "../../../../app.static";

@Component({
  selector: 'app-logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.scss'],
})
export class LogoComponent implements OnInit, OnDestroy {
  private subs = new Subscription();
  public companyLogo: string | undefined;

  constructor(
    public appService: AppService,
  ) { }

  public ngOnInit(): void {
    // -->Subscribe: to appInfo changes
    this.subs.add(
      appInfo$.subscribe(value => {
        // -->Set: companyLogo
        this.companyLogo = value?.shopInfo?.storefrontDisplay?.data?.companyLogo;
      })
    );
  }

  public ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
