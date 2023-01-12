import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subject, Subscription } from "rxjs";
import { NaoUserAccessService, NaoUsersInterface } from "@naologic/nao-user-access";
import { UrlService } from "../../services/url.service";
import { AccountAuthService } from "../account-auth.service";
import { accountData$ } from "../../../app.static";

@Component({
    selector: "app-page-dashboard",
    templateUrl: "./page-dashboard.component.html",
    styleUrls: ["./page-dashboard.component.scss"],
})
export class PageDashboardComponent implements OnInit, OnDestroy {
    private destroy$: Subject<void> = new Subject<void>();
    private subs = new Subscription();
    public address!: NaoUsersInterface.Address;
    public userData = null;

    constructor(private readonly accountAuthService: AccountAuthService, private readonly naoUsersService: NaoUserAccessService, public readonly url: UrlService) {}

    public ngOnInit(): void {
        // -->Subscribe: to userData
        this.subs.add(
            this.naoUsersService.userData.subscribe((userData) => {
                // -->Set: user data
                this.userData = userData;
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
