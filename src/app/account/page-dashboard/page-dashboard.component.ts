import {Component, OnDestroy, OnInit} from "@angular/core";
import {Subject, Subscription} from "rxjs";
import {NaoUserAccessService, NaoUsersInterface} from "../../nao-user-access";
import {UrlService} from "../../services/url.service";
import {AccountAuthService} from "../account-auth.service";
import {accountData$} from "../../../app.static";
import {AppService} from "../../app.service";

@Component({
  selector: "app-page-dashboard",
  templateUrl: "./page-dashboard.component.html",
  styleUrls: ["./page-dashboard.component.scss"],
})
export class PageDashboardComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  private subs = new Subscription();
  public address!: NaoUsersInterface.Address;
  public userData: NaoUsersInterface.UserData|null = null;

  constructor(
    private readonly accountAuthService: AccountAuthService,
    private readonly appService: AppService,
    private readonly naoUsersService: NaoUserAccessService,
    public readonly url: UrlService
  ) {
  }

  public ngOnInit(): void {
    // -->Ensure: user data
    this.accountAuthService.ensureUserData({})
      .then((ok) => {
        // -->Set: account information
        return this.appService.getAccountDataInformation();
      });
    // -->Subscribe: to userData
    this.subs.add(
      this.naoUsersService.userData.subscribe((userData) => {
        // -->Set: user data
        if (userData) {
          this.userData = userData;
        }
      }),
    );
    // -->Subscribe: to account data
    this.subs.add(
      accountData$.subscribe((accountData) => {
        // -->Set: account information
        this.address = Array.isArray(accountData?.addresses) ? accountData.addresses[0] || null : null;
      }),
    );


  }

  public ngOnDestroy(): void {
    this.subs.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
